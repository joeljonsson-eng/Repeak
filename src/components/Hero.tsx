import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Search, ChevronDown, Check, Sparkles, AlertTriangle, HelpCircle, ExternalLink, RefreshCw, Mail, SlidersHorizontal } from 'lucide-react';
import WorkspaceShare from './WorkspaceShare';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { trackEvent } from '../lib/analytics';
import { Trend } from '../types';

// Live simulated Swede Secondhand items
interface Listing {
  platform: string;
  price: number;
  condition: string;
  rating: string;
  tag: 'Kap!' | 'Rättvist' | 'Överpris';
  desc: string;
  url?: string;
  hasDirectUrl?: boolean;
  qualityScore?: number;
  valueScore?: number;
  finalScore?: number;
  role?: 'Budget' | 'Best Value' | 'Mid-range' | 'Premium';
  badge?: 'best_overall' | 'cheapest' | 'highest_quality' | 'best_value' | null;
  sellerRating?: string;
  listingCompleteness?: number;
  sellerTrust?: number;
  photosCount?: number;
  ageYears?: number;
}

interface SimulatedItem {
  id: string;
  name: string;
  brand: string;
  avgValue: number;
  marketRange: string;
  listings: Listing[];
}

const MOCK_DATA: Record<string, SimulatedItem> = {
  jeans: {
    id: 'jeans',
    name: 'Vintage Levi’s 501',
    brand: "Levi's Vintage",
    avgValue: 850,
    marketRange: '350 kr - 1 200 kr',
    listings: [
      { platform: 'Tradera', price: 380, condition: 'Fint skick', rating: 'Säljare: ★★★★★ (184)', tag: 'Kap!', desc: 'Klassiska tvättade 501or, mått på begäran.' },
      { platform: 'Vinted', price: 550, condition: 'Fint vintageskick', rating: 'Säljare: ★★★★☆ (28)', tag: 'Rättvist', desc: 'Sparsamt använda Levi’s, raka ben.' },
      { platform: 'Blocket', price: 900, condition: 'Väldigt bra skick', rating: 'Verifierad säljare', tag: 'Överpris', desc: 'Pratar endast svenska. Kan skickas.' },
      { platform: 'Sellpy', price: 420, condition: 'Bra skick (Litet slitage)', rating: 'Sellpy Verified', tag: 'Kap!', desc: 'Sorterad och kontrollerad av Sellpy.' }
    ]
  },
  stickat: {
    id: 'stickat',
    name: 'Ganni Heavy Wool Knit',
    brand: 'Ganni',
    avgValue: 2400,
    marketRange: '1 200 kr - 3 500 kr',
    listings: [
      { platform: 'Vinted', price: 1250, condition: 'Ett par gånger använd', rating: 'Säljare: ★★★★★ (40)', tag: 'Kap!', desc: 'Mjuk stickad ulltröja, inga noppor.' },
      { platform: 'Plick', price: 1800, condition: 'Nyskick', rating: 'Säljare: ★★★★★ (11)', tag: 'Rättvist', desc: 'Perfekt passform. Köpare står för frakt!' },
      { platform: 'Tradera', price: 2300, condition: 'Bra skick', rating: 'Säljare: ★★★★☆ (82)', tag: 'Rättvist', desc: 'Sällsynt färgställning från tidigare säsong.' },
      { platform: 'Sellpy', price: 2800, condition: 'Fint skick', rating: 'Sellpy Verified', tag: 'Överpris', desc: 'Hygieniskt tvättad och packad av partner.' }
    ]
  },
  sneakers: {
    id: 'sneakers',
    name: 'Adidas Samba OG Black',
    brand: 'Adidas Originals',
    avgValue: 1100,
    marketRange: '600 kr - 1 450 kr',
    listings: [
      { platform: 'Blocket', price: 650, condition: 'Nyskick i kartong', rating: 'Verifierad säljare', tag: 'Kap!', desc: 'Fel storlek för mig, aldrig använda utomhus.' },
      { platform: 'Plick', price: 800, condition: 'Fint skick', rating: 'Säljare: ★★★★☆ (8)', tag: 'Rättvist', desc: 'Använda en säsong, minimalt hälslitage.' },
      { platform: 'Sellpy', price: 1290, condition: 'Bra skick', rating: 'Sellpy Verified', tag: 'Överpris', desc: 'Inspekterad returblogg.' },
      { platform: 'Tradera', price: 720, condition: 'Använd med kärlek', rating: 'Säljare: ★★★★★ (440)', tag: 'Kap!', desc: 'Klassiska Samba, sköna sneakers.' }
    ]
  },
  vaskor: {
    id: 'vaskor',
    name: 'Vintage Prada Hobo Bag',
    brand: 'Prada Vintage',
    avgValue: 6200,
    marketRange: '3 500 kr - 8 900 kr',
    listings: [
      { platform: 'Tradera', price: 3400, condition: 'Normalt vintageskick', rating: 'Säljare: ★★★★★ (14)', tag: 'Kap!', desc: 'Äkthetsintyg medföljer, lampo dragkedja.' },
      { platform: 'Sellpy', price: 4800, condition: 'Bra vintageskick', rating: 'Sellpy Verified', tag: 'Rättvist', desc: 'Mindre repor på metalldelarna.' },
      { platform: 'Blocket', price: 6800, condition: 'Fint skick', rating: 'Verifierad säljare', tag: 'Överpris', desc: 'Köpt i Milano, kvitto finns tyvärr ej kvar.' },
      { platform: 'Vinted', price: 3900, condition: 'Använt bruksskick', rating: 'Säljare: ★★★★☆ (55)', tag: 'Kap!', desc: 'Klassisk nylonväska, lite skav.' }
    ]
  }
};

// Alphanumeric helper to normalize queries and string keys for fuzzy matching
const cleanString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD') // Decompose accents/diacritics
    .replace(/[\u0300-\u036f]/g, '') // Strip diacritic characters
    .replace(/[^a-z0-9]/g, ''); // Remove non-alphanumeric punctuation and spacing
};

// Safely normalize external listing URLs to avoid local 404 pages inside workspace viewports
const resolveListingUrl = (url: string | undefined, platform: string, itemName: string): string => {
  const cleanItem = encodeURIComponent(itemName);
  const platLower = platform.toLowerCase();

  if (!url || typeof url !== 'string' || url.trim() === '') {
    if (platLower === 'vinted') {
      return `https://www.vinted.se/catalog?search_text=${cleanItem}`;
    }
    if (platLower === 'plick') {
      return `https://plick.se/sok?q=${cleanItem}`;
    }
    if (platLower === 'tradera') {
      return `https://www.tradera.com/search?q=${cleanItem}`;
    }
    if (platLower === 'sellpy') {
      return `https://www.sellpy.se/search?q=${cleanItem}`;
    }
    if (platLower === 'blocket') {
      return `https://www.blocket.se/sok?q=${cleanItem}`;
    }
    if (platLower === 'depop') {
      return `https://www.depop.com/search/?q=${cleanItem}`;
    }
    return `https://www.google.com/search?q=${cleanItem}+${encodeURIComponent(platform)}`;
  }

  let finalUrl = url.trim();

  // Prefix relative link handles to prevent local 404 error routes
  if (finalUrl.startsWith('/')) {
    if (platLower === 'vinted') {
      return `https://www.vinted.se${finalUrl}`;
    }
    if (platLower === 'plick') {
      return `https://plick.se${finalUrl}`;
    }
    if (platLower === 'tradera') {
      return `https://www.tradera.com${finalUrl}`;
    }
    if (platLower === 'sellpy') {
      return `https://www.sellpy.se${finalUrl}`;
    }
    if (platLower === 'blocket') {
      return `https://www.blocket.se${finalUrl}`;
    }
    if (platLower === 'depop') {
      return `https://www.depop.com${finalUrl}`;
    }
  }

  // Prepend protocol check
  if (!/^https?:\/\//i.test(finalUrl)) {
    if (finalUrl.toLowerCase().startsWith('www.') || finalUrl.includes('.')) {
      return `https://${finalUrl}`;
    } else {
      if (platLower === 'vinted') {
        return `https://www.vinted.se/catalog?search_text=${cleanItem}`;
      }
      if (platLower === 'plick') {
        return `https://plick.se/sok?q=${cleanItem}`;
      }
      if (platLower === 'tradera') {
        return `https://www.tradera.com/search?q=${cleanItem}`;
      }
      if (platLower === 'sellpy') {
        return `https://www.sellpy.se/search?q=${cleanItem}`;
      }
      if (platLower === 'blocket') {
        return `https://www.blocket.se/sok?q=${cleanItem}`;
      }
    }
  }

  // Force actual query route for root domain fallbacks
  const finalUrlLower = finalUrl.toLowerCase();
  if (platLower === 'vinted' && (finalUrlLower === 'https://vinted.se' || finalUrlLower === 'https://www.vinted.se' || finalUrlLower === 'https://vinted.se/' || finalUrlLower === 'https://www.vinted.se/')) {
    return `https://www.vinted.se/catalog?search_text=${cleanItem}`;
  }

  if (platLower === 'plick' && (finalUrlLower === 'https://plick.se' || finalUrlLower === 'https://www.plick.se' || finalUrlLower === 'https://plick.se/' || finalUrlLower === 'https://www.plick.se/')) {
    return `https://plick.se/sok?q=${cleanItem}`;
  }

  return finalUrl;
};

// Maps dynamic data store Trends into the full SimulatedItem schema needed for the Hero UI
const mapTrendToSimulatedItem = (trend: Trend): SimulatedItem => {
  const avgValue = trend.resale_price || 850;
  const nameLower = trend.trend_name.toLowerCase();
  
  // Extract clean Brand name
  let brand = 'Curated Vintage';
  const knownBrandsMap: Record<string, string> = {
    'acne studios': 'Acne Studios',
    'acne': 'Acne Studios',
    'totême': 'Totême',
    'toteme': 'Totême',
    'ganni': 'Ganni',
    'stüssy': 'Stüssy',
    'stussy': 'Stüssy',
    'diesel': 'Diesel',
    'our legacy': 'Our Legacy',
    'adidas': 'Adidas',
    'asics': 'Asics',
    'nike': 'Nike',
    'jordan': 'Jordan',
    'prada': 'Prada',
    'supreme': 'Supreme',
    'rick owens': 'Rick Owens',
    'chrome hearts': 'Chrome Hearts',
    'maison margiela': 'Maison Margiela',
    'margiela': 'Maison Margiela',
    'stone island': 'Stone Island',
    'carhartt': 'Carhartt',
    'patagonia': 'Patagonia',
    "arc'teryx": "Arc'teryx",
    'arcteryx': "Arc'teryx",
    "levi's": "Levi's",
    'levis': "Levi's"
  };

  for (const [key, val] of Object.entries(knownBrandsMap)) {
    if (nameLower.includes(key)) {
      brand = val;
      break;
    }
  }

  // Construct standard price ranges around average value
  const minPrice = Math.round((avgValue * 0.72) / 50) * 50;
  const maxPrice = Math.round((avgValue * 1.28) / 50) * 50;
  const marketRange = `${minPrice.toLocaleString('sv-SE')} kr - ${maxPrice.toLocaleString('sv-SE')} kr`;

  // Establish comparison listings
  const primaryPlatform = trend.marketplace || 'Tradera';
  const otherPlatforms = ['Tradera', 'Vinted', 'Blocket', 'Sellpy', 'Plick', 'Depop'].filter(
    (p) => p.toLowerCase() !== primaryPlatform.toLowerCase()
  );

  const listings: Listing[] = [];

  // 1. Primary real-world matching listing block
  listings.push({
    platform: primaryPlatform,
    price: avgValue,
    condition: nameLower.includes('vintage') || nameLower.includes('coat') ? 'Bra vintageskick' : 'Fint skick',
    rating: 'Säljare: ★★★★★ (184)',
    tag: 'Rättvist',
    desc: `Autentisk ${trend.trend_name} listad på ${primaryPlatform}.`
  });

  // 2. Comparison offers dynamically offset around the average value
  const offersList = [
    { offset: 0.82, condition: 'Väldigt bra skick', tag: 'Kap!' as const, reviewer: 'Verifierad säljare', text: `Sparsamt använd ${trend.trend_name} i bra skick.` },
    { offset: 1.15, condition: 'Nyskick', tag: 'Överpris' as const, reviewer: 'Säljare: ★★★★☆ (28)', text: `Nyskick, endast använd ett fåtal gånger.` },
    { offset: 0.94, condition: 'Bra skick (Litet slitage)', tag: 'Kap!' as const, reviewer: 'Sellpy Verified', text: `Sorterad och kontrollerad av partnerplattform.` }
  ];

  offersList.forEach((offer, idx) => {
    if (idx < otherPlatforms.length) {
      listings.push({
        platform: otherPlatforms[idx],
        price: Math.round((avgValue * offer.offset) / 10) * 10,
        condition: offer.condition,
        rating: offer.reviewer,
        tag: offer.tag,
        desc: offer.text
      });
    }
  });

  return {
    id: trend.id || `trend_${nameLower.replace(/[^a-z0-9]/g, '_')}`,
    name: trend.trend_name,
    brand,
    avgValue,
    marketRange,
    listings
  };
};

export default function Hero() {
  const { language, t } = useLanguage();

  const computeMarketplaceAnalysis = () => {
    if (!activeItem || activeItem.listings.length === 0) return null;
    
    const prices = activeItem.listings.map(l => l.price);
    const cheapestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const averagePrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    const cheapestListing = activeItem.listings.find(l => l.price === cheapestPrice);

    // Calculate bargain score: cheapest price vs average price
    const priceRatio = averagePrice > 0 ? cheapestPrice / averagePrice : 1;
    let bargainScore = Math.max(0, Math.min(100, Math.round((1 - priceRatio) * 200 + 40)));
    
    if (priceRatio < 0.7) {
      bargainScore = Math.max(85, bargainScore);
    } else if (priceRatio > 1.0) {
      bargainScore = Math.min(30, bargainScore);
    }

    let marketCondition: 'Kap!' | 'Rättvist' | 'Överpris' = 'Rättvist';
    if (priceRatio <= 0.75) {
      marketCondition = 'Kap!';
    } else if (priceRatio >= 1.15) {
      marketCondition = 'Överpris';
    }

    return {
      cheapestPrice,
      averagePrice,
      highestPrice,
      bargainScore,
      marketCondition,
      cheapestListing,
      totalListingsCount: activeItem.listings.length
    };
  };

  const [activeToggle, setActiveToggle] = useState<'KÖPA' | 'SÄLJA'>('KÖPA');
  const [shareListing, setShareListing] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sizeDropdown, setSizeDropdown] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>('M / 38');
  const [priceRange, setPriceRange] = useState<string>('Max SEK');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>(language === 'SV' ? 'ALLA APPAR' : 'ALL APPS');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  
  // Search Simulation states
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false); // default empty so Hett Just Nu stands pristine
  const [currentScanId, setCurrentScanId] = useState<string>('jeans');
  const [scanStep, setScanStep] = useState<number>(0);

  // Live database trend index state
  const [trends, setTrends] = useState<Trend[]>([]);
  const [liveResults, setLiveResults] = useState<SimulatedItem[]>([]);
  const [activeItem, setActiveItem] = useState<SimulatedItem | null>(null);

  const [geminiAnalysis, setGeminiAnalysis] = useState<{
    bargainAnalysis: string;
    trendAnalysis: string;
    priceAnalysis: string;
    authenticityWarning: string;
    productInsights: string;
  } | null>(null);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'bargain' | 'trend' | 'price' | 'fake' | 'insights'>('bargain');
  const [searchStatistics, setSearchStatistics] = useState<any | null>(null);
  const [bestDeals, setBestDeals] = useState<any | null>(null);

  const getLocalFallbackAnalysis = (query: string, value: number) => {
    return {
      bargainAnalysis: `Vår Kap-analys visar att det lägsta priset på denna ${query} är mycket fördelaktigt! Det ligger ca 15-25% under det genomsnittliga marknadsvärdet på ${value} kr. Det råder ett utmärkt fyndläge för tillfället.`,
      trendAnalysis: `Efterfrågan för "${query}" är påtagligt stark. Sökvolymen har stigit stadigt under den senaste månaden, vilket gör detta till ett trendigt andrahandsval.`,
      priceAnalysis: `Priserna för "${query}" har historiskt fluktuerat mellan ${Math.round(value * 0.75)} kr och ${Math.round(value * 1.25)} kr. Andrahandsvärdet håller sig anmärkningsvärt stabilt.`,
      authenticityWarning: `Inga uppenbara fusk- eller kopieringsindikatorer. Dock rekommenderas köpare att alltid granska säljarens tidigare betyg, kontrollera produktbilder och kvitton noga innan affären slutförs.`,
      productInsights: `Denna populära modell är känd för sin höga kvalitet, sköna komfort och tidlösa estetiska design som är enkel att matcha med en modern streetwear-stil.`
    };
  };

  const analysis = computeMarketplaceAnalysis();

  // Ingest live listings index on mount
  useEffect(() => {
    let active = true;
    const fetchTrendsIndex = async () => {
      try {
        const res = await fetch('/api/trends');
        const json = await res.json();
        if (json.success && json.data && active) {
          setTrends(json.data);
          console.log(`🌐 [Live Registry] Sourced ${json.data.length} database entries into client index.`);
        }
      } catch (err) {
        console.error("🌐 [Live Registry] Error mounting search data:", err);
      }
    };
    fetchTrendsIndex();
    return () => {
      active = false;
    };
  }, []);

  // Sync default filter platform when language toggles
  useEffect(() => {
    setFilterPlatform(language === 'SV' ? 'ALLA APPAR' : 'ALL APPS');
  }, [language]);

  const categories = [
    { label: t.hero.categories.jeans, id: 'jeans' },
    { label: t.hero.categories.knitwear, id: 'stickat' },
    { label: t.hero.categories.sneakers, id: 'sneakers' },
    { label: t.hero.categories.bags, id: 'vaskor' }
  ];

  const platforms = [
    language === 'SV' ? 'ALLA APPAR' : 'ALL APPS',
    'BLOCKET',
    'TRADERA',
    'VINTED',
    'PLICK',
    'FB MARKET',
    'SELLPY'
  ];

  // Helper translating mapping functions
  const translateCondition = (cond: string, lang: 'SV' | 'EN') => {
    if (lang === 'SV') return cond;
    const dict: Record<string, string> = {
      'Fint skick': 'Excellent condition',
      'Fint vintageskick': 'Great vintage condition',
      'Väldigt bra skick': 'Very good condition',
      'Bra skick (Litet slitage)': 'Good condition (minor wear)',
      'Ett par gånger använd': 'Worn a few times',
      'Nyskick': 'Like new',
      'Bra skick': 'Good condition',
      'Nyskick i kartong': 'Like new in box',
      'Använd med kärlek': 'Pre-loved',
      'Normalt vintageskick': 'Normal vintage condition',
      'Bra vintageskick': 'Good vintage condition',
      'Använt bruksskick': 'Gently worn'
    };
    return dict[cond] || cond;
  };

  const translateRating = (rating: string, lang: 'SV' | 'EN') => {
    if (lang === 'SV') return rating;
    return rating
      .replace('Säljare:', 'Seller:')
      .replace('Verifierad säljare', 'Verified Seller');
  };

  const translateDesc = (desc: string, lang: 'SV' | 'EN') => {
    if (lang === 'SV') return desc;
    const dict: Record<string, string> = {
      'Klassiska tvättade 501or, mått på begäran.': 'Classic washed 501s, measurements on request.',
      'Sparsamt använda Levi’s, raka ben.': 'Gently worn Levi\'s, straight leg fit.',
      'Pratar endast svenska. Kan skickas.': 'Can ship. Friendly seller.',
      'Sorterad och kontrollerad av Sellpy.': 'Sorted and verified by Sellpy.',
      'Mjuk stickad ulltröja, inga noppor.': 'Soft wool knit sweater, no pilling.',
      'Perfekt passform. Köpare står för frakt!': 'Perfect fit. Buyer pays shipping!',
      'Sällsynt färgställning från tidigare säsong.': 'Rare colorway from prior season.',
      'Hygieniskt tvättad och packad av partner.': 'Hygienically washed and packed by partner.',
      'Fel storlek för mij, aldrig använda utomhus.': 'Wrong size for me, never worn outdoors.',
      'Fel storlek för mig, aldrig använda utomhus.': 'Wrong size for me, never worn outdoors.',
      'Använda en säsong, minimalt hälslitage.': 'Worn one season, minimal heel wear.',
      'Inspekterad returblogg.': 'Inspected returns and checks.',
      'Klassiska Samba, sköna sneakers.': 'Classic Samba, comfortable sneakers.',
      'Äkthetsintyg medföljer, lampo dragkedja.': 'Certificate of authenticity included, Lampo zipper.',
      'Mindre repor på metalldelarna.': 'Minor scratches on metal parts.',
      'Köpt i Milano, kvitto finns tyvärr ej kvar.': 'Bought in Milan, receipt not available.',
      'Klassisk nylonväska, lite skav.': 'Classic nylon bag, minor signs of use.'
    };
    return dict[desc] || desc;
  };

  const translateTag = (tag: 'Kap!' | 'Rättvist' | 'Överpris', lang: 'SV' | 'EN') => {
    if (lang === 'SV') return tag;
    const dict = {
      'Kap!': 'Bargain!',
      'Rättvist': 'Fair Price',
      'Överpris': 'Overpriced'
    };
    return dict[tag] || tag;
  };

  const [sortBy, setSortBy] = useState<'relevance' | 'lowestPrice' | 'newest'>('relevance');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Perform multi-tiered search index ranking and matching live via backend with error safety
  const executeLiveSearchIndex = async (queryText: string) => {
    const cleanQ = queryText.toLowerCase().trim();
    if (!cleanQ) {
      setLiveResults([]);
      setActiveItem(null);
      return;
    }

    try {
      setSearchError(null);
      
      // Build dynamic query parameters with max price filter if entered
      const queryParams = new URLSearchParams({ q: queryText });
      if (priceRange && priceRange !== 'Max SEK') {
        const numVal = priceRange.replace(/[^0-9]/g, '');
        if (numVal) {
          queryParams.append('maxPrice', numVal);
        }
      }

      // Fetch from modern real secondhand search backend
      const res = await fetch(`/api/search?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();

      if (json.success && json.listings && json.listings.length > 0) {
        // Map backend listings down to frontend SimulatedItem
        const analysis = json.analysis;
        const mappedListings: Listing[] = json.listings.map((item: any) => {
          let tag: 'Kap!' | 'Rättvist' | 'Överpris' = 'Rättvist';
          if (analysis) {
            if (item.price === analysis.cheapestPrice) {
              tag = 'Kap!';
            } else if (item.price >= analysis.averagePrice * 1.15) {
              tag = 'Överpris';
            } else if (item.price <= analysis.averagePrice * 0.85) {
              tag = 'Kap!';
            }
          }
          return {
            platform: item.marketplace,
            price: item.price,
            condition: item.condition || 'Fint skick',
            rating: `Live ${item.marketplace}`,
            tag,
            desc: item.title,
            url: item.url,
            hasDirectUrl: item.hasDirectUrl,
            qualityScore: item.qualityScore,
            valueScore: item.valueScore,
            finalScore: item.finalScore,
            role: item.role,
            badge: item.badge,
            listingCompleteness: item.listingCompleteness,
            sellerTrust: item.sellerTrust,
            photosCount: item.photosCount,
            ageYears: item.ageYears
          };
        });

        const firstBrand = json.listings[0]?.brand || 'Curated';
        const rangeText = analysis
          ? `${analysis.cheapestPrice.toLocaleString('sv-SE')} kr - ${analysis.highestPrice.toLocaleString('sv-SE')} kr`
          : `${Math.round(json.listings[0]?.price * 0.85).toLocaleString('sv-SE')} kr - ${Math.round(json.listings[0]?.price * 1.25).toLocaleString('sv-SE')} kr`;

        const mappedItem: SimulatedItem = {
          id: 'live_' + cleanString(queryText),
          name: queryText,
          brand: firstBrand,
          avgValue: analysis ? analysis.averagePrice : Math.round(json.listings[0]?.price || 1000),
          marketRange: rangeText,
          listings: mappedListings
        };

        setSearchStatistics(json.statistics || null);
        setBestDeals(json.bestDeals || null);
        setLiveResults([mappedItem]);
        setActiveItem(mappedItem);
        setGeminiAnalysis(json.geminiAnalysis || getLocalFallbackAnalysis(queryText, mappedItem.avgValue));
      } else {
        // If query returns empty on both, clear results gracefully
        setSearchStatistics(null);
        setBestDeals(null);
        setLiveResults([]);
        setActiveItem(null);
        setGeminiAnalysis(null);
      }
    } catch (err: any) {
      console.error("🔴 [Hero] Parallel live query error:", err);
      // Fallback to local simulation database gracefully if API is down
      setSearchError(err.message || "Could not reach search engine.");
      
      // Let's create a beautiful fallback based on the search query words
      const matchedMockId = Object.keys(MOCK_DATA).find(key => 
        cleanQ.includes(key) || MOCK_DATA[key].name.toLowerCase().includes(cleanQ)
      );
      
      if (matchedMockId) {
        const originalMock = MOCK_DATA[matchedMockId];
        const copyItem: SimulatedItem = {
          ...originalMock,
          name: queryText
        };
        setLiveResults([copyItem]);
        setActiveItem(copyItem);
        setGeminiAnalysis(getLocalFallbackAnalysis(queryText, copyItem.avgValue));
      } else {
        // Create dynamic generic mock on the fly so search never dies!
        const basePrice = cleanQ.includes('jeans') ? 700 : cleanQ.includes('stickat') || cleanQ.includes('knit') ? 1200 : 800;
        const fallbackItem: SimulatedItem = {
          id: 'fb_' + cleanString(queryText),
          name: queryText,
          brand: 'Fashion Selection',
          avgValue: basePrice,
          marketRange: `${Math.round(basePrice * 0.6)} kr - ${Math.round(basePrice * 1.3)} kr`,
          listings: [
            { platform: 'Tradera', price: Math.round(basePrice * 0.75), condition: 'Bra skick', rating: 'Säljare: ★★★★★', tag: 'Kap!', desc: `${queryText} på auktion, fint utgångspris.`, url: 'https://tradera.com' },
            { platform: 'Plick', price: Math.round(basePrice * 0.95), condition: 'Nyskick', rating: 'Live Plick Annons', tag: 'Rättvist', desc: `${queryText} sparsamt använd, skicka meddelande.`, url: 'https://plick.se' }
          ]
        };
        setLiveResults([fallbackItem]);
        setActiveItem(fallbackItem);
        setGeminiAnalysis(getLocalFallbackAnalysis(queryText, basePrice));
      }
    }
  };

  // Helper trigger scanning simulation
  const triggerSearchSimGroup = async (queryText: string, inputQueryUpdate?: string) => {
    setIsScanning(true);
    setScanStep(0);
    // Clear previous results instantly on new search to prevent temporal mismatch or showing incorrect stats
    setLiveResults([]);
    setActiveItem(null);
    setGeminiAnalysis(null);

    if (inputQueryUpdate) {
      setSearchQuery(inputQueryUpdate);
    }

    // Start background fetch immediately
    const fetchPromise = executeLiveSearchIndex(queryText);
    
    // Smooth scroll to container during search so user feels instantaneous feed response
    setTimeout(() => {
      const element = document.getElementById('sok-resultat');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    
    // Staggered animation state representation
    const animationPromise = new Promise<void>((resolve) => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setScanStep(step);
        if (step >= 2) {
          clearInterval(interval);
          resolve();
        }
      }, 700);
    });

    // Unblock scanning only after both visual animation steps and live backend data fetching are fully finalized
    await Promise.all([fetchPromise, animationPromise]);

    setIsScanning(false);
    setHasScanned(true);
    
    // Track search execution completed successfully
    trackEvent('secondhand_search_completed', {
      search_query: queryText,
      interaction_type: activeToggle,
      size_filter: selectedSize,
      price_limit: priceRange
    });

    // Re-scroll gently on finish to focus full results list
    setTimeout(() => {
      const element = document.getElementById('sok-resultat');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      
      const nameLower = file.name.toLowerCase();
      let targetQuery = 'Ganni Wool';
      if (nameLower.includes('jean') || nameLower.includes('denim') || nameLower.includes('byxa') || nameLower.includes('levis')) {
        targetQuery = 'Our Legacy Third Cut Jeans';
      } else if (nameLower.includes('skor') || nameLower.includes('sneaker') || nameLower.includes('samba') || nameLower.includes('adidas')) {
        targetQuery = 'Adidas Samba';
      } else if (nameLower.includes('bag') || nameLower.includes('prada') || nameLower.includes('väska')) {
        targetQuery = 'Diesel 1DR Shoulder Bag';
      } else if (nameLower.includes('acne')) {
        targetQuery = 'Acne Studios Scarf';
      } else if (nameLower.includes('carhartt')) {
        targetQuery = 'Vintage Carhartt Detroit Jacket';
      }
      
      setActiveCategory('');
      triggerSearchSimGroup(targetQuery, `Bild: ${file.name}`);
    }
  };

  const handleTextSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveCategory('');
    triggerSearchSimGroup(searchQuery, searchQuery);
  };

  const handleCategoryClick = (id: string, label: string) => {
    setActiveCategory(id);
    
    let searchKeyword = label;
    if (id === 'jeans') searchKeyword = 'jeans Bottoms';
    else if (id === 'stickat') searchKeyword = 'knitwear wool Stickat';
    else if (id === 'sneakers') searchKeyword = 'footwear sneakers shoes';
    else if (id === 'vaskor') searchKeyword = 'accessories bag väska prada';

    triggerSearchSimGroup(searchKeyword, label);
  };

  // Filter listings based on platform and perform sorting
  const filteredListings = activeItem
    ? [...activeItem.listings]
        .filter((listing) => {
          if (filterPlatform === 'ALLA APPAR' || filterPlatform === 'ALL APPS') return true;
          return listing.platform.toUpperCase() === filterPlatform;
        })
        .sort((a, b) => {
          if (sortBy === 'lowestPrice') {
            return a.price - b.price;
          } else if (sortBy === 'newest') {
            // Rank newer/better conditions higher
            const getRank = (cond: string) => {
              const c = cond.toLowerCase();
              if (c.includes('nyskick') || c.includes('oanvänd')) return 5;
              if (c.includes('mycket bra') || c.includes('nyskick')) return 4;
              if (c.includes('bra')) return 3;
              if (c.includes('vintage') || c.includes('fint')) return 2;
              return 1;
            };
            return getRank(b.condition) - getRank(a.condition);
          } else {
            // Default: Relevance (favor Kap! and then Rättvist)
            const aVal = a.tag === 'Kap!' ? 2 : a.tag === 'Rättvist' ? 1 : 0;
            const bVal = b.tag === 'Kap!' ? 2 : b.tag === 'Rättvist' ? 1 : 0;
            return bVal - aVal;
          }
        })
    : [];

  return (
    <section className="relative pt-12 md:pt-20 pb-24 px-4 bg-gradient-to-b from-[#0a0f0d] via-[#050505] to-[#050505] overflow-hidden" id="hem">
      {/* Absolute Ambient Background blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#3cbd82]/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Display Heading with custom Swiss modern spacing */}
        <h1 className="text-5xl sm:text-6xl md:text-[80px] font-black tracking-tighter font-display mb-1 text-white leading-[0.9]">
          {t.hero.title}
        </h1>
        {/* Accent Brand subtitle: Screenshot 1 green text */}
        <h2 className="text-4xl sm:text-5xl md:text-[70px] font-black tracking-tighter font-display text-[#3cbd82] mb-8">
          {t.hero.subtitle}
        </h2>

        {/* Small descriptive content - Swedish */}
        <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed mb-10">
          {t.hero.description}
        </p>

        {/* Dynamic BUY / SELL Pills from Screenshot 1 */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-white/[0.03] border border-white/5 rounded-full shadow-inner animate-fade-in">
            <button
              type="button"
              onClick={() => setActiveToggle('KÖPA')}
              className={`px-8 py-2 rounded-full text-xs font-black transition-all duration-200 uppercase tracking-wider cursor-pointer select-none ${
                activeToggle === 'KÖPA'
                  ? 'bg-[#3cbd82] text-neutral-950 shadow-md shadow-emerald-500/15'
                  : 'bg-transparent text-white/50 hover:text-white'
              }`}
            >
              {t.hero.buy}
            </button>
            <button
              type="button"
              onClick={() => setActiveToggle('SÄLJA')}
              className={`px-8 py-2 rounded-full text-xs font-black transition-all duration-200 uppercase tracking-wider cursor-pointer select-none ${
                activeToggle === 'SÄLJA'
                  ? 'bg-[#3cbd82] text-neutral-950 shadow-md shadow-emerald-500/15'
                  : 'bg-transparent text-white/50 hover:text-white'
              }`}
            >
              {t.hero.sell}
            </button>
          </div>
        </div>

        {/* Premium Capsule Search Bar - Rounded style corresponding to Screenshot 1 */}
        <form onSubmit={handleTextSearchSubmit} className="max-w-3xl mx-auto mb-6">
          <div className="bg-[#0f110f]/90 border border-white/10 rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row gap-2 relative shadow-2xl">
            
            {/* Image Camera simulator */}
            <div 
              onClick={() => document.getElementById('camera-upload-input')?.click()}
              className="flex items-center px-4 text-white/30 border-r border-white/5 hover:text-[#3cbd82] transition-colors cursor-pointer" 
              title={language === 'SV' ? 'Ladda upp en bild' : 'Upload an image'}
            >
              <Camera className="w-5 h-5" />
              <input 
                id="camera-upload-input"
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden" 
              />
            </div>

            {/* Input "Vad letar du efter?" */}
            <div className="flex-1 text-left px-3 py-1">
              <span className="block text-[9px] font-bold text-[#3cbd82] uppercase tracking-widest leading-none mb-1 font-mono">
                {activeToggle === 'KÖPA' ? t.hero.searchLabel : t.hero.sellLabel}
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeToggle === 'KÖPA' ? t.hero.searchPlaceholder : t.hero.sellPlaceholder}
                className="w-full bg-transparent border-none text-white text-sm outline-none focus:ring-0 placeholder-white/30 p-0 font-semibold"
              />
            </div>

            {/* Selector Size "STORLEK: M / 38" */}
            <div className="relative border-t md:border-t-0 md:border-l border-white/5 px-5 py-1 text-left cursor-pointer hover:bg-white/[0.02] transition-all rounded-lg md:rounded-none" onClick={() => setSizeDropdown(!sizeDropdown)}>
              <span className="block text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1 font-mono">{t.hero.sizeLabel}</span>
              <div className="flex items-center gap-1.5 text-xs text-white/90 font-bold">
                <span>{selectedSize}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/40" />
              </div>
              
              {/* Dropdown Options */}
              {sizeDropdown && (
                <div className="absolute top-12 left-0 w-32 bg-[#0c0d0c] border border-[#3cbd82]/20 rounded-xl p-1.5 z-50 text-xs text-white/85 space-y-1 shadow-2xl">
                  {['XS / 34', 'S / 36', 'M / 38', 'L / 40', 'XL / 42'].map((size) => (
                    <div
                      key={size}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                        setSizeDropdown(false);
                        triggerSearchSimGroup(currentScanId);
                      }}
                      className="p-2 hover:bg-[#3cbd82]/10 hover:text-[#3cbd82] rounded-lg cursor-pointer transition-colors"
                    >
                      {size}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price limits "PRIS: Max SEK" */}
            <div className="border-t md:border-t-0 md:border-l border-white/5 px-5 py-1 text-left">
              <span className="block text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1 font-mono">{t.hero.priceLabel}</span>
              <input
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-transparent border-none text-xs text-white/90 font-bold outline-none leading-none p-0 w-20 focus:ring-0"
                placeholder={t.hero.pricePlaceholder}
              />
            </div>

            {/* Search BUTTON "Sök" */}
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl md:rounded-full bg-[#3cbd82] text-neutral-950 hover:bg-[#4dd293] transition-all flex items-center justify-center gap-1.5 text-xs font-black shrink-0 shadow-lg cursor-pointer select-none"
            >
              <Search className="w-3.5 h-3.5 text-neutral-950 stroke-[3px]" />
              <span>{activeToggle === 'KÖPA' ? t.hero.searchBtn : t.hero.sellBtn}</span>
            </button>
          </div>
        </form>

        {/* Quick Tag pills under search bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id, cat.label)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#3cbd82] text-[#091a11] border-[#3cbd82]'
                  : 'bg-white/5 border-white/5 text-white/60 hover:border-white/15 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Marketplace filters bar */}
        <div className="border-t border-white/5 pt-8 mb-10 text-center">
          <h3 className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-6 font-semibold">
            {t.hero.conMarketLabel}
          </h3>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto font-mono">
            {platforms.map((platform, idx) => {
              const isFirst = idx === 0;
              return (
                <button
                  key={platform}
                  onClick={() => setFilterPlatform(platform)}
                  className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                    filterPlatform === platform
                      ? `${isFirst ? 'border-[#ebefed] text-[#8b8484]' : 'border-[#3cbd82] text-[#3cbd82]'} bg-[#234535]`
                      : `${isFirst ? 'border-[#ebefed] text-[#8b8484]' : 'border-white/5 text-white/40'} bg-white/5 hover:border-white/10 hover:text-white`
                  }`}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>

        {/* DYNAMIC COMPARISON INTERFACE (SIMULATOR FOR REPEAK) */}
        <div id="sok-resultat" className="text-left mt-6 max-w-4xl mx-auto bg-[#0a0a0c]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative scroll-mt-24">
          
          {/* Header row of list console */}
          <div className="px-5 py-4 bg-white/[0.01] border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3cbd82] animate-pulse" />
              <span className="text-xs font-mono font-bold text-white/85">REPEAK LIVE AGGREGATION</span>
              {activeCategory && activeItem && (
                <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded uppercase">
                  {language === 'SV' ? 'Filtrerat' : 'Filtered'}: {activeItem.brand}
                </span>
              )}
            </div>
            
            {/* Elegant Sorting selector */}
            {activeItem && !isScanning && (
              <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 p-0.5 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setSortBy('relevance')}
                  className={`px-2 py-1 rounded text-[9px] font-bold tracking-wider uppercase transition-all select-none cursor-pointer ${
                    sortBy === 'relevance' 
                      ? 'bg-[#3cbd82] text-neutral-950 font-black' 
                      : 'text-white/40 hover:text-white/80 bg-transparent'
                  }`}
                >
                  {language === 'SV' ? 'Relevans' : 'Relevance'}
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('lowestPrice')}
                  className={`px-2 py-1 rounded text-[9px] font-bold tracking-wider uppercase transition-all select-none cursor-pointer ${
                    sortBy === 'lowestPrice' 
                      ? 'bg-[#3cbd82] text-neutral-950 font-black' 
                      : 'text-white/40 hover:text-white/80 bg-transparent'
                  }`}
                >
                  {language === 'SV' ? 'Billigast' : 'Cheapest'}
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className={`px-2 py-1 rounded text-[9px] font-bold tracking-wider uppercase transition-all select-none cursor-pointer ${
                    sortBy === 'newest' 
                      ? 'bg-[#3cbd82] text-neutral-950 font-black' 
                      : 'text-white/40 hover:text-white/80 bg-transparent'
                  }`}
                >
                  {language === 'SV' ? 'Nyast' : 'Newest'}
                </button>

                <Link
                  to={`/search?q=${encodeURIComponent(activeItem.name)}`}
                  className="px-2 py-1 rounded text-[9px] font-bold tracking-wider uppercase transition-all bg-[#3cbd82]/15 hover:bg-[#3cbd82] text-[#3cbd82] hover:text-neutral-950 flex items-center gap-1 border border-[#3cbd82]/30 cursor-pointer ml-1"
                  title={language === 'SV' ? 'Öppna sökresultat med avancerade filter' : 'Open search results with advanced filters'}
                >
                  <SlidersHorizontal className="w-2.5 h-2.5" />
                  <span>{language === 'SV' ? 'Avancerade filter' : 'Advanced Filters'}</span>
                </Link>
              </div>
            )}
          </div>

          <div className="p-5 md:p-6 min-h-[300px]">
            {isScanning ? (
              /* Scanning/comparison state */
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <RefreshCw className="w-8 h-8 text-[#3cbd82] animate-spin" />
                <div className="text-center font-mono text-xs text-white/60 space-y-1">
                  <p className="text-white font-semibold">{t.hero.scanningTitle}</p>
                  <p className="text-white/40 text-[10px]">{t.hero.scanningSubtitle}</p>
                </div>
              </div>
            ) : hasScanned ? (
              activeItem ? (
                <div className="space-y-6">
                  
                  {/* Meta summary tag blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl font-sans">
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase tracking-wider mb-0.5 font-bold font-mono">
                        {activeToggle === 'KÖPA' ? t.hero.searchedCloth : t.hero.valuedCloth}
                      </span>
                      <span className="text-white text-base font-bold truncate block">{activeItem.name}</span>
                      <span className="text-white/40 text-xs block font-mono">{activeItem.brand}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase tracking-wider mb-0.5 font-bold font-mono">
                        {t.hero.marketValue}
                      </span>
                      <span className="text-[#3cbd82] text-base font-black flex items-center gap-1.5 font-mono">
                        ~ {activeItem.avgValue} {language === 'SV' ? 'SEK' : 'kr'}
                      </span>
                      <span className="text-white/30 text-[10px] block font-mono">
                        {activeToggle === 'KÖPA' ? t.hero.basedOnHistory : t.hero.suggestedEndPrice}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase tracking-wider mb-0.5 font-bold font-mono">
                        {activeToggle === 'KÖPA' ? t.hero.normalPriceRange : t.hero.salesTarget}
                      </span>
                      <span className="text-white text-sm font-semibold truncate block font-mono">
                        {activeToggle === 'KÖPA' ? activeItem.marketRange : `${Math.round(activeItem.avgValue * 0.8)} kr - ${Math.round(activeItem.avgValue * 1.15)} kr`}
                      </span>
                      <span className="text-[#3cbd82] text-[10px] block font-mono font-bold">
                        {activeToggle === 'KÖPA' 
                          ? t.hero.bargainUnder.replace('{val}', activeItem.avgValue.toString())
                          : t.hero.startingBid.replace('{val}', Math.round(activeItem.avgValue * 0.7).toString())
                        }
                      </span>
                    </div>
                  </div>

                  {/* ADVANCED STATISTICS PANEL */}
                  {searchStatistics && (
                    <div className="bg-[#0f0f15] border border-white/5 rounded-xl p-5 space-y-6 font-sans">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono font-bold text-[#3cbd82] uppercase tracking-widest block">
                            {language === 'SV' ? 'AVANCERAD MARKNADSSTATISTIK' : 'ADVANCED MARKETPLACE ANALYTICS'}
                          </span>
                          <span className="text-[10px] text-white/40 block">
                            {language === 'SV' ? 'Beräknat på slutgiltiga, verifierade sökresultat' : 'Calculated strictly on finalized, verified listings'}
                          </span>
                        </div>
                        {analysis && (
                          <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-lg ${
                            analysis.marketCondition === 'Kap!' 
                              ? 'bg-[#153a2a] text-[#3cbd82] border border-[#3cbd82]/25 animate-pulse' 
                              : analysis.marketCondition === 'Överpris'
                                ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                                : 'bg-white/5 text-white/50 border border-white/5'
                          }`}>
                            {language === 'SV' ? 'FYNDPROSPEKT' : 'PROSPECT'}: {
                              analysis.marketCondition === 'Kap!' ? (language === 'SV' ? 'STARKT FYNDLÄGE!' : 'BARGAIN OPPORTUNITY!') : 
                              analysis.marketCondition === 'Överpris' ? (language === 'SV' ? 'DYR PRISSÄTTNING' : 'PREMIUM MARKET') : 
                              (language === 'SV' ? 'REKO PRISSÄTTNING' : 'ROBUST RETAIL PRICE')
                            }
                          </span>
                        )}
                      </div>

                      {/* STATS CORE GRID */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                        <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-lg space-y-1">
                          <span className="text-[9px] text-white/40 block font-mono uppercase tracking-wider">
                            {language === 'SV' ? 'Lägsta pris' : 'Lowest Price'}
                          </span>
                          <span className="text-[#3cbd82] text-lg font-black font-mono block">
                            {(searchStatistics.lowestPrice || 0).toLocaleString('sv-SE')} kr
                          </span>
                          <span className="text-[9px] text-white/30 block">
                            {language === 'SV' ? 'Absoluta bottenpriset' : 'Bottom deal found'}
                          </span>
                        </div>

                        <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-lg space-y-1">
                          <span className="text-[9px] text-white/40 block font-mono uppercase tracking-wider">
                            {language === 'SV' ? 'Medianpris' : 'Median Price'}
                          </span>
                          <span className="text-white/85 text-base font-bold font-mono block">
                            {(searchStatistics.medianPrice || 0).toLocaleString('sv-SE')} kr
                          </span>
                          <span className="text-[9px] text-white/30 block">
                            {language === 'SV' ? 'Mitten av prisspannet' : 'Halfway of listings'}
                          </span>
                        </div>

                        <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-lg space-y-1">
                          <span className="text-[9px] text-white/40 block font-mono uppercase tracking-wider">
                            {language === 'SV' ? 'Medelpris (Snitt)' : 'Average Price'}
                          </span>
                          <span className="text-white/85 text-base font-bold font-mono block">
                            {(searchStatistics.averagePrice || 0).toLocaleString('sv-SE')} kr
                          </span>
                          <span className="text-[9px] text-white/30 block">
                            {language === 'SV' ? 'Snabbt genomsnitt' : 'Simple mean price'}
                          </span>
                        </div>

                        <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-lg space-y-1">
                          <span className="text-[9px] text-white/40 block font-mono uppercase tracking-wider">
                            {language === 'SV' ? 'Högsta pris' : 'Highest Price'}
                          </span>
                          <span className="text-white/60 text-base font-bold font-mono block">
                            {(searchStatistics.highestPrice || 0).toLocaleString('sv-SE')} kr
                          </span>
                          <span className="text-[9px] text-white/30 block">
                            {language === 'SV' ? 'Exklusivaste skicket' : 'Highest premium condition'}
                          </span>
                        </div>
                      </div>

                      {/* GRAPHIC BARS FOR DISTRIBUTIONS */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-white/5">
                        {/* Price Distribution */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-[#3cbd82] uppercase tracking-wider block font-mono font-bold">
                            {language === 'SV' ? 'Prisfördelning' : 'Price Distribution'}
                          </span>
                          <div className="space-y-2 bg-white/[0.01] border border-white/5 p-3 rounded-lg">
                            {(searchStatistics.priceDistribution || []).map((dist: any, i: number) => {
                              const total = (searchStatistics.priceDistribution || []).reduce((acc: number, d: any) => acc + (d.count || 0), 0);
                              const pct = total > 0 ? ((dist.count || 0) / total) * 100 : 0;
                              return (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-white/50">{dist.range}</span>
                                    <span className="text-white/80 font-bold">{dist.count || 0} {language === 'SV' ? 'st' : 'items'} ({Math.round(pct)}%)</span>
                                  </div>
                                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#3cbd82] h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quality Distribution */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-[#3cbd82] uppercase tracking-wider block font-mono font-bold">
                            {language === 'SV' ? 'Kvalitetsfördelning' : 'Quality Distribution'}
                          </span>
                          <div className="space-y-2 bg-white/[0.01] border border-white/5 p-3 rounded-lg">
                            {(searchStatistics.qualityDistribution || []).map((dist: any, i: number) => {
                              const total = (searchStatistics.qualityDistribution || []).reduce((acc: number, d: any) => acc + (d.count || 0), 0);
                              const pct = total > 0 ? ((dist.count || 0) / total) * 100 : 0;
                              return (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-white/50">{dist.range}</span>
                                    <span className="text-white/80 font-bold">{dist.count || 0} {language === 'SV' ? 'st' : 'items'} ({Math.round(pct)}%)</span>
                                  </div>
                                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Value Distribution */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-[#3cbd82] uppercase tracking-wider block font-mono font-bold">
                            {language === 'SV' ? 'Prisvärdhetsfördelning' : 'Value Index Distribution'}
                          </span>
                          <div className="space-y-2 bg-white/[0.01] border border-white/5 p-3 rounded-lg">
                            {(searchStatistics.valueDistribution || []).map((dist: any, i: number) => {
                              const total = (searchStatistics.valueDistribution || []).reduce((acc: number, d: any) => acc + (d.count || 0), 0);
                              const pct = total > 0 ? ((dist.count || 0) / total) * 100 : 0;
                              return (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-white/50">{dist.range}</span>
                                    <span className="text-white/80 font-bold">{dist.count || 0} {language === 'SV' ? 'st' : 'items'} ({Math.round(pct)}%)</span>
                                  </div>
                                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-400 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BEST DEALS GOLD HIGHLIGHT SECTION */}
                  {bestDeals && (
                    <div className="bg-[#12110c] border border-amber-500/20 rounded-xl p-5 space-y-4 font-sans shadow-lg shadow-amber-500/[0.02]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-[11px] font-mono font-black text-amber-400 uppercase tracking-widest">
                          {language === 'SV' ? 'REPEAK REKOMMENDERADE FYND-URVAL' : 'REPEAK RECOMMENDED SMART DEALS'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {/* 1. Cheapest */}
                        {bestDeals.cheapest && (
                          <div className="border border-white/5 bg-white/[0.01] p-3 rounded-lg flex flex-col justify-between">
                            <div>
                              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-[8px] font-black uppercase font-mono rounded tracking-wider mb-2 inline-block">
                                {language === 'SV' ? 'BILLIGAST' : 'CHEAPEST'}
                              </span>
                              <p className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1.5">{bestDeals.cheapest.title || bestDeals.cheapest.desc}</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                              <span className="text-[#3cbd82] font-extrabold">{bestDeals.cheapest.price} kr</span>
                              <span className="text-white/40">{bestDeals.cheapest.marketplace}</span>
                            </div>
                          </div>
                        )}

                        {/* 2. Best Value */}
                        {bestDeals.bestValue && (
                          <div className="border border-white/5 bg-white/[0.01] p-3 rounded-lg flex flex-col justify-between">
                            <div>
                              <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 text-[8px] font-black uppercase font-mono rounded tracking-wider mb-2 inline-block">
                                {language === 'SV' ? 'MEST PRISVÄRD' : 'BEST VALUE'}
                              </span>
                              <p className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1.5">{bestDeals.bestValue.title || bestDeals.bestValue.desc}</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                              <span className="text-[#3cbd82] font-extrabold">{bestDeals.bestValue.price} kr</span>
                              <span className="text-white/40">{bestDeals.bestValue.marketplace}</span>
                            </div>
                          </div>
                        )}

                        {/* 3. Highest Quality */}
                        {bestDeals.highestQuality && (
                          <div className="border border-white/5 bg-white/[0.01] p-3 rounded-lg flex flex-col justify-between">
                            <div>
                              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 text-[8px] font-black uppercase font-mono rounded tracking-wider mb-2 inline-block">
                                {language === 'SV' ? 'HÖGST KVALITET' : 'HIGHEST QUALITY'}
                              </span>
                              <p className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1.5">{bestDeals.highestQuality.title || bestDeals.highestQuality.desc}</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                              <span className="text-[#3cbd82] font-extrabold">{bestDeals.highestQuality.price} kr</span>
                              <span className="text-white/40">{bestDeals.highestQuality.marketplace}</span>
                            </div>
                          </div>
                        )}

                        {/* 4. Best Overall */}
                        {bestDeals.bestOverall && (
                          <div className="border border-amber-500/25 bg-amber-500/[0.02] p-3 rounded-lg flex flex-col justify-between">
                            <div>
                              <span className="px-2 py-0.5 bg-amber-500 text-neutral-900 text-[8px] font-black uppercase font-mono rounded tracking-wider mb-2 inline-block">
                                {language === 'SV' ? 'REKOMMENDERAS' : 'RECOMMENDED'}
                              </span>
                              <p className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1.5">{bestDeals.bestOverall.title || bestDeals.bestOverall.desc}</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                              <span className="text-[#3cbd82] font-extrabold">{bestDeals.bestOverall.price} kr</span>
                              <span className="text-white/40">{bestDeals.bestOverall.marketplace}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Listings stream */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#3cbd82]/80">
                        {t.hero.foundListings}
                      </h3>
                      <Link
                        to={`/search?q=${encodeURIComponent(activeItem.name)}`}
                        className="text-[11px] font-mono font-medium text-[#3cbd82] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        <span>{language === 'SV' ? 'Filtrera på märke, storlek, färg & pris →' : 'Filter by brand, size, color & price →'}</span>
                      </Link>
                    </div>

                    <div className="space-y-2.5">
                      {filteredListings.length === 0 ? (
                        <div className="py-12 text-center font-mono text-xs text-white/40">
                          {t.hero.noListingsFound.replace('{platform}', filterPlatform)}
                        </div>
                      ) : (
                        filteredListings.map((listing, i) => (
                          <div
                            key={i}
                            className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-250 hover:bg-white/[0.02]"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black ${
                                  listing.platform.toUpperCase() === 'VINTED'
                                    ? 'bg-[#09B1BA]/10 text-[#09B1BA] border border-[#09B1BA]/20'
                                    : listing.platform.toUpperCase() === 'TRADERA'
                                    ? 'bg-[#f07c00]/10 text-[#f07c00] border border-[#f07c00]/20'
                                    : listing.platform.toUpperCase() === 'BLOCKET'
                                    ? 'bg-[#004f9e]/10 text-[#2cb1fc] border border-[#004f9e]/20'
                                    : listing.platform.toUpperCase() === 'PLICK'
                                    ? 'bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20'
                                    : listing.platform.toUpperCase() === 'SELLPY'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-white/5 border border-white/10 text-white/70'
                                }`}>
                                  {listing.platform}
                                </span>
                                <span className="text-xs text-white/95 font-bold">
                                  {activeItem.name}
                                </span>
                                
                                {/* Valuation AI badge */}
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                                  listing.tag === 'Kap!' 
                                    ? 'bg-emerald-500/10 text-[#3cbd82] border border-emerald-500/20'
                                    : listing.tag === 'Rättvist'
                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                    {translateTag(listing.tag, language)}
                                  </span>

                                {/* Smart Price Role pill */}
                                {listing.role && (
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                                    listing.role === 'Budget'
                                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                                      : listing.role === 'Best Value'
                                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                                      : listing.role === 'Mid-range'
                                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                                  }`}>
                                    {listing.role}
                                  </span>
                                )}

                                {/* Score indicators */}
                                {listing.qualityScore !== undefined && (
                                  <span className="text-[10px] font-mono text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                                    {language === 'SV' ? `Kvalitet: ${listing.qualityScore}/100` : `Quality: ${listing.qualityScore}/100`}
                                  </span>
                                )}
                                {listing.valueScore !== undefined && (
                                  <span className="text-[10px] font-mono text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                                    {language === 'SV' ? `Värde: ${listing.valueScore}/100` : `Value Score: ${listing.valueScore}/100`}
                                  </span>
                                )}
                                {listing.finalScore !== undefined && (
                                  <span className="text-[10px] font-mono font-bold text-[#3cbd82] bg-[#3cbd82]/5 border border-[#3cbd82]/10 px-2 py-0.5 rounded whitespace-nowrap">
                                    {language === 'SV' ? `Betyg: ${listing.finalScore}%` : `Score: ${listing.finalScore}%`}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/60 font-light truncate max-w-xl">
                                {translateDesc(listing.desc, language)}
                              </p>
                              <div className="text-[10px] text-white/30 font-mono flex items-center gap-2 flex-wrap font-medium">
                                <span>{language === 'SV' ? 'Skick' : 'Condition'}: {translateCondition(listing.condition, language)}</span>
                                <span>•</span>
                                <span>{translateRating(listing.rating, language)}</span>
                                {listing.photosCount !== undefined && (
                                  <>
                                    <span>•</span>
                                    <span>{listing.photosCount} {language === 'SV' ? 'bilder' : 'photos'}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex md:flex-col items-end justify-between w-full md:w-auto shrink-0 border-t md:border-t-0 border-white/5 pt-3.5 md:pt-0 gap-2">
                              <span className="text-lg font-black text-white font-mono shrink-0">
                                {listing.price} {language === 'SV' ? 'kr' : 'kr'}
                              </span>
                              <div className="flex gap-2 items-center">
                                <button
                                  onClick={() => setShareListing({
                                    title: activeItem?.name || 'Circular Fashion Item',
                                    price: listing.price,
                                    marketplace: listing.platform,
                                    link: resolveListingUrl(listing.url, listing.platform, activeItem?.name || ''),
                                    condition: listing.condition
                                  })}
                                  className="px-3.5 py-1.5 bg-[#3cbd82]/10 hover:bg-[#3cbd82]/20 border border-[#3cbd82]/25 hover:border-[#3cbd82]/40 text-xs font-semibold text-[#3cbd82] rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                                  title={language === 'SV' ? 'Dela via Gmail' : 'Share via Gmail'}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>{language === 'SV' ? 'Dela' : 'Share'}</span>
                                </button>

                                {(() => {
                                  const hasDirectUrl = listing.hasDirectUrl !== false;
                                  const platformUpper = listing.platform.toUpperCase();
                                  let buttonLabel = t.hero.showListing;
                                  if (!hasDirectUrl) {
                                    if (platformUpper === 'PLICK') {
                                      buttonLabel = t.hero.searchOnPlick;
                                    } else if (platformUpper === 'TRADERA') {
                                      buttonLabel = t.hero.searchOnTradera;
                                    } else {
                                      buttonLabel = language === 'SV'
                                        ? `Sök på ${listing.platform}`
                                        : `Search on ${listing.platform}`;
                                    }
                                  }
                                  return (
                                    <a
                                      href={resolveListingUrl(listing.url, listing.platform, activeItem.name)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 hover:text-white border border-white/10 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                      <span>{buttonLabel}</span>
                                      <ExternalLink className="w-3 h-3 text-white/50" />
                                    </a>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {geminiAnalysis && (
                    <div className="bg-gradient-to-br from-[#0c0f0d] to-[#060606] border border-[#3cbd82]/20 rounded-xl p-5 md:p-6 space-y-5 font-sans shadow-lg relative overflow-hidden">
                      {/* Decorative background glow for AI feeling */}
                      <div className="absolute top-0 right-0 w-44 h-44 bg-[#3cbd82]/5 blur-3xl rounded-full pointer-events-none" />

                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#3cbd82] animate-pulse" />
                          <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
                            {language === 'SV' ? 'GEMINI 3.5 AI-ANALYSLAGER' : 'GEMINI 3.5 AI ANALYSIS LAYER'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#3cbd82]/80 bg-[#3cbd82]/10 px-2 py-0.5 rounded border border-[#3cbd82]/20 uppercase font-black tracking-wider pointer-events-none select-none">
                          Real-Time Engine
                        </span>
                      </div>

                      {/* Premium Tab Buttons */}
                      <div className="flex flex-wrap gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-lg">
                        {[
                          { id: 'bargain' },
                          { id: 'trend' },
                          { id: 'price' },
                          { id: 'fake' },
                          { id: 'insights' }
                        ].map((tab) => {
                          let label = '';
                          if (tab.id === 'bargain') {
                            label = language === 'SV' ? '💎 Kap-analys' : '💎 Deal Analysis';
                          } else if (tab.id === 'trend') {
                            label = language === 'SV' ? '📈 Trendanalys' : '📈 Trend Analysis';
                          } else if (tab.id === 'price') {
                            label = language === 'SV' ? '🏷️ Prisanalys' : '🏷️ Price History';
                          } else if (tab.id === 'fake') {
                            label = language === 'SV' ? '⚠️ Fejkvarning' : '⚠️ Authenticity';
                          } else {
                            label = language === 'SV' ? '💡 Insikter' : '💡 Product Insights';
                          }

                          const isActive = activeAnalysisTab === tab.id;

                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveAnalysisTab(tab.id as any)}
                              className={`flex-1 min-w-[120px] sm:min-w-0 px-3 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 select-none cursor-pointer ${
                                isActive
                                  ? 'bg-[#3cbd82]/10 border border-[#3cbd82]/30 text-[#3cbd82] font-black'
                                  : 'bg-transparent border border-transparent text-white/50 hover:text-white hover:bg-white/[0.01]'
                              }`}
                            >
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Interactive Tab Content Display */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeAnalysisTab}
                          initial={{ opacity: 0, y: 7 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -7 }}
                          transition={{ duration: 0.18 }}
                          className="bg-white/[0.01] border border-white/5 rounded-xl p-4 md:p-5 leading-relaxed text-xs md:text-sm text-white/80 space-y-2.5 min-h-[100px]"
                        >
                          {activeAnalysisTab === 'bargain' && (
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#3cbd82] font-extrabold block">Kap-analys / Bargain Analysis</span>
                              <p className="text-white/90 leading-relaxed font-light">{geminiAnalysis.bargainAnalysis}</p>
                            </div>
                          )}
                          {activeAnalysisTab === 'trend' && (
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-extrabold block">Trendanalys / Volumetric Demand</span>
                              <p className="text-white/90 leading-relaxed font-light">{geminiAnalysis.trendAnalysis}</p>
                            </div>
                          )}
                          {activeAnalysisTab === 'price' && (
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-extrabold block">Prisanalys / Historical Benchmarks</span>
                              <p className="text-white/90 leading-relaxed font-light">{geminiAnalysis.priceAnalysis}</p>
                            </div>
                          )}
                          {activeAnalysisTab === 'fake' && (
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-rose-400 font-extrabold block">Fejkvarning / Integrity Shields</span>
                              <p className="text-white/90 leading-relaxed font-light">{geminiAnalysis.authenticityWarning}</p>
                            </div>
                          )}
                          {activeAnalysisTab === 'insights' && (
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-extrabold block">Produktinsikter / Style Curation</span>
                              <p className="text-white/90 leading-relaxed font-light">{geminiAnalysis.productInsights}</p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-white/45 space-y-3 font-mono text-xs">
                  <AlertTriangle className="w-8 h-8 text-[#3cbd82]/60 animate-pulse" />
                  <p className="font-semibold text-white/80">{language === 'SV' ? 'Inga matchande produkter hittades' : 'No matching products found'}</p>
                  <p className="text-white/40 max-w-sm text-[10px] leading-relaxed">
                    {language === 'SV' 
                     ? 'Vi hittade inga secondhand-listningar just nu för din sökning i vår databas. Prova att söka efter ett annat känt märke eller modekategori!'
                     : "We couldn't find any secondhand listings for your query in our index. Try searching for other famous fashion brands or categories!"}
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-white/40 space-y-3 font-mono text-xs">
                <Search className="w-6 h-6 text-white/20" />
                <p>{t.hero.emptySearch}</p>
              </div>
            )}
          </div>

          <div className="bg-white/[0.01] p-4 border-t border-white/5 text-[10px] font-mono text-white/40 flex flex-col md:flex-row justify-between items-center gap-2 leading-none">
            <span>{t.hero.scanningFooter}</span>
            <span className="text-[#3cbd82] font-semibold">{t.hero.autoIntegration}</span>
          </div>
        </div>

        {/* Workspace Share Modal */}
        {shareListing && (
          <WorkspaceShare
            listing={shareListing}
            onClose={() => setShareListing(null)}
            language={language}
          />
        )}

      </div>
    </section>
  );
}
