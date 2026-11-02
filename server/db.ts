import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { Trend, TrendHistory } from '../src/types';
import admin from 'firebase-admin';
import firebaseConfig from '../firebase-applet-config.json';

const LOCAL_DB_PATH = path.join(process.cwd(), 'server', 'local_db.json');

// Interface definition for generic database repository
export interface TrendRepository {
  getTrends(category?: string): Promise<Trend[]>;
  upsertTrend(trend: Omit<Trend, 'id' | 'created_at' | 'updated_at'>): Promise<Trend>;
  getTrendHistory(trendId: string): Promise<TrendHistory[]>;
  clearTrends(): Promise<void>;
  removeOutdatedTrends(maxAgeHours: number): Promise<number>;
}

// 1. Safe Supabase Client Initialization
let supabase: ReturnType<typeof createClient> | null = null;

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("⚡ Supabase interface initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize Supabase client:", error);
  }
} else {
  console.warn("⚠️ Supabase credentials missing (SUPABASE_URL / SUPABASE_ANON_KEY). Utilizing fallback JSON database for simulation.");
}

// 1.5 Safe Firebase Admin Initialization
let adminDb: admin.firestore.Firestore | null = null;
if (firebaseConfig && firebaseConfig.projectId) {
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
    adminDb = new admin.firestore.Firestore({
      projectId: firebaseConfig.projectId,
      databaseId: (firebaseConfig as any).firestoreDatabaseId,
    });
    console.log("🔥 Firebase Admin Firestore interface initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin Firestore client:", error);
  }
}

// 2. Local File / In-Memory Transient DB Fallback
class LocalTrendRepository implements TrendRepository {
  private getLocalData(): { trends: Trend[]; history: TrendHistory[] } {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initial = { trends: [], history: [] };
      fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    try {
      return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
    } catch {
      return { trends: [], history: [] };
    }
  }

  private saveLocalData(data: { trends: Trend[]; history: TrendHistory[] }) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  }

  private ensureHistoricalSnapshots(data: { trends: Trend[]; history: TrendHistory[] }, trendRecord: Trend): boolean {
    // Disabled to ensure all percentage changes are based on real actual data, never faked or estimated.
    // If no real historical data points exist, the UI will correctly display "Insufficient data".
    return false;
  }

  async getTrends(category?: string): Promise<Trend[]> {
    const data = this.getLocalData();
    let updated = false;
    for (const t of data.trends) {
      if (this.ensureHistoricalSnapshots(data, t)) {
        updated = true;
      }
    }
    if (updated) {
      this.saveLocalData(data);
    }

    let list = data.trends;
    if (category) {
      list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    // Return sorted by score descending
    return list.sort((a, b) => b.trend_score - a.trend_score);
  }

  async upsertTrend(item: Omit<Trend, 'id' | 'created_at' | 'updated_at'>): Promise<Trend> {
    const data = this.getLocalData();
    const now = new Date().toISOString();

    // Check if item already exists by unique key: trend_name + category + marketplace
    const existingIndex = data.trends.findIndex(
      t => t.trend_name.toLowerCase() === item.trend_name.toLowerCase() &&
           t.category.toLowerCase() === item.category.toLowerCase() &&
           t.marketplace.toLowerCase() === item.marketplace.toLowerCase()
    );

    let trendRecord: Trend;

    if (existingIndex > -1) {
      const existing = data.trends[existingIndex];
      trendRecord = {
        ...existing,
        image_url: item.image_url || existing.image_url,
        trend_score: item.trend_score,
        growth_percent: item.growth_percent,
        source: item.source,
        resale_price: item.resale_price,
        
        // Dynamic scoring metrics
        search_growth: item.search_growth,
        engagement_growth: item.engagement_growth,
        marketplace_activity: item.marketplace_activity,
        resale_activity: item.resale_activity,
        social_mentions: item.social_mentions,
        confidence_score: item.confidence_score,
        
        // AI Trend Prediction metrics
        predicted_growth: item.predicted_growth,
        future_trend_score: item.future_trend_score,
        prediction_confidence: item.prediction_confidence,
        
        updated_at: now
      };
      data.trends[existingIndex] = trendRecord;
    } else {
      trendRecord = {
        ...item,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
      };
      data.trends.push(trendRecord);
    }

    // Capture history record (Trend history support)
    const historyRecord: TrendHistory = {
      id: crypto.randomUUID(),
      trend_id: trendRecord.id!,
      trend_score: trendRecord.trend_score,
      growth_percent: trendRecord.growth_percent,
      resale_price: trendRecord.resale_price,
      recorded_at: now
    };
    data.history.push(historyRecord);

    this.saveLocalData(data);
    return trendRecord;
  }

  async getTrendHistory(trendId: string): Promise<TrendHistory[]> {
    const data = this.getLocalData();
    return data.history
      .filter(h => h.trend_id === trendId)
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
  }

  async clearTrends(): Promise<void> {
    this.saveLocalData({ trends: [], history: [] });
  }

  async removeOutdatedTrends(maxAgeHours: number): Promise<number> {
    const data = this.getLocalData();
    const cutoffTime = Date.now() - maxAgeHours * 60 * 60 * 1000;
    const coreBrands = ["acne studios", "totême", "arket", "ganni"];

    const keepTrends: Trend[] = [];
    const discardIds: string[] = [];

    for (const t of data.trends) {
      const isCore = coreBrands.includes(t.trend_name.trim().toLowerCase());
      const updatedTime = t.updated_at ? new Date(t.updated_at).getTime() : 0;
      
      if (isCore || updatedTime >= cutoffTime) {
        keepTrends.push(t);
      } else {
        if (t.id) discardIds.push(t.id);
      }
    }

    const removedCount = data.trends.length - keepTrends.length;
    
    // Filter history to remove orphan records
    const keepHistory = data.history.filter(h => !discardIds.includes(h.trend_id));

    this.saveLocalData({ trends: keepTrends, history: keepHistory });
    console.log(`🧹 [Local DB Cache Cleaner] Pruned ${removedCount} stale trends older than ${maxAgeHours} hours.`);
    return removedCount;
  }
}

// 3. Postgres / Supabase Implementation of the repository
class SupabaseTrendRepository implements TrendRepository {
  async getTrends(category?: string): Promise<Trend[]> {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    
    let query = (supabase as any)
      .from('trends')
      .select('*')
      .order('trend_score', { ascending: false });
      
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching trends from Supabase:", error);
      throw error;
    }
    return data || [];
  }

  async upsertTrend(item: Omit<Trend, 'id' | 'created_at' | 'updated_at'>): Promise<Trend> {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    // Perform upsert command on the unique constraint (trend_name, category, marketplace)
    const { data, error } = await (supabase as any)
      .from('trends')
      .upsert({
        trend_name: item.trend_name,
        category: item.category,
        image_url: item.image_url,
        trend_score: item.trend_score,
        growth_percent: item.growth_percent,
        source: item.source,
        resale_price: item.resale_price,
        marketplace: item.marketplace,
        
        // Injected trend scoring metrics
        search_growth: item.search_growth,
        engagement_growth: item.engagement_growth,
        marketplace_activity: item.marketplace_activity,
        resale_activity: item.resale_activity,
        social_mentions: item.social_mentions,
        confidence_score: item.confidence_score,

        // AI Trend Prediction metrics
        predicted_growth: item.predicted_growth,
        future_trend_score: item.future_trend_score,
        prediction_confidence: item.prediction_confidence
      }, {
        onConflict: 'trend_name,category,marketplace',
        ignoreDuplicates: false
      })
      .select('*')
      .single();

    if (error) {
      console.error("Error upserting trend in Supabase:", error);
      throw error;
    }

    return data;
  }

  async getTrendHistory(trendId: string): Promise<TrendHistory[]> {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    const { data, error } = await (supabase as any)
      .from('trend_history')
      .select('*')
      .eq('trend_id', trendId)
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error("Error fetching trend history from Supabase:", error);
      throw error;
    }

    return data || [];
  }

  async clearTrends(): Promise<void> {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    const { error } = await (supabase as any).from('trends').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  }

  async removeOutdatedTrends(maxAgeHours: number): Promise<number> {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    const cutoffDate = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000).toISOString();
    
    // Protect our core visual demo assets from any expiration rule
    const coreBrands = ["Acne Studios", "Totême", "Arket", "Ganni"];
    
    // Find matching records
    const { data: matched, error: selError } = await (supabase as any)
      .from('trends')
      .select('id')
      .lt('updated_at', cutoffDate)
      .not('trend_name', 'in', `(${coreBrands.map(b => `"${b}"`).join(',')})`);
      
    if (selError) {
      console.error("Error matching outdated trends from Supabase:", selError);
      throw selError;
    }
    
    if (!matched || matched.length === 0) {
      return 0;
    }
    
    const idsToDelete = matched.map((m: any) => m.id);
    const { error: delError } = await (supabase as any)
      .from('trends')
      .delete()
      .in('id', idsToDelete);
      
    if (delError) {
      console.error("Error executing prune statement in Supabase:", delError);
      throw delError;
    }
    
    console.log(`🧹 [Supabase DB Cleaner] Successfully pruned ${idsToDelete.length} stale fashion trends.`);
    return idsToDelete.length;
  }
}

// 3.5 Firebase Firestore Implementation of the repository
class FirestoreTrendRepository implements TrendRepository {
  async getTrends(category?: string): Promise<Trend[]> {
    if (!adminDb) throw new Error("Firestore Admin client is not initialized.");
    
    console.log("🌐 [Admin Firestore] Fetching fashion trends...");
    const colRef = adminDb.collection('trends');
    let q: admin.firestore.Query = colRef.orderBy('trend_score', 'desc');
    
    if (category) {
      q = colRef.where('category', '==', category).orderBy('trend_score', 'desc');
    }

    const snap = await q.get();
    const results: Trend[] = [];
    snap.forEach(docSnap => {
      results.push({ id: docSnap.id, ...docSnap.data() } as Trend);
    });
    console.log(`🌐 [Admin Firestore] Loaded ${results.length} trends.`);
    return results;
  }

  async upsertTrend(item: Omit<Trend, 'id' | 'created_at' | 'updated_at'>): Promise<Trend> {
    if (!adminDb) throw new Error("Firestore Admin client is not initialized.");

    const trendId = `${item.marketplace}_${item.category}_${item.trend_name}`.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const docRef = adminDb.collection('trends').doc(trendId);
    
    const now = new Date().toISOString();
    
    let created_at = now;
    try {
      const existingSnap = await docRef.get();
      if (existingSnap.exists) {
        created_at = existingSnap.data()?.created_at || now;
      }
    } catch (ignore) {
      // Allow seamless silent creation if connectivity is loading
    }

    const trendData: Trend = {
      ...item,
      id: trendId,
      created_at,
      updated_at: now
    };

    console.log(`🌐 [Admin Firestore] Upserting trend segment in Firestore: "${item.trend_name}"`);
    await docRef.set(trendData);

    const historyId = `hist_${Date.now()}`;
    const historyRef = adminDb.collection('trends').doc(trendId).collection('history').doc(historyId);
    
    await historyRef.set({
      trend_id: trendId,
      trend_score: item.trend_score,
      growth_percent: item.growth_percent,
      resale_price: item.resale_price || null,
      recorded_at: now
    });

    return trendData;
  }

  async getTrendHistory(trendId: string): Promise<TrendHistory[]> {
    if (!adminDb) throw new Error("Firestore Admin client is not initialized.");

    const colRef = adminDb.collection('trends').doc(trendId).collection('history');
    const q = colRef.orderBy('recorded_at', 'asc');
    const snap = await q.get();
    const history: TrendHistory[] = [];
    snap.forEach(docSnap => {
      history.push({ id: docSnap.id, ...docSnap.data() } as TrendHistory);
    });
    return history;
  }

  async clearTrends(): Promise<void> {
    if (!adminDb) throw new Error("Firestore Admin client is not initialized.");
    const snap = await adminDb.collection('trends').get();
    const batch = adminDb.batch();
    snap.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  }

  async removeOutdatedTrends(maxAgeHours: number): Promise<number> {
    if (!adminDb) throw new Error("Firestore Admin client is not initialized.");
    const cutoffTime = Date.now() - maxAgeHours * 60 * 60 * 1000;
    const coreBrands = ["acne studios", "totême", "arket", "ganni"];
    const snap = await adminDb.collection('trends').get();
    let count = 0;
    const batch = adminDb.batch();
    
    snap.forEach(docSnap => {
      const data = docSnap.data();
      const isCore = coreBrands.includes((data.trend_name || '').trim().toLowerCase());
      const updatedTime = data.updated_at ? new Date(data.updated_at).getTime() : 0;
      
      if (!isCore && updatedTime < cutoffTime) {
        batch.delete(docSnap.ref);
        count++;
      }
    });
    
    if (count > 0) {
      await batch.commit();
    }
    return count;
  }
}

// 4. Robust Fallback Decorator to protect against any connection or query runtime failures
class FallbackTrendRepository implements TrendRepository {
  private isPrimaryHealthy = true;

  constructor(
    private primary: TrendRepository,
    private fallback: TrendRepository
  ) {
    // Run an asynchronous check on startup
    this.checkPrimaryHealth();
  }

  private async checkPrimaryHealth() {
    try {
      // Small probe request to test health
      await this.primary.getTrends();
      this.isPrimaryHealthy = true;
      console.log("🔥 Primary database connection is healthy.");
    } catch (err: any) {
      this.isPrimaryHealthy = false;
      console.log("ℹ️ Primary cloud storage is offline or reserved. Activating robust local JSON database as core storage engine.");
    }
  }

  async getTrends(category?: string): Promise<Trend[]> {
    if (!this.isPrimaryHealthy) {
      return await this.fallback.getTrends(category);
    }
    try {
      return await this.primary.getTrends(category);
    } catch (err: any) {
      this.isPrimaryHealthy = false;
      console.warn("⚠️ Primary getTrends failed, disabling primary and falling back to local JSON database:", err instanceof Error ? err.message : String(err));
      return await this.fallback.getTrends(category);
    }
  }

  async upsertTrend(item: Omit<Trend, 'id' | 'created_at' | 'updated_at'>): Promise<Trend> {
    if (!this.isPrimaryHealthy) {
      return await this.fallback.upsertTrend(item);
    }
    try {
      return await this.primary.upsertTrend(item);
    } catch (err: any) {
      this.isPrimaryHealthy = false;
      console.warn(`⚠️ Primary upsertTrend failed for "${item.trend_name}", disabling primary and falling back to local JSON database:`, err instanceof Error ? err.message : String(err));
      return await this.fallback.upsertTrend(item);
    }
  }

  async getTrendHistory(trendId: string): Promise<TrendHistory[]> {
    if (!this.isPrimaryHealthy) {
      return await this.fallback.getTrendHistory(trendId);
    }
    try {
      return await this.primary.getTrendHistory(trendId);
    } catch (err: any) {
      this.isPrimaryHealthy = false;
      console.warn(`⚠️ Primary getTrendHistory failed for ID "${trendId}", disabling primary and falling back to local JSON database:`, err instanceof Error ? err.message : String(err));
      return await this.fallback.getTrendHistory(trendId);
    }
  }

  async clearTrends(): Promise<void> {
    if (!this.isPrimaryHealthy) {
      await this.fallback.clearTrends();
      return;
    }
    try {
      await this.primary.clearTrends();
    } catch (err: any) {
      this.isPrimaryHealthy = false;
      console.warn("⚠️ Primary clearTrends failed, disabling primary and falling back to local JSON database:", err instanceof Error ? err.message : String(err));
      await this.fallback.clearTrends();
    }
  }

  async removeOutdatedTrends(maxAgeHours: number): Promise<number> {
    if (!this.isPrimaryHealthy) {
      return await this.fallback.removeOutdatedTrends(maxAgeHours);
    }
    try {
      return await this.primary.removeOutdatedTrends(maxAgeHours);
    } catch (err: any) {
      this.isPrimaryHealthy = false;
      console.warn("⚠️ Primary removeOutdatedTrends failed, disabling primary and falling back to local JSON database:", err instanceof Error ? err.message : String(err));
      return await this.fallback.removeOutdatedTrends(maxAgeHours);
    }
  }
}

const primaryDb = adminDb ? new FirestoreTrendRepository() : (supabase ? new SupabaseTrendRepository() : null);
const fallbackDb = new LocalTrendRepository();

// Export the active repository instance with multi-tiered resilience guarantees
export const db: TrendRepository = primaryDb ? new FallbackTrendRepository(primaryDb, fallbackDb) : fallbackDb;
