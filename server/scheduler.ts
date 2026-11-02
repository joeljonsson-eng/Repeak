import cron from 'node-cron';
import { db } from './db';
import { runTrendIngestion } from './trendEngine';
import { Trend } from '../src/types';

// Constants for scheduling operation
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const RETRY_BACKOFF_BASE_MS = 5000; // 5 seconds initial delay
const MAX_RETRIES = 3;

// Cache structures
interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

const trendCache: Record<string, CacheEntry<Trend[]>> = {};

// In-Memory Scheduler Telemetry Logging (for inspection / operations monitoring)
export interface SchedulerLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  event: string;
  message: string;
  details?: any;
}

const schedulerLogs: SchedulerLog[] = [];
let isRefreshing = false;
let activeRefreshPromise: Promise<Trend[]> | null = null;
let lastRefreshedAt: string | null = null;
let consecutiveFailures = 0;
let nextScheduledRun: string | null = null;

export function addSchedulerLog(level: 'INFO' | 'WARN' | 'ERROR', event: string, message: string, details?: any) {
  const logEntry: SchedulerLog = {
    timestamp: new Date().toISOString(),
    level,
    event,
    message,
    details
  };
  // Limit to last 100 logs
  if (schedulerLogs.length >= 100) {
    schedulerLogs.shift();
  }
  schedulerLogs.push(logEntry);
  
  // Format console log elegantly
  const icon = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : 'ℹ️';
  console.log(`[Scheduler] ${icon} [${logEntry.timestamp}] [${event}] ${message}`);
}

/**
 * Robust sleeping helper for non-blocking exponential backoff delay execution
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cache GET accessor
 */
export function getCachedTrends(category?: string): Trend[] | null {
  const key = category || '_all_';
  const entry = trendCache[key];
  if (entry && Date.now() < entry.expiresAt) {
    addSchedulerLog('INFO', 'CACHE_HIT', `Returning cached trends for key: ${key}`);
    return entry.data;
  }
  return null;
}

/**
 * Cache SET accessor
 */
export function setCachedTrends(category: string | undefined, data: Trend[], ttlMs: number = TWENTY_FOUR_HOURS_MS) {
  const key = category || '_all_';
  trendCache[key] = {
    data,
    cachedAt: Date.now(),
    expiresAt: Date.now() + ttlMs
  };
  addSchedulerLog('INFO', 'CACHE_UPDATED', `Cached ${data.length} items for key: ${key}. Expires at: ${new Date(Date.now() + ttlMs).toISOString()}`);
}

/**
 * Cache INVALIDATE accessor
 */
export function invalidAllTrendCaches() {
  for (const key of Object.keys(trendCache)) {
    delete trendCache[key];
  }
  addSchedulerLog('INFO', 'CACHE_INVALIDATED', 'Cleared all in-memory trend caches.');
}

/**
 * Evaluates and returns detailed operational status of the background system
 */
export function getSchedulerStatus() {
  return {
    isActive: true,
    isCurrentlyRefreshing: isRefreshing,
    lastRefreshedAt,
    consecutiveFailures,
    nextScheduledRun,
    cacheEntries: Object.keys(trendCache).map(key => ({
      key,
      cachedAt: new Date(trendCache[key].cachedAt).toISOString(),
      expiresAt: new Date(trendCache[key].expiresAt).toISOString(),
      itemCount: trendCache[key].data.length
    })),
    logs: [...schedulerLogs].reverse()
  };
}

/**
 * Performs core daily trend refresh sequence.
 * 1. Runs Ingest - updates scores of existing matches, inserts shiny new trends discovered.
 * 2. Prunes - deletes stale trends untouched since prior cycles.
 * 3. Cache - rebuilds query cache records.
 */
export async function executeTrendRefreshJob(): Promise<Trend[]> {
  if (activeRefreshPromise) {
    addSchedulerLog('INFO', 'REFRESH_ATTACHED', 'Daily refresh job requested while an execution cycle is already active. Reusing the pending run.');
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    isRefreshing = true;
    addSchedulerLog('INFO', 'REFRESH_STARTED', 'Daily trend refresh job started asynchronously.');
    const startTime = Date.now();

    let attempt = 0;
    let itemsSaved: Trend[] = [];
    let errorOccurred: any = null;

    // 1. Ingest with retry handling (exponential backoff)
    while (attempt < MAX_RETRIES) {
      try {
        if (attempt > 0) {
          addSchedulerLog('WARN', 'RETRY_ATTEMPT', `Retrying ingestion. Attempt ${attempt + 1}/${MAX_RETRIES}...`);
        }
        
        // Perform fashion catalog scraping / update
        itemsSaved = await runTrendIngestion();
        
        if (itemsSaved && itemsSaved.length > 0) {
          // Success! Break loop
          break;
        } else {
          throw new Error("Zero active trends returned during ingestion sequence.");
        }
      } catch (error: any) {
        attempt++;
        errorOccurred = error;
        addSchedulerLog('ERROR', 'INGESTION_FAILED', `Attempt ${attempt} of ${MAX_RETRIES} failed: ${error.message || error}`);
        
        if (attempt < MAX_RETRIES) {
          const backoffTime = RETRY_BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
          addSchedulerLog('INFO', 'RETRY_BACKOFF', `Scheduling next attempt in ${backoffTime / 1000} seconds...`);
          await sleep(backoffTime);
        }
      }
    }

    // Handle ultimate failure state
    if (itemsSaved.length === 0) {
      isRefreshing = false;
      consecutiveFailures++;
      addSchedulerLog('ERROR', 'REFRESH_ABORTED', `All ${MAX_RETRIES} attempts failed. Aborting refresh transaction.`, {
        consecutiveFailures,
        lastError: errorOccurred?.message || errorOccurred
      });
      throw errorOccurred || new Error("Failed to refresh fashion trends.");
    }

    // 2. Clear out outdated items (Older than 24 hours, keeping active core assets)
    try {
      const deletedCount = await db.removeOutdatedTrends(24);
      addSchedulerLog('INFO', 'PRUNING_COMPLETED', `Database cleaning completed. Removed ${deletedCount} obsolete fashion trends.`);
    } catch (pruneError: any) {
      addSchedulerLog('WARN', 'PRUNING_WARNING', `Outdated trend cleaning skipped or reported error: ${pruneError.message || pruneError}`);
    }

    // 3. Re-prime/Invalidate standard memory cache
    invalidAllTrendCaches();

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    lastRefreshedAt = new Date().toISOString();
    consecutiveFailures = 0;
    isRefreshing = false;

    addSchedulerLog('INFO', 'REFRESH_SUCCESSFUL', `Daily trend refresh completed successfully in ${durationSec}s. Count: ${itemsSaved.length} items logged.`);
    return itemsSaved;
  })();

  try {
    return await activeRefreshPromise;
  } finally {
    activeRefreshPromise = null;
  }
}

/**
 * Initializes the background scheduling routines
 */
export function startDaemonScheduler() {
  addSchedulerLog('INFO', 'SCHEDULER_INIT', 'Initializing Daily Trend Refresh daemon scheduler.');

  // Calculate standard next execution trigger time for display
  const updateNextRunEstimate = () => {
    const d = new Date();
    d.setHours(24, 0, 0, 0); // Tomorrow midnight
    nextScheduledRun = d.toISOString();
  };
  updateNextRunEstimate();

  // Setup main Daily (24h) trigger task: "Automatic refresh every 24 hours"
  // Scheduled rule: '0 0 * * *' (At midnight every single day)
  cron.schedule('0 0 * * *', async () => {
    addSchedulerLog('INFO', 'SCHEDULED_TRIGGER', 'Daily cron scheduled clock point reached. Executing refresh.');
    try {
      await executeTrendRefreshJob();
    } catch (err: any) {
      addSchedulerLog('ERROR', 'SCHEDULED_JOB_ERROR', `Asynchronous automatic refresh handler encountered fatal failure: ${err.message || err}`);
    } finally {
      updateNextRunEstimate();
    }
  });

  // Schedule a clean logs buffer flush job every Sunday at 3AM
  cron.schedule('0 3 * * 0', () => {
    addSchedulerLog('INFO', 'LOGS_FLUSH', 'Executing periodic logs buffer trim.');
    schedulerLogs.length = 0;
    addSchedulerLog('INFO', 'LOGS_FLUSH_DONE', 'Scheduler logs buffer successfully trimmed.');
  });
}
