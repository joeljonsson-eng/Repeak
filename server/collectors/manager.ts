import { GoogleGenAI } from '@google/genai';
import { db } from '../db';
import { Trend } from '../../src/types';
import { SourceCollector, TrendSignal, TrendNormalizer } from './base';
import { TrendScoringEngine } from './scorer';
import { GoogleTrendsCollector } from './GoogleTrendsCollector';
import { RedditCollector } from './RedditCollector';
import { PinterestCollector } from './PinterestCollector';
import { StockXCollector } from './StockXCollector';
import { GrailedCollector } from './GrailedCollector';
import { DepopCollector } from './DepopCollector';
import { addSchedulerLog } from '../scheduler';

export class TrendCollectorManager {
  private collectors: SourceCollector[] = [];
  private ai: GoogleGenAI | null = null;

  constructor() {
    this.initializeGemini();
    this.registerStandardCollectors();
  }

  /**
   * Lazy security-compliant initialization of the GoogleGenAI sdk client
   */
  private initializeGemini() {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      try {
        this.ai = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
        console.log("🧩 [Collector Manager] Gemini API key identified. Live web-grounding enabled for all collectors.");
      } catch (err: any) {
        console.error("❌ [Collector Manager] Failed initializing GoogleGenAI client:", err.message || err);
      }
    } else {
      console.warn("⚠️ [Collector Manager] GEMINI_API_KEY not defined. Collectors will use high-fidelity offline catalogs.");
    }
  }

  /**
   * Standard pre-packaged collectors registration
   */
  private registerStandardCollectors() {
    this.registerCollector(new GoogleTrendsCollector(this.ai));
    this.registerCollector(new RedditCollector(this.ai));
    this.registerCollector(new PinterestCollector(this.ai));
    this.registerCollector(new StockXCollector(this.ai));
    this.registerCollector(new GrailedCollector(this.ai));
    this.registerCollector(new DepopCollector(this.ai));
  }

  /**
   * Registers a source collector (satisfies the "support future sources" design requirement)
   */
  public registerCollector(collector: SourceCollector) {
    const exists = this.collectors.some(c => c.identifier === collector.identifier);
    if (!exists) {
      this.collectors.push(collector);
      console.log(`🔌 Registered new collector: [${collector.name}] (${collector.identifier})`);
    } else {
      console.warn(`Collector with identifier [${collector.identifier}] is already registered.`);
    }
  }

  /**
   * Retrieves all registered collectors
   */
  public getRegisteredCollectors(): SourceCollector[] {
    return [...this.collectors];
  }

  /**
   * Runs the entire collection, normalization, deduplication, and saving transaction
   */
  public async executePipeline(): Promise<Trend[]> {
    addSchedulerLog('INFO', 'COLLECTION_PIPELINE_START', `Executing data collection from ${this.collectors.length} active sources.`);
    
    const startTime = Date.now();
    const rawSignals: TrendSignal[] = [];

    // 1. Gather raw signals from all collectors sequentially (sync queue processing to respect rate limits)
    const collectionResults: { collectorName: string; signals: TrendSignal[]; success: boolean }[] = [];
    
    for (let i = 0; i < this.collectors.length; i++) {
      const collector = this.collectors[i];
      try {
        console.log(`🚀 [Pipeline] Invoking ${collector.name} (${i + 1}/${this.collectors.length})...`);
        const signals = await collector.collect();
        console.log(`✅ [Pipeline] ${collector.name} collected ${signals.length} signals.`);
        collectionResults.push({ collectorName: collector.name, signals, success: true });
        
        // Politeness throttling: delay 1200ms between Gemini calls to prevent hitting rate limits
        if (this.ai && i < this.collectors.length - 1) {
          console.log(`⏱️ [Pipeline] Waiting 1.2s before invoking next collector to pace API utilization...`);
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
      } catch (err: any) {
        addSchedulerLog('WARN', 'COLLECTOR_ERROR', `Collector ${collector.name} reported a collection failure: ${err.message || err}`);
        collectionResults.push({ collectorName: collector.name, signals: [], success: false });
      }
    }
    
    for (const res of collectionResults) {
      rawSignals.push(...res.signals);
    }

    if (rawSignals.length === 0) {
      addSchedulerLog('ERROR', 'COLLECTION_PIPELINE_EMPTY', "All collectors returned empty values or failed. Aborting ingestion pipeline.");
      throw new Error("No fashion trend signals were collected.");
    }

    addSchedulerLog('INFO', 'COLLECTION_COMPLETE', `Gathered ${rawSignals.length} raw trend signals. Beginning normalization and scoring analysis.`);

    // 2. Perform normalization on raw elements
    const normalizedSignals = rawSignals.map(sig => ({
      ...sig,
      trend_name: TrendNormalizer.normalizeName(sig.trend_name),
      category: TrendNormalizer.normalizeCategory(sig.category)
    }));

    // 3. Process and evaluate all signals with Trend Scoring Engine
    const scoredTrends = TrendScoringEngine.processAndScoreAllSignals(normalizedSignals);
    addSchedulerLog('INFO', 'SCORING_COMPLETE', `Trend Scoring Engine evaluated ${normalizedSignals.length} signals down to ${scoredTrends.length} unique scored records.`);

    // 4. Persistence block: upsert trends and output records
    const finalStoredTrends: Trend[] = [];
    let countIn = 0;

    for (const trend of scoredTrends) {
      try {
        const doc = await db.upsertTrend(trend);
        finalStoredTrends.push(doc);
        countIn++;
      } catch (dbErr: any) {
        console.error(`❌ DB error saving trend [${trend.trend_name}]:`, dbErr.message || dbErr);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    addSchedulerLog('INFO', 'PIPELINE_FINISH', `Fashion Trend Collection Pipeline completed successfully in ${elapsed}s. Stored ${countIn}/${scoredTrends.length} records.`);
    
    return finalStoredTrends;
  }
}

// Export singleton instance of the Collection Pipeline Manager
export const collectorManager = new TrendCollectorManager();
