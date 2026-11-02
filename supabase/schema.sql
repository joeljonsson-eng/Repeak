-- Create custom extension for UUID if not loaded
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: public.trends
-- Stores current active trends with their parameters.
CREATE TABLE IF NOT EXISTS public.trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trend_name TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    trend_score INTEGER NOT NULL DEFAULT 50 CHECK (trend_score >= 0 AND trend_score <= 100),
    growth_percent NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    source TEXT NOT NULL,
    resale_price NUMERIC(10, 2),
    marketplace TEXT NOT NULL,
    
    -- Engineered trend scoring metrics
    search_growth NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    engagement_growth NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    marketplace_activity NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    resale_activity NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    social_mentions INTEGER NOT NULL DEFAULT 0,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (confidence_score >= 0.00 AND confidence_score <= 100.00),

    -- AI Trend Prediction metrics
    predicted_growth NUMERIC(6, 2) DEFAULT 0.00,
    future_trend_score INTEGER DEFAULT 50 CHECK (future_trend_score >= 0 AND future_trend_score <= 100),
    prediction_confidence NUMERIC(5, 2) DEFAULT 0.00 CHECK (prediction_confidence >= 0.00 AND prediction_confidence <= 100.00),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_trend_item UNIQUE (trend_name, category, marketplace)
);

-- Table: public.trend_history
-- Tracks historic measurements of trends over time for analytics, graphing, and statistics.
CREATE TABLE IF NOT EXISTS public.trend_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trend_id UUID NOT NULL REFERENCES public.trends(id) ON DELETE CASCADE,
    trend_score INTEGER NOT NULL,
    growth_percent NUMERIC(6, 2) NOT NULL,
    resale_price NUMERIC(10, 2),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- High-Performance Optimized Indexes for fast reads and complex ordering
CREATE INDEX IF NOT EXISTS idx_trends_category_score ON public.trends (category, trend_score DESC);
CREATE INDEX IF NOT EXISTS idx_trends_score ON public.trends (trend_score DESC);
CREATE INDEX IF NOT EXISTS idx_trends_growth ON public.trends (growth_percent DESC);
CREATE INDEX IF NOT EXISTS idx_trend_history_lookup ON public.trend_history (trend_id, recorded_at DESC);

-- Automated Trigger to log trend history snapshots & update timestamps on any change
CREATE OR REPLACE FUNCTION public.proc_log_trend_history_and_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the updated_at timestamp
    NEW.updated_at := NOW();
    
    -- Capture history checkpoint
    INSERT INTO public.trend_history (trend_id, trend_score, growth_percent, resale_price, recorded_at)
    VALUES (NEW.id, NEW.trend_score, NEW.growth_percent, NEW.resale_price, NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger execution
DROP TRIGGER IF EXISTS trigger_log_trend_history ON public.trends;
CREATE TRIGGER trigger_log_trend_history
AFTER INSERT OR UPDATE ON public.trends
FOR EACH ROW
EXECUTE FUNCTION public.proc_log_trend_history_and_updated_at();

-- Setup Row-Level Security (RLS) Rules for security best practices
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_history ENABLE ROW LEVEL SECURITY;

-- Allow general select access
CREATE POLICY "Allow public read access on trends" ON public.trends 
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on trend_history" ON public.trend_history 
    FOR SELECT TO public USING (true);
