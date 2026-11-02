import { Trend } from '../types';

export interface CuratedImage {
  url: string;
  category: string;
  brands: string[];
  keywords: string[];
  productKeywords: string[];
  description: string;
}

export const CURATED_IMAGES: CuratedImage[] = [
  // footwear (Travis Scott Jordan 1)
  {
    url: "/images/jordan_1_travis_scott_1780823703311.png",
    category: "Footwear",
    brands: ["jordan", "nike"],
    keywords: ["jordan", "travis", "scott", "low", "og", "retro", "mocha", "olive"],
    productKeywords: ["travis scott", "travis", "jordan 1 retro low", "jordan 1"],
    description: "Jordan 1 Retro Low OG Travis Scott sneaker"
  },
  // Footwear (Adidas Samba)
  {
    url: "/images/adidas_samba_white_1780823940914.png",
    category: "Footwear",
    brands: ["adidas"],
    keywords: ["samba", "classic", "white", "sneaker", "shoes"],
    productKeywords: ["adidas samba", "samba"],
    description: "Classic white Adidas Samba leather sneaker with black stripes and a gum sole"
  },
  // Footwear (Asics Gel-Kayano 14)
  {
    url: "/images/asics_gel_kayano_14_1780823960870.png",
    category: "Footwear",
    brands: ["asics"],
    keywords: ["gel-kayano", "kayano", "running", "silver", "sneaker"],
    productKeywords: ["asics gel-kayano 14", "gel-kayano 14", "gel-kayano"],
    description: "Premium metallic silver Asics Gel-Kayano 14 technical running shoe"
  },
  // Footwear (Nike Dunk Low Panda)
  {
    url: "/images/nike_dunk_low_panda_1780823980808.png",
    category: "Footwear",
    brands: ["nike"],
    keywords: ["dunk", "panda", "black", "white", "sneaker"],
    productKeywords: ["nike dunk low panda", "dunk low panda", "panda"],
    description: "Classic black and white Nike Dunk Low Panda leather sneaker"
  },
  // Footwear (Rick Owens Ramones Canvas Sneaker)
  {
    url: "/images/rick_owens_ramones_1780824020198.png",
    category: "Footwear",
    brands: ["rick owens"],
    keywords: ["ramones", "canvas", "high-top", "sneaker", "drkshdw"],
    productKeywords: ["rick owens ramones canvas sneaker", "ramones canvas sneaker", "ramones"],
    description: "High-top black canvas Rick Owens Ramones designer sneakers with off-white rubber soles"
  },
  // Footwear (Maison Margiela Painted Tabi Boots)
  {
    url: "/images/margiela_tabi_boots_1780824039216.png",
    category: "Footwear",
    brands: ["maison margiela", "margiela"],
    keywords: ["tabi", "boots", "painted", "leather", "heel"],
    productKeywords: ["maison margiela painted tabi boots", "painted tabi boots", "tabi boots", "tabi"],
    description: "Iconic white painted leather Maison Margiela split-toe Tabi boots"
  },
  // Knitwear (Stüssy 8-ball Mohair Cardigan)
  {
    url: "/images/stussy_8ball_cardigan_1780824000937.png",
    category: "Knitwear",
    brands: ["stüssy", "stussy"],
    keywords: ["8-ball", "mohair", "cardigan", "knit", "stickat", "sweater"],
    productKeywords: ["stüssy 8-ball mohair cardigan", "8-ball mohair cardigan", "8-ball cardigan", "mohair cardigan"],
    description: "Premium fuzzy Stüssy mohair knit cardigan with a large iconic black and white 8-ball pattern on back"
  },
  // Knitwear (Eclectic Grandpa Cardigan)
  {
    url: "/images/eclectic_grandpa_cardigan_1780824226381.png",
    category: "Knitwear",
    brands: ["vintage"],
    keywords: ["grandpa", "eclectic", "cardigan", "knit", "patchwork"],
    productKeywords: ["eclectic grandpa cardigan", "grandpa cardigan"],
    description: "Chunky oversized eclectic grandpa mohair cardigan with geometric patchwork designs"
  },
  // Outerwear (Vintage Carhartt Detroit Jacket (J97 MOS))
  {
    url: "/images/carhartt_detroit_jacket_1780824061079.png",
    category: "Outerwear",
    brands: ["carhartt", "vintage"],
    keywords: ["detroit", "jacket", "canvas", "moss", "workwear", "j97"],
    productKeywords: ["vintage carhartt detroit jacket (j97 mos)", "carhartt detroit jacket", "detroit jacket"],
    description: "Vintage moss green heavy-duty duck canvas Carhartt Detroit Jacket with a corduroy collar"
  },
  // Outerwear (Supreme Box Logo Hooded Sweatshirt)
  {
    url: "/images/supreme_box_logo_hoodie_1780824081130.png",
    category: "Outerwear",
    brands: ["supreme"],
    keywords: ["box logo", "hooded", "sweatshirt", "hoodie", "grey"],
    productKeywords: ["supreme box logo hooded sweatshirt", "supreme box logo hoodie", "box logo hooded sweatshirt"],
    description: "Premium grey Supreme hooded sweatshirt featuring the iconic red and white embroidered box logo"
  },
  // Outerwear (Stone Island Vintage Compass Badge Knit)
  {
    url: "/images/stone_island_knit_1780824247937.png",
    category: "Outerwear",
    brands: ["stone island"],
    keywords: ["compass badge", "knit", "sweater", "ribbed", "wool"],
    productKeywords: ["stone island vintage compass badge knit", "compass badge knit", "stone island knit"],
    description: "Stone Island ribbed charcoal crewneck sweater with the yellow and green compass logo badge on sleeve"
  },
  // Outerwear (Vintage Track Jackets)
  {
    url: "/images/vintage_track_jacket_1780824162000.png",
    category: "Outerwear",
    brands: ["vintage"],
    keywords: ["track", "jacket", "sporty", "zip-up", "träningsjacka"],
    productKeywords: ["vintage track jackets", "vintage track jacket", "track jacket"],
    description: "90s athletic color-blocked retro zip-up sporty track jacket"
  },
  // Outerwear (Vintage Leopard Print Coat)
  {
    url: "/images/leopard_print_coat_1780824268081.png",
    category: "Outerwear",
    brands: ["vintage"],
    keywords: ["leopard", "coat", "fur", "faux-fur", "outerwear"],
    productKeywords: ["vintage leopard print coat", "leopard print coat", "leopard coat"],
    description: "Long glamorous vintage faux-fur leopard print winter overcoat with wide lapels"
  },
  // Accessories (Diesel 1DR Shoulder Bag)
  {
    url: "/images/diesel_1dr_bag_1780824101001.png",
    category: "Accessories",
    brands: ["diesel"],
    keywords: ["1dr", "bag", "shoulder", "silver", "handle", "handbag"],
    productKeywords: ["diesel 1dr shoulder bag", "1dr shoulder bag", "diesel 1dr", "1dr bag"],
    description: "Metallic silver luxury leather Diesel 1DR shoulder bag with signature chrome D emblem"
  },
  // Accessories (Acne Studios Scarf)
  {
    url: "/images/acne_studios_scarf_1780824135884.png",
    category: "Accessories",
    brands: ["acne studios", "acne"],
    keywords: ["scarf", "halsdukar", "plaid", "mohair", "check"],
    productKeywords: ["acne studios scarf", "acne scarf"],
    description: "Fuzzy plaid check pastel wool and mohair scarf from Acne Studios"
  },
  // Accessories (Chrome Hearts Fleur-de-lis Silver Ring)
  {
    url: "/images/chrome_hearts_ring_1780824286534.png",
    category: "Accessories",
    brands: ["chrome hearts"],
    keywords: ["ring", "silver", "gothic", "fleur-de-lis", "jewelry"],
    productKeywords: ["chrome hearts fleur-de-lis silver ring", "fleur-de-lis silver ring", "chrome hearts ring"],
    description: "Solid sterling silver Chrome Hearts ring featuring intricate carved gothic Fleur-de-lis details"
  },
  // Bottoms (Our Legacy Third Cut Jeans)
  {
    url: "/images/our_legacy_jeans_1780824184295.png",
    category: "Bottoms",
    brands: ["our legacy"],
    keywords: ["third cut", "jeans", "denim", "byxor", "faded"],
    productKeywords: ["our legacy third cut jeans", "third cut jeans", "our legacy jeans"],
    description: "Loose fit faded blue denim Our Legacy Third Cut jeans with printed Trompe l oeil texturing"
  },
  // Bottoms (Utility Cargo Pants)
  {
    url: "/images/utility_cargo_pants_1780824207053.png",
    category: "Bottoms",
    brands: ["vintage"],
    keywords: ["cargo", "pants", "byxor", "military", "tactical"],
    productKeywords: ["utility cargo pants", "cargo pants"],
    description: "Tactical dark olive-green military multi-pocket utility cargo pants"
  },
  // footwear (classic sneakers)
  {
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    category: "Footwear",
    brands: ["nike", "jordan", "adidas", "asics", "puma", "reebok"],
    keywords: ["sneakers", "shoes", "footwear", "run", "samba", "dunk", "sport"],
    productKeywords: ["samba", "panda", "retro", "gel-kayano", "dunk", "low", "classic"],
    description: "Classic sports sneakers including Nike Dunks and Adidas Samba"
  },
  // footwear (designer & boots)
  {
    url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
    category: "Footwear",
    brands: ["rick owens", "maison margiela", "margiela", "balenciaga"],
    keywords: ["shoes", "footwear", "boots", "designer", "tabi", "ramones"],
    productKeywords: ["ramones", "tabi", "sneaker", "boots", "designer", "high"],
    description: "Avant-garde designer footwear and high-top sneakers"
  },
  // outerwear (rugged canvas utility/workwear)
  {
    url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    category: "Outerwear",
    brands: ["carhartt", "vintage", "stone island", "levis", "dickies"],
    keywords: ["jacket", "outerwear", "coat", "canvas", "detroit"],
    productKeywords: ["detroit", "j97", "mos", "workwear", "canvas", "vintage"],
    description: "Rugged heavy vintage canvas workwear jackets"
  },
  // outerwear (technical windbreaker/waterproof shell)
  {
    url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80",
    category: "Outerwear",
    brands: ["arc'teryx", "arcteryx", "salomon", "patagonia", "the north face"],
    keywords: ["jacket", "outerwear", "shell", "rain", "gore-tex", "gortex", "windbreaker"],
    productKeywords: ["shell", "beta", "alpha", "theta", "jacket", "waterproof", "technical"],
    description: "Premium techwear active GORE-TEX waterproof shell jackets"
  },
  // outerwear (blazer and tailoring)
  {
    url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    category: "Outerwear",
    brands: ["arket", "totême", "toteme", "cos"],
    keywords: ["blazer", "suit", "jacket", "kavajer", "formal", "tailoring"],
    productKeywords: ["kavajer", "blazer", "basplagg", "suit", "kavaj"],
    description: "Structured wool blazer or classic tailoring blazer"
  },
  // outerwear (overcoats and long coats)
  {
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    category: "Outerwear",
    brands: ["totême", "toteme", "arket", "acne", "acne studios"],
    keywords: ["coat", "outerwear", "jacket", "wool", "long"],
    productKeywords: ["coats", "wool", "coat", "jackor", "trench"],
    description: "Elegant wool double-breasted long winter coat"
  },
  // outerwear (sporty track jackets)
  {
    url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
    category: "Outerwear",
    brands: ["adidas", "nike", "vintage", "puma"],
    keywords: ["jacket", "outerwear", "track", "sportswear", "zip-up"],
    productKeywords: ["track", "vintage track", "sportswear", "tracksuit", "träningsjacka"],
    description: "Retro zip-up athletic track jacket"
  },
  // knitwear
  {
    url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80",
    category: "Knitwear",
    brands: ["stüssy", "stussy", "stone island", "acne studios", "acne", "our legacy"],
    keywords: ["knitwear", "sweater", "cardigan", "mohair", "wool", "stickat"],
    productKeywords: ["mohair", "badge", "knit", "8-ball", "cardigan", "sweaters", "stickat", "tröja"],
    description: "High quality heavy mohair or wool knitted cardigan and crewneck sweater"
  },
  // accessories (heavy scarf/beanies)
  {
    url: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=600&q=80",
    category: "Accessories",
    brands: ["acne studios", "acne", "totême", "toteme", "ganni"],
    keywords: ["scarf", "accessories", "beanie", "halsdukar", "knitted"],
    productKeywords: ["scarf", "halsdukar", "beanie", "halsduk", "ullhalsduk"],
    description: "Thick woven plaid mohair check winter scarf"
  },
  // bottoms (jeans and heavy legwear)
  {
    url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    category: "Bottoms",
    brands: ["our legacy", "carhartt", "levis", "acne studios", "acne"],
    keywords: ["jeans", "bottoms", "pants", "cargo", "denim", "byxor"],
    productKeywords: ["third cut", "cargo", "jeans", "pants", "denim", "byxor"],
    description: "Loose fit high-fashion denim jeans and vintage cargo pants"
  },
  // bottoms (klänningar, skirts & feminine structures)
  {
    url: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=600&q=80",
    category: "Bottoms",
    brands: ["ganni", "totême", "toteme"],
    keywords: ["dress", "klänningar", "skirt", "bottoms", "kjol"],
    productKeywords: ["klänningar", "dress", "boots", "kjol", "ganni klänning"],
    description: "Elegant flowing print dresses and fashion skirts"
  },
  // accessories (jewelry and rings)
  {
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    category: "Accessories",
    brands: ["chrome hearts", "maison margiela", "margiela"],
    keywords: ["ring", "accessories", "jewelry", "silver", "smycken"],
    productKeywords: ["ring", "fleur-de-lis", "silver", "rings", "halsband"],
    description: "Solid sterling silver vintage gothic rings and classic fine jewelry"
  },
  // accessories (designer bags)
  {
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    category: "Accessories",
    brands: ["diesel", "acne studios", "acne", "totême", "toteme", "ganni"],
    keywords: ["bag", "accessories", "purse", "shoulder", "handbag", "väskor"],
    productKeywords: ["1dr", "shoulder bag", "bag", "handbag", "väska", "axelsväska"],
    description: "Chic luxury designer leather shoulder bags"
  }
];

/**
 * Evaluates whether an image url is compatible with the given trend parameters.
 * Automatically checks and rejects image clashes across categories and major brands.
 */
export function validateImageConsistency(
  trendName: string,
  category: string,
  imageUrl: string | undefined
): { isValid: boolean; confidence: number; reason?: string } {
  if (!imageUrl) {
    return { isValid: false, confidence: 0, reason: "No image URL supplied" };
  }

  const normTitle = trendName.toLowerCase();
  const normCategory = (category || "").trim().toLowerCase();

  // Find curated definition
  const curated = CURATED_IMAGES.find(img => img.url === imageUrl);
  if (curated) {
    const curatedCategory = curated.category.toLowerCase();
    
    // 1. Strict Category Rule Check
    if (curatedCategory !== normCategory) {
      return {
        isValid: false,
        confidence: 0,
        reason: `Category clash: Image is calibrated for '${curated.category}' but trend targets '${category}'.`
      };
    }

    // 2. Strict Brand Rule Check:
    // If image has explicit brands, and the trend features a competitor brand, it's a mismatch
    const isCompetitorActive = ["nike", "jordan", "adidas", "asics", "rick owens", "margiela", "stussy", "stüssy", "carhartt", "arcteryx", "arc'teryx", "stone island", "acne", "toteme", "totême", "arket", "ganni", "diesel", "chrome hearts"]
      .filter(brand => !curated.brands.includes(brand))
      .some(competitor => normTitle.includes(competitor));

    const doesMatchCuratedBrand = curated.brands.some(b => normTitle.includes(b));

    if (curated.brands.length > 0 && !doesMatchCuratedBrand && isCompetitorActive) {
      return {
        isValid: false,
        confidence: 0,
        reason: `Brand clash: Image is calibrated for [${curated.brands.join(', ')}] but trend contains a different major brand.`
      };
    }

    // Determine fine confidence alignment level
    const matchProduct = curated.productKeywords.some(keyword => normTitle.includes(keyword));
    const matchBrand = curated.brands.some(brand => normTitle.includes(brand));

    if (matchProduct && matchBrand) {
      return { isValid: true, confidence: 100 };
    }
    if (matchBrand) {
      return { isValid: true, confidence: 80 };
    }
    return { isValid: true, confidence: 60 };
  }

  // To secure strict integrity, completely reject any unverified/random web images
  return {
    isValid: false,
    confidence: 0,
    reason: "Restricting to high-integrity pre-verified and curated fashion collections."
  };
}

/**
 * Selects or falls back to a highly accurate representation for a trend.
 * Image priority logic: Exact product (100) -> Brand + category (80) -> Category (60).
 */
export function getValidTrendImage(
  trendName: string,
  category: string,
  currentImageUrl?: string
): { image_url: string | undefined; image_confidence_score: number } {
  const normTitle = trendName.toLowerCase();
  const normCategory = (category || "").trim().toLowerCase();

  // 1. First test if the existing image is consistent
  if (currentImageUrl) {
    const validation = validateImageConsistency(trendName, category, currentImageUrl);
    if (validation.isValid && validation.confidence >= 60) {
      return { image_url: currentImageUrl, image_confidence_score: validation.confidence };
    }
  }

  // 2. Attempt: Priority 1 - Exact Product Match (100% confidence)
  for (const img of CURATED_IMAGES) {
    if (img.category.toLowerCase() === normCategory) {
      const matchProduct = img.productKeywords.some(keyword => normTitle.includes(keyword));
      const matchBrand = img.brands.some(brand => normTitle.includes(brand));
      if (matchProduct && matchBrand) {
        return { image_url: img.url, image_confidence_score: 100 };
      }
    }
  }

  // 3. Attempt: Priority 2 - Brand + Category Match (80% confidence)
  for (const img of CURATED_IMAGES) {
    if (img.category.toLowerCase() === normCategory) {
      const matchBrand = img.brands.some(brand => normTitle.includes(brand));
      if (matchBrand) {
        return { image_url: img.url, image_confidence_score: 80 };
      }
    }
  }

  // 4. Attempt: Priority 3 - Category Match (60% confidence)
  const categoryMatch = CURATED_IMAGES.find(img => img.category.toLowerCase() === normCategory);
  if (categoryMatch) {
    return { image_url: categoryMatch.url, image_confidence_score: 60 };
  }

  // 5. Hard boundary: do not fabricate any images if confidence matches 0
  return { image_url: undefined, image_confidence_score: 0 };
}
