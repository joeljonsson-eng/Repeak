export interface PlanFeature {
  name: string;
  included: boolean;
  note?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  ctaText: string;
  ctaNote?: string;
  popular: boolean;
  premiumGlow?: boolean;
  features: string[];
}

export interface ComparisonRow {
  benefit: string;
  description?: string;
  category: "Search & Compare" | "Alerts & Automation" | "Analysis & Trust" | "Reseller & Power";
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export interface Trend {
  id?: string;
  trend_name: string;
  category: string;
  image_url?: string;
  trend_score: number;
  growth_percent: number;
  source: string;
  resale_price?: number;
  marketplace: string;
  created_at?: string;
  updated_at?: string;
  
  // Custom Trend Scoring Engine output fields
  search_growth?: number;
  engagement_growth?: number;
  marketplace_activity?: number;
  resale_activity?: number;
  social_mentions?: number;
  confidence_score?: number;
  image_confidence_score?: number;

  // AI Trend Prediction fields
  predicted_growth?: number;
  future_trend_score?: number;
  prediction_confidence?: number;

  // Real marketplace price points and history tracking
  stockx_price?: number;
  grailed_price?: number;
  depop_price?: number;
  trend_status?: 'Rising' | 'Stable' | 'Falling' | 'Insufficient';
  price_change_percent?: number | null;
  price_change_absolute?: number | null;
}

export interface TrendHistory {
  id: string;
  trend_id: string;
  trend_score: number;
  growth_percent: number;
  resale_price?: number;
  recorded_at: string;
}

export interface MonthlyPricePoint {
  month: string;
  price: number;
  volume: number;
}

export interface MarketBenchmark {
  platform: string;
  avgPrice: number;
  activeListings: number;
  trend: 'Rising' | 'Stable' | 'Falling';
}

export interface ValuationFactor {
  factor: string;
  score: 'positive' | 'neutral' | 'negative';
  description: string;
}

export interface FashionValuationRequest {
  itemName: string;
  askingPrice: number;
  category?: string;
  condition?: string;
  marketplace?: string;
  language?: 'SV' | 'EN';
}

export interface FashionValuationResult {
  itemName: string;
  brand: string;
  category: string;
  condition: string;
  marketplace: string;
  askingPrice: number;
  estimatedRetailPrice: number;
  fairMarketPrice: {
    min: number;
    max: number;
    average: number;
    recommendedTarget: number;
  };
  priceVerdict: 'great_bargain' | 'fair_price' | 'slightly_high' | 'overpriced';
  verdictLabel: string;
  verdictDescription: string;
  dealScore: number; // 0 - 100
  priceDifferenceSek: number;
  priceDifferencePercent: number;
  confidenceScore: number;
  resaleVelocity: string;
  priceTrendTrajectory: {
    direction: 'Rising' | 'Stable' | 'Falling';
    percentage3Months: number;
    trendSummary: string;
    monthlyHistory: MonthlyPricePoint[];
    forecast6Months: string;
  };
  valueFactors: ValuationFactor[];
  negotiationStrategy: {
    recommendedOpeningOffer: number;
    walkAwayPrice: number;
    tactic: string;
    sampleMessage: string;
  };
  marketBenchmarks: MarketBenchmark[];
  buyerAdvice: string;
  isAiGenerated: boolean;
}

export interface SearchListing {
  id: string;
  title: string;
  brand: string;
  category: 'jeans' | 'stickat' | 'sneakers' | 'jackor' | 'vaskor' | 't-shirt' | 'klanning' | 'accessoarer' | string;
  price: number;
  originalPrice?: number;
  condition: 'Nyskick' | 'Mycket bra skick' | 'Bra skick' | 'Vintageskick';
  size: string;
  sizeCategory: 'clothing' | 'denim' | 'shoes' | 'onesize';
  color: string;
  colorHex?: string;
  marketplace: 'Tradera' | 'Plick' | 'Vinted' | 'Sellpy' | 'Blocket' | 'Depop';
  tag: 'Kap!' | 'Rättvist' | 'Överpris';
  imageUrl: string;
  url: string;
  desc: string;
  sellerRating?: string;
  sellerTrustScore?: number;
  photosCount?: number;
  qualityScore?: number;
  valueScore?: number;
  finalScore?: number;
  role?: 'Budget' | 'Best Value' | 'Mid-range' | 'Premium';
  createdAt?: string;
}

export interface SearchFilterState {
  brands: string[];
  sizes: string[];
  colors: string[];
  conditions: string[];
  minPrice: number | null;
  maxPrice: number | null;
  marketplaces: string[];
  tags: string[];
}

export interface SearchFacets {
  brands: { name: string; count: number }[];
  sizes: { size: string; count: number; category: string }[];
  colors: { name: string; hex: string; count: number }[];
  conditions: { id: string; label: string; count: number }[];
  marketplaces: { name: string; count: number }[];
  tags: { tag: string; count: number }[];
  priceRange: { min: number; max: number };
}

export interface SavedFavoriteItem {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  marketplace: string;
  imageUrl: string;
  condition: string;
  size: string;
  url: string;
  savedAt: string;
  userId: string;
}

