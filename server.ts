import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './server/db';
import { runTrendIngestion } from './server/trendEngine';
import { 
  startDaemonScheduler, 
  executeTrendRefreshJob, 
  getCachedTrends, 
  setCachedTrends, 
  invalidAllTrendCaches, 
  getSchedulerStatus 
} from './server/scheduler';
import { searchSecondHand } from './server/searchEngine';
import { getValidTrendImage } from './src/lib/imageResolver';
import { Trend } from './src/types';
import { evaluateFashionPriceTrend } from './server/fashionValuation';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API ROUTE: Chat helper for Modus assistant bot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, language } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      const offlineMsg = language === 'EN'
        ? "Hello! I am Modus, your AI secondhand shopping assistant. Currently, the server's GEMINI_API_KEY is not configured in settings, so I am running in offline mode. Let me know how I can help you, or feel free to configure the key!"
        : "Hej! Jag är Modus, din AI-sökassistent för secondhand. Serverns GEMINI_API_KEY saknas i inställningarna just nu, vilket betyder att jag är i offline-läge. Kontakta administratören för att aktivera mig!";
      return res.json({ success: true, reply: offlineMsg });
    }

    const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = language === 'EN'
      ? `You are "Modus", a small, smart, and ultra-friendly AI assistant helper located in the bottom-right corner of the Repeak secondhand marketplace comparison platform.
Your goals:
1. Help users with sustainable shopping, finding unique secondhand fashion, clothes materials, styling ideas, and size conversions.
2. Explain how to use Repeak (we search Tradera, Plick, Sellpy, Blocket, Vinted, etc., in Sweden to find the absolute best deals, calculate actual market average prices, and flag overpriced listings or potential fakes).
3. Do NOT create or claim to have found random listings that don't exist. Assist realistically with brand knowledge (like Ganni, Acne Studios, Our Legacy, Levi's, Stone Island, etc.).
4. Be supportive, highly engaging, and clear. Svara på engelska, keep paragraphs short, and use occasional bullet points or emojis to be readable and appealing!`
      : `Du är "Modus", en liten, smart och supertrevlig AI-assistent i det nedre högra hörnet på Repeak – Sveriges ledande prisjämförelsetjänst och aggregator för secondhand.
Dina mål:
1. Hjälp användare med hållbart mode, produktmaterial, stylingtips, storleksöversättningar och fyndstrategier.
2. Förklara hur Repeak fungerar (vi söker på plattformar som Tradera, Plick, Sellpy, Blocket, Vinted, etc., för att hitta bästa möjliga pris, visa oberoende AI-värderingar och varna för misstänkta överpriser eller kopior).
3. Säg aldrig att du har hittat specifika aktiva annonser som inte har sökts fram via sökfältet. Ge istället smarta generella råd och tips om populära märken (som Ganni, Acne Studios, Our Legacy, Levi's, Stone Island, etc.).
4. Svara alltid på engagerande, varm, expertlik och inspirerande svenska. Håll styckena korta och använd gärna punktlistor och glada emojis för hög läsbarhet!`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "Förlåt, jag kunde inte tolka det. Kan du ställa din fråga igen?";
    return res.json({ success: true, reply });
  } catch (err: any) {
    console.error("🔴 [Modus Chat] Generation failed:", err);
    return res.status(500).json({ success: false, error: err.message || "Internally failed to process chat request." });
  }
});

// API ROUTE: Real-time Fashion Item Valuation and Price Trend Analysis (Powered by Gemini)
app.post('/api/fashion-valuation', async (req, res) => {
  try {
    const { itemName, askingPrice, category, condition, marketplace, language } = req.body;
    if (!itemName || typeof itemName !== 'string' || !itemName.trim()) {
      return res.status(400).json({ success: false, error: "Item name is required for price valuation." });
    }

    const priceNum = Number(askingPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ success: false, error: "Valid positive asking price in SEK is required." });
    }

    console.log(`🤖 [Fashion Valuation] Evaluating "${itemName}" at ${priceNum} SEK (${condition || 'default condition'}, ${marketplace || 'Tradera'})...`);

    const result = await evaluateFashionPriceTrend({
      itemName: itemName.trim(),
      askingPrice: priceNum,
      category: category || 'Kläder & Accessoarer',
      condition: condition || 'Mycket gott skick',
      marketplace: marketplace || 'Tradera',
      language: (language === 'EN' ? 'EN' : 'SV')
    });

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: result
    });
  } catch (err: any) {
    console.error("🔴 [Fashion Valuation] Analysis failed:", err);
    return res.status(500).json({ success: false, error: err.message || "Valuation analysis could not be completed." });
  }
});

// API ROUTE: Live orchestrated secondhand compare marketplace search
app.get('/api/search', async (req, res) => {
  try {
    const { q, sortBy, size, maxPrice } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: "Search query parameter 'q' is required." });
    }
    
    console.log(`📡 [API/Search] Received request for: "${q}" (sort: ${sortBy}, size: ${size}, maxPrice: ${maxPrice})`);
    
    const results = await searchSecondHand(q, {
      sortBy: sortBy as any,
      size: size as string,
      maxPrice: maxPrice as string
    });
    
    return res.json(results);
  } catch (err: any) {
    console.error("API Error in search second hand:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to query live marketplaces." });
  }
});

// Reusable high-integrity trend enrichment & quality validation pipeline
async function enrichTrendList(list: Trend[]): Promise<Trend[]> {
  const enrichedList: Trend[] = [];
  const now = Date.now();

  for (const trend of list) {
    const resolved = getValidTrendImage(trend.trend_name, trend.category, trend.image_url);
    const finalImage = resolved.image_url || trend.image_url;

    // Strict Data Quality Validation: Verify that required fields exist and are valid before displaying in Hett just nu
    if (
      !trend.trend_name ||
      trend.trend_name.trim() === "" ||
      trend.resale_price === undefined ||
      trend.resale_price === null ||
      trend.resale_price <= 0 ||
      !finalImage ||
      finalImage.trim() === "" ||
      trend.trend_score === undefined ||
      trend.trend_score === null ||
      !trend.source ||
      trend.source.trim() === "" ||
      !trend.marketplace ||
      trend.marketplace.trim() === "" ||
      !trend.category ||
      trend.category.trim() === ""
    ) {
      console.warn(`[Quality Filter] Excluding item "${trend.trend_name || 'Unnamed'}" from Hett just nu due to missing or invalid data. (Price: ${trend.resale_price}, Image: ${finalImage ? 'Yes' : 'No'}, Score: ${trend.trend_score}, Source: ${trend.source}, Marketplace: ${trend.marketplace}, Category: ${trend.category})`);
      continue;
    }

    let status: 'Rising' | 'Stable' | 'Falling' | 'Insufficient' = 'Insufficient';
    let price_change_percent: number | undefined = undefined;
    let price_change_absolute: number | undefined = undefined;

    if (trend.id) {
      const history = await db.getTrendHistory(trend.id);
      
      // Filter out history records that are extremely fresh (e.g. within 10 seconds of current trend's updated_at)
      // to find actual older historical states.
      const currentTimestamp = trend.updated_at ? new Date(trend.updated_at).getTime() : now;
      const pastRecords = (history || []).filter(h => {
        const hTime = new Date(h.recorded_at).getTime();
        return currentTimestamp - hTime > 10 * 1000;
      });

      if (pastRecords.length > 0) {
        // The most recent older record
        const prevRecord = pastRecords[pastRecords.length - 1];
        
        if (trend.trend_score > prevRecord.trend_score) {
          status = 'Rising';
        } else if (trend.trend_score < prevRecord.trend_score) {
          status = 'Falling';
        } else {
          status = 'Stable';
        }

        if (trend.resale_price !== undefined && prevRecord.resale_price !== undefined && prevRecord.resale_price > 0) {
          price_change_absolute = trend.resale_price - prevRecord.resale_price;
          price_change_percent = parseFloat(((price_change_absolute / prevRecord.resale_price) * 100).toFixed(2));
        }
      }
    }

    // High-integrity debug logging to track calculations and source parameters
    console.log(`[DEBUG Trend Enrichment] "${trend.trend_name}" | Category: ${trend.category} | Source: ${trend.source} | Marketplace: ${trend.marketplace} | Score: ${trend.trend_score} | Price: ${trend.resale_price} SEK | Status: ${status} | Price Change: ${price_change_absolute !== undefined ? `${price_change_absolute} SEK (${price_change_percent}%)` : 'Insufficient historical data'} | Updated At: ${trend.updated_at || 'N/A'}`);

    enrichedList.push({
      ...trend,
      image_url: finalImage,
      image_confidence_score: resolved.image_confidence_score,
      trend_status: status,
      price_change_percent: price_change_percent,
      price_change_absolute: price_change_absolute
    });
  }

  return enrichedList;
}

// API ROUTE: Get active trends (enriched with dynamic lineage state and trend telemetry)
app.get('/api/trends', async (req, res) => {
  try {
    const { category } = req.query;
    const cacheKey = category as string | undefined;

    // 1. Try reading from memory cache first to protect database ingress
    const cached = getCachedTrends(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        source: 'cache',
        timestamp: new Date().toISOString(),
        count: cached.length,
        data: cached
      });
    }

    // 2. Cache miss: Query primary active listing repository
    let list = await db.getTrends(cacheKey);
    
    // Auto-seed table on first access if database has 0 fashion trends
    if (list.length === 0) {
      console.log("Empty database detected. Triggering initial background ingestion sequence...");
      await executeTrendRefreshJob();
      list = await db.getTrends(cacheKey);
    }

    // Process and enrich all trends
    const enrichedList = await enrichTrendList(list);
    
    // Warm in-memory cache for subsequent clients
    setCachedTrends(cacheKey, enrichedList);
    
    res.json({
      success: true,
      source: 'database',
      timestamp: new Date().toISOString(),
      count: enrichedList.length,
      data: enrichedList
    });
  } catch (error: any) {
    console.error("API error fetching trends:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to retrieve trends." });
  }
});

// API ROUTE: Trigger trend discovery & updates via robust retry-equipped refresh jobs
app.post('/api/trends/ingest', async (req, res) => {
  try {
    console.log("📥 Instant trend refresh cycle requested manually.");
    const updatedList = await executeTrendRefreshJob();
    const enrichedList = await enrichTrendList(updatedList);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      updated_count: enrichedList.length,
      data: enrichedList
    });
  } catch (error: any) {
    console.error("API error running ingestion job:", error);
    res.status(500).json({ success: false, error: error.message || "Manual ingestion job failed." });
  }
});

// API ROUTE: Inspect background daemon cron schedules, cache registries, and execution logs
app.get('/api/scheduler/status', (req, res) => {
  try {
    const status = getSchedulerStatus();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      status
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch daemon statistics." });
  }
});

// API ROUTE: Get history checkpoints for a specific clothing trend item
app.get('/api/trends/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const history = await db.getTrendHistory(id);
    res.json({
      success: true,
      trend_id: id,
      count: history.length,
      data: history
    });
  } catch (error: any) {
    console.error("API error fetching trend history:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to retrieve history." });
  }
});

// API ROUTE: Clean / Reset database collections and caches
app.delete('/api/trends', async (req, res) => {
  try {
    await db.clearTrends();
    invalidAllTrendCaches();
    res.json({ success: true, message: "Database tables and cache registries cleared successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to clear tables." });
  }
});

// Setup Vite Dev Server / Static Resource Middleware
async function initializeServer() {
  // Boot continuous scheduling daemon
  startDaemonScheduler();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log("👨‍💻 Vite client middleware mounted successfully in development environment.");

    // SPA fallback handler in development:
    app.get('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ success: false, error: "API route not found" });
      }
      try {
        const url = req.originalUrl;
        let template = await fs.promises.readFile(
          path.resolve(process.cwd(), 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ success: false, error: "API route not found" });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sourcing Terminal Server online at http://localhost:${PORT}`);
  });
}

initializeServer();
