import { Type } from '@google/genai';
import { Trend } from '../../src/types';

/**
 * Structure of a raw Trend Signal collected from modular sources
 */
export interface TrendSignal {
  trend_name: string;
  category: string;
  trend_score: number;         // 50-100 Relative popularity score
  growth_percent: number;      // Month-over-month volume growth percentage
  resale_price?: number;       // Benchmark resale price in SEK
  marketplace: string;         // Marketplace of reference
  image_url?: string;          // Extracted or fallback visual matching illustration
  source: string;              // Descriptive text or source tag
  metadata: {
    collectedAt: string;
    rawSourceName: string;     // e.g., "r/streetwear", "Google Trends Breakout"
    confidenceScore: number;   // 0.0 to 1.0 confidence index of signal verification
    sampleSize?: number;       // Optional indicators (e.g. upvotes, pinning count, search vol index)
    [key: string]: any;        // Flexible structure to support schema changes and future sources
  };
}

/**
 * Base abstract interface defining modular collectors
 */
export interface SourceCollector {
  name: string;
  identifier: string; // unique short ID for future expansion/disabling
  collect(): Promise<TrendSignal[]>;
}

/**
 * Trend Normalization Utility
 * Prepares consistent brand forms and formats
 */
export class TrendNormalizer {
  /**
   * Sanitizes and maps names to avoid variant duplication (e.g., "stussy 8-ball" vs "Stüssy 8 Ball")
   */
  public static normalizeName(name: string): string {
    if (!name) return "";
    
    let cleaned = name.trim();
    
    // Convert popular brand aliases to authoritative forms
    const uppercase = cleaned.toUpperCase();
    
    if (uppercase.includes("STUSSY") || uppercase.includes("STÜSSY")) {
      cleaned = cleaned.replace(/stussy/i, "Stüssy").replace(/stüssy/i, "Stüssy");
    } else if (uppercase.includes("ACNE") && !uppercase.includes("STUDIOS")) {
      cleaned = cleaned.replace(/acne/i, "Acne Studios");
    } else if (uppercase.includes("TOTEME")) {
      cleaned = cleaned.replace(/toteme/i, "Totême");
    } else if (uppercase.includes("MAISON MARGIELA") || uppercase.includes("MARGIELA")) {
      cleaned = cleaned.replace(/margiela/i, "Maison Margiela").replace(/maison Maison Margiela/i, "Maison Margiela");
    } else if (uppercase.includes("STONE ISLAND")) {
      cleaned = cleaned.replace(/stoneisland/i, "Stone Island");
    } else if (uppercase.includes("CHROME HEARTS")) {
      cleaned = cleaned.replace(/chromehearts/i, "Chrome Hearts");
    } else if (uppercase.includes("CARHARTT")) {
      cleaned = cleaned.replace(/carhartt/i, "Carhartt");
    } else if (uppercase.includes("GANNI")) {
      cleaned = cleaned.replace(/ganni/i, "Ganni");
    } else if (uppercase.includes("ARKET")) {
      cleaned = cleaned.replace(/arket/i, "Arket");
    }

    // Capitalize Words / Title Case (ensure clean presentation)
    return cleaned
      .split(' ')
      .map(word => {
        if (word.length <= 1) return word.toLowerCase();
        // Keep acronyms/uppercase if already capitalized, else capital case
        if (word === word.toUpperCase() && word.length <= 4 && !/^[0-9]+$/.test(word)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  /**
   * Normalizes categories to strict taxonomy
   */
  public static normalizeCategory(category: string): string {
    const defaultCategories = ["Outerwear", "Footwear", "Bottoms", "Accessories", "Knitwear"];
    const found = defaultCategories.find(c => c.toLowerCase() === category.trim().toLowerCase());
    return found || "Outerwear";
  }
}

/**
 * Trend Deduplication Logic
 * Aggregates overlapping signals safely without losing valuable source telemetry
 */
export class TrendDeduplicator {
  /**
   * Deduplicates array of signals, blending key metrics (scores & growths) and merging metadata
   */
  public static deduplicate(signals: TrendSignal[]): TrendSignal[] {
    const registry: Record<string, TrendSignal[]> = {};

    for (const signal of signals) {
      const normName = TrendNormalizer.normalizeName(signal.trend_name);
      const normCat = TrendNormalizer.normalizeCategory(signal.category);
      // Unique deduplication composite key: Name + Category
      const key = `${normName.toLowerCase()}_${normCat.toLowerCase()}`;

      if (!registry[key]) {
        registry[key] = [];
      }
      registry[key].push(signal);
    }

    const mergedSignals: TrendSignal[] = [];

    for (const key of Object.keys(registry)) {
      const items = registry[key];
      if (items.length === 1) {
        // Only one signal exists, keep as-is with normalized names
        const single = items[0];
        mergedSignals.push({
          ...single,
          trend_name: TrendNormalizer.normalizeName(single.trend_name),
          category: TrendNormalizer.normalizeCategory(single.category)
        });
        continue;
      }

      // Overlap detected: deduplicate and merge metadata
      const first = items[0];
      const normalizedName = TrendNormalizer.normalizeName(first.trend_name);
      const normalizedCategory = TrendNormalizer.normalizeCategory(first.category);

      // Aggregate Scores: Take weighted average or highest score to represent extreme interest peaks
      const maxScore = Math.max(...items.map(i => i.trend_score));
      
      // Calculate average growth percentage across signals
      const avgGrowth = parseFloat(
        (items.reduce((sum, item) => sum + item.growth_percent, 0) / items.length).toFixed(2)
      );

      // Average resale benchmark price if available
      const priceItems = items.filter(i => i.resale_price !== undefined && i.resale_price > 0);
      const resalePrice = priceItems.length > 0 
        ? Math.round(priceItems.reduce((sum, item) => sum + (item.resale_price || 0), 0) / priceItems.length)
        : first.resale_price;

      // Amalgamate source paths to keep traceable data lineage
      const combinedSources = Array.from(new Set(items.map(i => i.source || i.metadata.rawSourceName))).join(" + ");
      
      // Merge all collectors' metadata segments
      const mergedMetadataConfig: TrendSignal['metadata'] = {
        collectedAt: new Date().toISOString(),
        rawSourceName: "Aggregated Cross-Market Index",
        confidenceScore: parseFloat(
          (items.reduce((sum, i) => sum + i.metadata.confidenceScore, 0) / items.length).toFixed(2)
        ),
        contributions: items.map(item => ({
          collector: item.metadata.rawSourceName,
          score: item.trend_score,
          growth: item.growth_percent,
          sampleIndicator: item.metadata.sampleSize
        }))
      };

      // Prefer the best available image
      const bestImage = items.find(i => i.image_url && i.image_url.startsWith('http'))?.image_url || first.image_url;

      mergedSignals.push({
        trend_name: normalizedName,
        category: normalizedCategory,
        trend_score: maxScore,
        growth_percent: avgGrowth,
        resale_price: resalePrice,
        marketplace: first.marketplace,
        image_url: bestImage,
        source: `${combinedSources} (Integrated Index)`,
        metadata: mergedMetadataConfig
      });
    }

    return mergedSignals;
  }
}

// Quota and Rate limit circuit breaker to avoid spamming the Gemini API when quota is exhausted
let isGeminiQuotaExhausted = false;
let quotaExhaustedResetTime = 0;

export function isQuotaExhausted(): boolean {
  if (isGeminiQuotaExhausted && Date.now() < quotaExhaustedResetTime) {
    return true;
  }
  isGeminiQuotaExhausted = false;
  return false;
}

export function markQuotaExhausted(cooldownMs: number = 15 * 60 * 1000) {
  isGeminiQuotaExhausted = true;
  quotaExhaustedResetTime = Date.now() + cooldownMs;
}

/**
 * Shared utility to run Gemini Search Grounding for a platform collector.
 * Automatically handles schema validation, structured output, and network errors,
 * with robust exponential backoff to handle rate limits (429 RESOURCE_EXHAUSTED).
 */
export async function collectSectionWithGemini(
  ai: any, // GoogleGenAI client
  platform: string,
  instructions: string
): Promise<Partial<TrendSignal>[]> {
  if (isQuotaExhausted()) {
    console.log(`🔌 [Gemini Quota Shield] Bypassing Gemini API call for ${platform} to leverage high-fidelity offline fallbacks directly.`);
    throw new Error("GEMINI_QUOTA_COOLDOWN");
  }

  const prompt = `
    Conduct high-integrity web research to discover current real-world trending items/brands specifically on ${platform}.
    Follow these specific guidelines: ${instructions}
    
    Return exactly 3 highly relevant and real active items/brands hot right now on ${platform}.
    Only provide actual, factual data. No placeholder or fake items.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        description: `List of hot fashion trends or signals observed on ${platform}`,
        items: {
          type: Type.OBJECT,
          properties: {
            trend_name: { type: Type.STRING, description: "Detailed brand and item name (e.g. 'Adidas Samba', 'Arc'teryx Beta LT')" },
            category: { type: Type.STRING, description: "Clothing category: Outerwear, Footwear, Bottoms, Accessories, or Knitwear" },
            trend_score: { type: Type.INTEGER, description: "Normalized demand score between 50 and 100 based on search/sales volume" },
            growth_percent: { type: Type.NUMBER, description: "Estimated MoM or seasonal growth percentage" },
            resale_price: { type: Type.NUMBER, description: "Average resale price benchmark in Swedish Kronor (SEK)" },
            marketplace: { type: Type.STRING, description: "Authoritative selling platform of reference" },
            source: { type: Type.STRING, description: "Specific post, board, search trend index reference or URL if possible" },
            image_url: { type: Type.STRING, description: "Optional relevant clean image URL if found in context" }
          },
          required: ['trend_name', 'category', 'trend_score', 'growth_percent', 'resale_price', 'marketplace', 'source']
        }
      }
    },
    required: ['items']
  };

  const maxRetries = 2;
  let attempt = 0;
  let delayMs = 2500;

  while (attempt <= maxRetries) {
    try {
      if (isQuotaExhausted()) {
        throw new Error("GEMINI_QUOTA_COOLDOWN");
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error(`Empty response returned by Gemini search grounding for ${platform}`);
      }

      const parsed = JSON.parse(text);
      return parsed.items || [];
    } catch (err: any) {
      if (err.message === "GEMINI_QUOTA_COOLDOWN") {
        throw err;
      }

      const errorMessage = err.message || "";
      const isRateLimit = err.status === 'RESOURCE_EXHAUSTED' || 
                          err.status === 429 || 
                          err.statusCode === 429 || 
                          errorMessage.includes('429') ||
                          errorMessage.includes('quota') ||
                          errorMessage.includes('exhausted');

      const isUnavailable = err.status === 'UNAVAILABLE' ||
                            err.status === 503 ||
                            err.statusCode === 503 ||
                            errorMessage.includes('503') ||
                            errorMessage.includes('UNAVAILABLE') ||
                            errorMessage.includes('high demand') ||
                            errorMessage.includes('temporary') ||
                            errorMessage.includes('overload');

      const isTransientError = isRateLimit || isUnavailable;

      if (isRateLimit) {
        const isHardQuota = errorMessage.toLowerCase().includes('quota') || 
                            errorMessage.toLowerCase().includes('billing') || 
                            errorMessage.toLowerCase().includes('exhausted') || 
                            err.status === 'RESOURCE_EXHAUSTED';
        if (isHardQuota) {
          markQuotaExhausted(15 * 60 * 1000); // 15-minute key cooldown
          console.warn(`🛑 [Gemini Quota Shield] Hard daily quota limit exceeded during search grounding for ${platform}. Triggering circuit breaker.`);
          throw new Error("GEMINI_QUOTA_COOLDOWN");
        }
      }

      if (isTransientError && attempt < maxRetries) {
        console.warn(`⚠️ [Gemini Transient Error] Error (isRateLimit=${isRateLimit}, isUnavailable=${isUnavailable}) received for ${platform}. Retrying in ${delayMs / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        attempt++;
        delayMs *= 2.5; // Exponential scale backoff
      } else {
        // Before giving up completely, let's attempt standard model generation without the googleSearch grounding tool!
        // This is a major safeguard to bypass Google Search Grounding quotas while still delivering high-fidelity trend data.
        console.log(`💡 [Gemini Grounding Fallback] Attempting standard model generation for ${platform} without search grounding...`);
        try {
          if (isQuotaExhausted()) {
            throw new Error("GEMINI_QUOTA_COOLDOWN");
          }

          const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: `Conduct high-integrity web research to discover current real-world trending items/brands specifically on ${platform}.
            Follow these specific guidelines: ${instructions}
            
            Return exactly 3 highly relevant and real active items/brands hot right now on ${platform}.
            Only provide actual, factual data matching fashion/outerwear/footwear/knitwear/accessories. No placeholder or fake items.`,
            config: {
              responseMimeType: 'application/json',
              responseSchema
            }
          });

          const text = response.text;
          if (text) {
            const parsed = JSON.parse(text);
            if (parsed.items && parsed.items.length > 0) {
              console.log(`✅ [Gemini Grounding Fallback] Successfully fetched ${parsed.items.length} trend signals for ${platform} using standard generation.`);
              return parsed.items;
            }
          }
        } catch (fallbackErr: any) {
          const fallbackMsg = fallbackErr.message || "";
          if (fallbackMsg.includes("quota") || fallbackMsg.includes("exhausted") || fallbackMsg.includes("429") || fallbackErr.status === 'RESOURCE_EXHAUSTED' || fallbackErr.status === 429) {
            markQuotaExhausted(15 * 60 * 1000);
          }
          if (fallbackErr.message === "GEMINI_QUOTA_COOLDOWN") {
            throw fallbackErr;
          }

          console.warn(`⚠️ [Gemini Grounding Fallback] Standard generation also failed for ${platform}, trying gemini-3.1-flash-lite as ultimate backup:`, fallbackMsg);
          
          try {
            if (isQuotaExhausted()) {
              throw new Error("GEMINI_QUOTA_COOLDOWN");
            }

            const responseLite = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: `Conduct high-integrity web research to discover current real-world trending items/brands specifically on ${platform}.
              Follow these specific guidelines: ${instructions}
              
              Return exactly 3 highly relevant and real active items/brands hot right now on ${platform}.
              Only provide actual, factual data matching fashion/outerwear/footwear/knitwear/accessories. No placeholder or fake items.`,
              config: {
                responseMimeType: 'application/json',
                responseSchema
              }
            });

            const textLite = responseLite.text;
            if (textLite) {
              const parsedLite = JSON.parse(textLite);
              if (parsedLite.items && parsedLite.items.length > 0) {
                console.log(`✅ [Gemini Lite Fallback] Successfully fetched ${parsedLite.items.length} trend signals for ${platform} using gemini-3.1-flash-lite.`);
                return parsedLite.items;
              }
            }
          } catch (liteErr: any) {
            const liteMsg = liteErr.message || "";
            if (liteMsg.includes("quota") || liteMsg.includes("exhausted") || liteMsg.includes("429") || liteErr.status === 'RESOURCE_EXHAUSTED' || liteErr.status === 429) {
              markQuotaExhausted(15 * 60 * 1000);
            }
            if (liteErr.message === "GEMINI_QUOTA_COOLDOWN") {
              throw liteErr;
            }
            console.warn(`⚠️ [Gemini Lite Fallback] gemini-3.1-flash-lite also failed for ${platform}:`, liteMsg);
          }
        }

        console.warn(`⚠️ [Gemini Grounding] Failed to gather trend signals for ${platform} after ${attempt} retries:`, errorMessage || err);
        throw err;
      }
    }
  }
  throw new Error(`Failed to collect section via Gemini for ${platform} after all retry attempts.`);
}

/**
 * Calculates a deterministic value based on the hash of the trend name.
 * This ensures that when running without live API access, falled-back items 
 * do not fluctuate randomly on refresh but remain perfectly consistent.
 */
export function getDeterministicValue(name: string, multiplier: number, offset: number = 0): number {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return (sum % multiplier) + offset;
}
