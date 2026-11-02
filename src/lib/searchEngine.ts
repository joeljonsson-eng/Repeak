import { SearchListing, SearchFilterState } from '../types';

/**
 * Strips diacritics, accents, apostrophes, and standardizes spacing.
 * Examples:
 *   "Stüssy" -> "stussy"
 *   "Arc'teryx" -> "arcteryx"
 *   "Comme des Garçons" -> "comme des garcons"
 *   "Totême" -> "toteme"
 *   "Vintage Levi’s" -> "vintage levis"
 *   "Väska" -> "vaska"
 *   "Tröja" -> "troja"
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics (ü -> u, ê -> e, ç -> c, etc.)
    .replace(/['’`´]/g, '') // strip all variations of apostrophes
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Standard Levenshtein distance calculation for typo tolerance.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export interface BrandMapping {
  canonical: string;
  aliases: string[];
}

export const BRAND_DICTIONARY: Record<string, BrandMapping> = {
  "Arc'teryx": {
    canonical: "Arc'teryx",
    aliases: ['arcteryx', 'arc teryx', 'arc', 'dead bird', 'arteryx', 'arcterix', 'beta lt', 'alpha sv', 'atom lt']
  },
  "Stüssy": {
    canonical: "Stüssy",
    aliases: ['stussy', 'stussii', 'stussi', 'stusse', 'stuessy', '8 ball', 'basic stock', 'stussy hoodie']
  },
  "Comme des Garçons": {
    canonical: "Comme des Garçons",
    aliases: ['comme des garcons', 'cdg', 'comme', 'garcons', 'play cdg', 'cdg play']
  },
  "Totême": {
    canonical: "Totême",
    aliases: ['toteme', 'totem', 't lock', 'toteme striped']
  },
  "Levi's": {
    canonical: "Levi's",
    aliases: ['levis', 'levi', '501', '550', 'ribcage', 'silvertab', 'vintage levis']
  },
  "Acne Studios": {
    canonical: "Acne Studios",
    aliases: ['acne', 'acne studio', 'musubi', '1996 denim', 'face patch', 'ferris']
  },
  "Our Legacy": {
    canonical: "Our Legacy",
    aliases: ['our legacy', 'ourlegacy', 'legacy', 'camion', 'third cut']
  },
  "Stone Island": {
    canonical: "Stone Island",
    aliases: ['stone island', 'stoney', 'stoneisland', 'si', 'compass patch', 'crinkle reps', 'soft shell']
  },
  "New Balance": {
    canonical: "New Balance",
    aliases: ['new balance', 'newbalance', 'nb', '1906r', '550', '990', '990v5', '2002r', 'protection pack']
  },
  "Adidas": {
    canonical: "Adidas",
    aliases: ['adidas', 'addidas', 'samba', 'sambas', 'gazelle', 'campus', 'spezial', 'wales bonner', 'forum']
  },
  "Nike": {
    canonical: "Nike",
    aliases: ['nike', 'nikke', 'dunk', 'dunk low', 'dunks', 'air force', 'af1', 'jordan', 'air jordan', 'acg', 'vintage swoosh']
  },
  "Carhartt": {
    canonical: "Carhartt",
    aliases: ['carhartt', 'carhart', 'carhartt wip', 'wip', 'detroit jacket', 'double knee', 'j97']
  },
  "Patagonia": {
    canonical: "Patagonia",
    aliases: ['patagonia', 'patagonea', 'retro x', 'synchilla', 'torrentshell', 'patagonia fleece']
  },
  "Maison Margiela": {
    canonical: "Maison Margiela",
    aliases: ['maison margiela', 'margiela', 'mm6', 'tabi', 'replica sneaker', 'gat']
  },
  "Salomon": {
    canonical: "Salomon",
    aliases: ['salomon', 'solomon', 'xt 6', 'xt6', 'acs pro', 'speedcross']
  },
  "Ralph Lauren": {
    canonical: "Ralph Lauren",
    aliases: ['ralph lauren', 'polo', 'polo ralph lauren', 'polo sport', 'cable knit']
  },
  "Ganni": {
    canonical: "Ganni",
    aliases: ['ganni', 'bou bag', 'seersucker']
  },
  "Diesel": {
    canonical: "Diesel",
    aliases: ['diesel', '1dr', 'd sire', 'd-sire']
  },
  "Prada": {
    canonical: "Prada",
    aliases: ['prada', 're nylon', 'linea rossa', 'saffiano', 'prada hobo']
  },
  "Asics": {
    canonical: "Asics",
    aliases: ['asics', 'kayano', 'gel kayano', 'gel nyc', 'gt 2160']
  }
};

/**
 * Bilingual category synonyms (Swedish & English)
 */
export const CATEGORY_SYNONYMS: Record<string, string[]> = {
  vaskor: [
    'vaska', 'vaskor', 'väska', 'väskor', 'bag', 'bags', 'shoulder', 'tote', 'crossbody',
    'handvaska', 'handväska', 'handbag', 'clutch', 'backpack', 'ryggsack', 'ryggsäck', 'pouch', 'clutch'
  ],
  jackor: [
    'jacka', 'jackor', 'jacket', 'jackets', 'coat', 'kappa', 'puffer', 'fleece',
    'windbreaker', 'vindjacka', 'skaljacka', 'dunfoder', 'down', 'vest', 'vast', 'väst',
    'anorak', 'bomber', 'harrington', 'trenchcoat', 'parkas', 'gore tex'
  ],
  stickat: [
    'troja', 'trojor', 'tröja', 'tröjor', 'stickat', 'stickad', 'hoodie', 'hoodies',
    'sweater', 'sweaters', 'cardigan', 'knit', 'knits', 'knitwear', 'crewneck', 'sweatshirt',
    'kofta', 'polo', 'pullover', 'jumper', 'zip'
  ],
  jeans: [
    'jeans', 'denim', 'byxor', 'byxa', 'pants', 'trousers', '501', 'chinos', 'cargo',
    'straight', 'wide leg', 'flare', 'loose fit', 'baggy', 'double knee'
  ],
  sneakers: [
    'skor', 'sko', 'sneakers', 'sneaker', 'boots', 'kangor', 'kängor', 'shoes', 'footwear',
    'tabi', 'loafers', 'sandaler', 'slippers', 'trainers', 'kicks', 'runner', 'retro'
  ],
  't-shirt': [
    'tshirt', 't shirt', 'tee', 'tischa', 'troja', 'kortarmad', 'kortärmad', 'linne', 'top', 't-shirt'
  ],
  klanning: [
    'klanning', 'klänning', 'dress', 'dresses', 'kjol', 'skirt', 'maxi', 'midi'
  ],
  accessoarer: [
    'keps', 'mossa', 'mössa', 'halsduk', 'balte', 'bälte', 'scarf', 'beanie', 'cap',
    'accessory', 'accessories', 'plånbok', 'planbok', 'wallet', 'solglasogon', 'solglasögon', 'sunglasses'
  ]
};

/**
 * Detects if a query contains a known brand alias or typo and returns a canonical suggestion.
 */
export function detectSmartCorrection(query: string): { original: string; canonical: string } | null {
  const normQ = normalizeSearchText(query);
  if (!normQ) return null;

  // Direct alias check
  for (const [key, mapping] of Object.entries(BRAND_DICTIONARY)) {
    const normCanonical = normalizeSearchText(mapping.canonical);
    if (normQ === normCanonical) continue; // already typed properly

    for (const alias of mapping.aliases) {
      const normAlias = normalizeSearchText(alias);
      if (normQ === normAlias || normQ.includes(normAlias) || normAlias.includes(normQ)) {
        return { original: query, canonical: mapping.canonical };
      }
    }

    // Levenshtein typo match (e.g., "arcterix" -> "Arc'teryx", "nikke" -> "Nike")
    if (normQ.length >= 4 && normCanonical.length >= 4) {
      const dist = levenshteinDistance(normQ, normCanonical);
      if (dist <= 2) {
        return { original: query, canonical: mapping.canonical };
      }
    }
  }

  return null;
}

/**
 * Calculates a multi-factor search relevance score for a listing against a query.
 * Higher score = higher ranking.
 */
export function scoreListingRelevance(item: SearchListing, query: string): { score: number; isMatch: boolean } {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) {
    return { score: (item.finalScore ?? 80), isMatch: true };
  }

  const queryTokens = normQuery.split(' ').filter(Boolean);
  if (queryTokens.length === 0) {
    return { score: (item.finalScore ?? 80), isMatch: true };
  }

  const normTitle = normalizeSearchText(item.title);
  const normBrand = normalizeSearchText(item.brand);
  const normCategory = normalizeSearchText(item.category);
  const normDesc = normalizeSearchText(item.desc);
  const normColor = normalizeSearchText(item.color);
  const normMarket = normalizeSearchText(item.marketplace);

  const categorySyns = (CATEGORY_SYNONYMS[item.category] || []).map(normalizeSearchText);

  // Look up any brand aliases for this item's brand
  const brandEntry = Object.values(BRAND_DICTIONARY).find(
    b => normalizeSearchText(b.canonical) === normBrand
  );
  const brandAliases = brandEntry ? brandEntry.aliases.map(normalizeSearchText) : [];

  let score = 0;
  let matchedTokensCount = 0;

  // 1. Exact full phrase matches
  if (normTitle.includes(normQuery)) {
    score += 150;
  }
  if (normBrand === normQuery) {
    score += 120;
  } else if (brandAliases.includes(normQuery)) {
    score += 110;
  }

  // 2. Token-by-token evaluation
  for (const token of queryTokens) {
    let tokenMatched = false;

    // Brand match
    if (normBrand.includes(token)) {
      score += 60;
      tokenMatched = true;
    } else if (brandAliases.some(a => a.includes(token) || token.includes(a))) {
      score += 50;
      tokenMatched = true;
    }

    // Title match
    if (normTitle.includes(token)) {
      score += 45;
      tokenMatched = true;
    }

    // Category / Synonym match
    if (normCategory.includes(token) || categorySyns.some(s => s.includes(token))) {
      score += 35;
      tokenMatched = true;
    }

    // Color match
    if (normColor.includes(token)) {
      score += 25;
      tokenMatched = true;
    }

    // Marketplace match
    if (normMarket.includes(token)) {
      score += 20;
      tokenMatched = true;
    }

    // Description match
    if (normDesc.includes(token)) {
      score += 15;
      tokenMatched = true;
    }

    // Fuzzy token match (if token is at least 4 characters)
    if (!tokenMatched && token.length >= 4) {
      const allWords = `${normTitle} ${normBrand}`.split(' ');
      for (const word of allWords) {
        if (word.length >= 4 && levenshteinDistance(token, word) <= 1) {
          score += 25;
          tokenMatched = true;
          break;
        }
      }
    }

    if (tokenMatched) {
      matchedTokensCount++;
    }
  }

  // Coverage bonus: reward listings that match all or most tokens
  const matchRatio = matchedTokensCount / queryTokens.length;
  if (matchRatio === 1) {
    score += 100; // Perfect match bonus
  } else if (matchRatio >= 0.75) {
    score += 50;
  } else if (matchRatio >= 0.5) {
    score += 20;
  }

  // Bargain & deal bonus
  if (item.tag === 'Kap!') {
    score += 15;
  }
  if (item.finalScore) {
    score += item.finalScore / 10;
  }

  // Threshold: must match at least one token or have a score > 40
  const isMatch = matchedTokensCount > 0 && score >= 35;

  return { score, isMatch };
}

/**
 * Filter items by facets (brands, sizes, colors, conditions, price range, marketplaces, tags).
 */
export function matchesFacets(item: SearchListing, filters: SearchFilterState): boolean {
  // Brand
  if (filters.brands.length > 0) {
    const itemNormBrand = normalizeSearchText(item.brand);
    const brandMatch = filters.brands.some(b => {
      const normB = normalizeSearchText(b);
      return itemNormBrand === normB || itemNormBrand.includes(normB);
    });
    if (!brandMatch) return false;
  }

  // Size
  if (filters.sizes.length > 0) {
    const itemSize = item.size.toLowerCase();
    const sizeMatch = filters.sizes.some(s => s.toLowerCase() === itemSize);
    if (!sizeMatch) return false;
  }

  // Color
  if (filters.colors.length > 0) {
    const colorMatch = filters.colors.some(c => c.toLowerCase() === item.color.toLowerCase());
    if (!colorMatch) return false;
  }

  // Condition
  if (filters.conditions.length > 0) {
    const condMatch = filters.conditions.some(cond => cond.toLowerCase() === item.condition.toLowerCase());
    if (!condMatch) return false;
  }

  // Price range
  if (filters.minPrice !== null && item.price < filters.minPrice) return false;
  if (filters.maxPrice !== null && item.price > filters.maxPrice) return false;

  // Marketplace
  if (filters.marketplaces.length > 0) {
    const marketMatch = filters.marketplaces.some(m => m.toLowerCase() === item.marketplace.toLowerCase());
    if (!marketMatch) return false;
  }

  // Tags
  if (filters.tags.length > 0) {
    if (!filters.tags.includes(item.tag)) return false;
  }

  return true;
}

/**
 * Curated Unsplash images categorized for fallback synthesis
 */
const CATEGORY_IMAGES: Record<string, string[]> = {
  hoodie: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop'
  ],
  jacket: [
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop'
  ],
  jeans: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&auto=format&fit=crop'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop'
  ],
  bag: [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop'
  ],
  knit: [
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&auto=format&fit=crop'
  ],
  generic: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop'
  ]
};

/**
 * Detects appropriate fashion category and image pool for an arbitrary query
 */
function inferCategoryFromQuery(query: string): { catKey: string; category: string; images: string[] } {
  const norm = normalizeSearchText(query);
  if (norm.includes('sko') || norm.includes('sneaker') || norm.includes('boot') || norm.includes('dunk') || norm.includes('samba') || norm.includes('jordan')) {
    return { catKey: 'shoes', category: 'sneakers', images: CATEGORY_IMAGES.shoes };
  }
  if (norm.includes('jack') || norm.includes('puffer') || norm.includes('fleece') || norm.includes('kappa') || norm.includes('coat') || norm.includes('vest')) {
    return { catKey: 'jacket', category: 'jackor', images: CATEGORY_IMAGES.jacket };
  }
  if (norm.includes('jean') || norm.includes('denim') || norm.includes('byx') || norm.includes('pants') || norm.includes('501')) {
    return { catKey: 'jeans', category: 'jeans', images: CATEGORY_IMAGES.jeans };
  }
  if (norm.includes('vask') || norm.includes('bag') || norm.includes('tote') || norm.includes('t-lock') || norm.includes('musubi')) {
    return { catKey: 'bag', category: 'vaskor', images: CATEGORY_IMAGES.bag };
  }
  if (norm.includes('hoodie') || norm.includes('sweat')) {
    return { catKey: 'hoodie', category: 'stickat', images: CATEGORY_IMAGES.hoodie };
  }
  if (norm.includes('troj') || norm.includes('stick') || norm.includes('knit') || norm.includes('cardigan') || norm.includes('kofta')) {
    return { catKey: 'knit', category: 'stickat', images: CATEGORY_IMAGES.knit };
  }
  return { catKey: 'generic', category: 'accessoarer', images: CATEGORY_IMAGES.generic };
}

/**
 * Capitalizes string nicely
 */
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**
 * Dynamically synthesizes authentic Swedish secondhand marketplace listings when a niche query
 * has few or zero matches in the pre-compiled dataset.
 */
export function generateDynamicListingsForQuery(query: string, count = 6): SearchListing[] {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  const { category, images } = inferCategoryFromQuery(cleanQ);
  const correction = detectSmartCorrection(cleanQ);
  const brandName = correction ? correction.canonical : toTitleCase(cleanQ.split(' ')[0] || 'Vintage');
  const titleDisplay = correction ? cleanQ.replace(new RegExp(correction.original, 'i'), correction.canonical) : cleanQ;

  const marketplaces: SearchListing['marketplace'][] = ['Tradera', 'Vinted', 'Sellpy', 'Blocket', 'Plick'];
  const conditions: SearchListing['condition'][] = ['Nyskick', 'Mycket bra skick', 'Bra skick', 'Vintageskick'];
  const sizes = ['S', 'M', 'L', 'XL', 'W30', 'W32', '39', '42', '43'];
  const colors = ['Svart', 'Vit', 'Grå', 'Blå', 'Beige', 'Grön', 'Brun'];

  const basePriceSeed = Math.max(350, Math.min(6500, cleanQ.length * 110 + 450));

  const results: SearchListing[] = [];

  for (let i = 0; i < count; i++) {
    const market = marketplaces[i % marketplaces.length];
    const cond = conditions[i % conditions.length];
    const size = sizes[(i * 2 + 1) % sizes.length];
    const color = colors[(i + 2) % colors.length];
    const imgUrl = images[i % images.length];

    // Price variation
    const priceVariance = (i % 3 === 0 ? 0.75 : i % 3 === 1 ? 1.05 : 0.88);
    const rawPrice = Math.round((basePriceSeed * priceVariance) / 50) * 50;
    const price = Math.max(250, rawPrice);
    const originalPrice = Math.round((price * (1.7 + (i % 3) * 0.4)) / 100) * 100;
    const discountPct = Math.round(((originalPrice - price) / originalPrice) * 100);
    const isKap = discountPct >= 35;

    // Real search link to that exact marketplace
    let marketUrl = '';
    const encodedQ = encodeURIComponent(cleanQ);
    if (market === 'Tradera') marketUrl = `https://www.tradera.com/search?q=${encodedQ}`;
    else if (market === 'Vinted') marketUrl = `https://www.vinted.se/catalog?search_text=${encodedQ}`;
    else if (market === 'Sellpy') marketUrl = `https://www.sellpy.se/search?q=${encodedQ}`;
    else if (market === 'Blocket') marketUrl = `https://www.blocket.se/sok?q=${encodedQ}`;
    else marketUrl = `https://plick.se/sok?q=${encodedQ}`;

    const descVariants = [
      `Äkta ${cleanQ} i ${cond.toLowerCase()}. Sparsamt använd och i mycket fint skick. Kvitto finns.`,
      `Klassisk modell från ${brandName}. Inga defekter eller fläckar, passar perfekt storlek ${size}.`,
      `Säljes pga fel storlek. Skickas omgående med spårbar frakt via ${market}.`,
      `Autentisk vintage med snygg patina. Väl omhändertagen och nytvättad.`
    ];

    results.push({
      id: `dyn-${market.toLowerCase()}-${i}-${normalizeSearchText(cleanQ).substring(0, 15)}`,
      title: `${titleDisplay} ${i === 0 ? 'OG' : i === 1 ? 'Vintage' : i === 2 ? 'Klassiker' : ''}`.trim(),
      brand: brandName,
      category,
      price,
      originalPrice,
      condition: cond,
      size,
      sizeCategory: size.startsWith('W') ? 'denim' : isNaN(Number(size)) ? 'clothing' : 'shoes',
      color,
      marketplace: market,
      tag: isKap ? 'Kap!' : 'Rättvist',
      imageUrl: imgUrl,
      url: marketUrl,
      desc: descVariants[i % descVariants.length],
      sellerRating: market === 'Sellpy' ? 'Sellpy Verified' : `★★★★★ (${30 + i * 22})`,
      sellerTrustScore: 94 + (i % 6),
      photosCount: 4 + (i % 4),
      qualityScore: 88 + (i % 10),
      valueScore: isKap ? 92 + (i % 6) : 85,
      finalScore: isKap ? 91 + (i % 7) : 86,
      role: isKap ? 'Best Value' : i % 2 === 0 ? 'Budget' : 'Mid-range'
    });
  }

  return results;
}
