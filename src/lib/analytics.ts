/// <reference types="vite/client" />

// Google Analytics and event tracking utility for Repeak

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface AnalyticsLog {
  id: string;
  timestamp: string;
  eventName: string;
  params: Record<string, any>;
}

const analyticsLogs: AnalyticsLog[] = [];

// Initialize Google Analytics gtag dynamically
export function initAnalytics() {
  if (typeof window === 'undefined') return;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.log('[Analytics] No measurement ID found, running in simulator mode (events are still logged below in debug banner).');
    return;
  }

  // Avoid injecting external tracking scripts inside iframe development preview to prevent CSP/ad-blocker "Script error" issues
  try {
    if (window.self !== window.top) {
      console.log('[Analytics] Running inside preview iframe, running in simulator mode to prevent cross-origin script loads.');
      return;
    }
  } catch (e) {
    // If checking window.self throws (e.g. cross-origin restriction), play it safe and return
    return;
  }

  try {
    // 1. Inject Gtag script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gaScript);

    // 2. Setup window.dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

    // 3. Configure initial setup
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure'
    });

    console.log(`[Analytics] Successfully initialized Google Analytics (ID: ${measurementId})`);
  } catch (err) {
    console.error('[Analytics] Error initializing Google Analytics script:', err);
  }
}

// Track an event with parameters
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  const timestamp = new Date().toLocaleTimeString();
  const id = Math.random().toString(36).substring(2, 9);
  
  const logEntry: AnalyticsLog = {
    id,
    timestamp,
    eventName,
    params
  };

  // Push to local logs
  analyticsLogs.unshift(logEntry);
  if (analyticsLogs.length > 50) {
    analyticsLogs.pop();
  }

  // Console output
  console.log(`%c[Analytics Event] ${eventName}`, 'color: #3cbd82; font-weight: bold;', params);

  // Dispatch real Google Analytics event if script is active
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, params);
    } catch (err) {
      console.warn('[Analytics] Failed to send event to standard Google Analytics:', err);
    }
  }

  // Dispatch custom window event to trigger visual telemetry debugger react state updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('repeak_analytics_event', { detail: logEntry }));
  }
}

// Get in-memory logs for the telemetry debug drawer
export function getAnalyticsLogs(): AnalyticsLog[] {
  return [...analyticsLogs];
}

// Clear local tracked logs
export function clearAnalyticsLogs() {
  analyticsLogs.length = 0;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('repeak_analytics_event', { detail: null }));
  }
}
