import { SearchListing, SearchFilterState, SearchFacets } from '../types';
import { EXTENDED_CURATED_LISTINGS } from './curatedListings';
import { 
  scoreListingRelevance, 
  matchesFacets, 
  generateDynamicListingsForQuery, 
  detectSmartCorrection, 
  normalizeSearchText 
} from '../lib/searchEngine';

export { detectSmartCorrection, normalizeSearchText };

export const COLOR_CONFIG: Record<string, { hex: string; labelSv: string; labelEn: string }> = {
  'Svart': { hex: '#121212', labelSv: 'Svart', labelEn: 'Black' },
  'Vit': { hex: '#F9FAFB', labelSv: 'Vit', labelEn: 'White' },
  'Grå': { hex: '#6B7280', labelSv: 'Grå', labelEn: 'Grey' },
  'Beige': { hex: '#D7C4B7', labelSv: 'Beige', labelEn: 'Beige' },
  'Blå': { hex: '#2563EB', labelSv: 'Blå', labelEn: 'Blue' },
  'Marinblå': { hex: '#1E293B', labelSv: 'Marinblå', labelEn: 'Navy' },
  'Grön': { hex: '#10B981', labelSv: 'Grön', labelEn: 'Green' },
  'Brun': { hex: '#78350F', labelSv: 'Brun', labelEn: 'Brown' },
  'Röd': { hex: '#EF4444', labelSv: 'Röd', labelEn: 'Red' },
  'Rosa': { hex: '#EC4899', labelSv: 'Rosa', labelEn: 'Pink' },
  'Gul': { hex: '#EAB308', labelSv: 'Gul', labelEn: 'Yellow' },
  'Flerfärgad': { hex: 'linear-gradient(135deg, #f43f5e 0%, #3b82f6 50%, #10b981 100%)', labelSv: 'Flerfärgad', labelEn: 'Multicolor' },
};

export const SIZE_CATEGORIES = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  denim: ['W28', 'W29', 'W30', 'W31', 'W32', 'W34', 'W36'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  onesize: ['One Size']
};

export const POPULAR_BRANDS = [
  'Acne Studios',
  'Adidas',
  "Arc'teryx",
  'Asics',
  'Carhartt',
  'Comme des Garçons',
  'Diesel',
  'Ganni',
  "Levi's",
  'Maison Margiela',
  'New Balance',
  'Nike',
  'Our Legacy',
  'Patagonia',
  'Prada',
  'Ralph Lauren',
  'Salomon',
  'Stone Island',
  'Stüssy',
  'Totême'
];

export const BASE_LISTINGS: SearchListing[] = [
  // Acne Studios
  {
    id: 'acne-musubi-midi',
    title: 'Acne Studios Musubi Midi Leather Shoulder Bag',
    brand: 'Acne Studios',
    category: 'vaskor',
    price: 4900,
    originalPrice: 11500,
    condition: 'Nyskick',
    size: 'One Size',
    sizeCategory: 'onesize',
    color: 'Svart',
    colorHex: '#121212',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: '/src/assets/images/product_acne_musubi_black_1792668380821.jpg',
    url: 'https://www.tradera.com/search?q=acne+studios+musubi',
    desc: 'Äkta Musubi Midi i slätt svart kalvskinn med knutdetalj. Dammpåse och äkthetsintyg medföljer.',
    sellerRating: '★★★★★ (142)',
    sellerTrustScore: 98,
    photosCount: 6,
    qualityScore: 95,
    valueScore: 92,
    finalScore: 94,
    role: 'Best Value'
  },
  {
    id: 'acne-ferris-hoodie',
    title: 'Acne Studios Ferris Face Oversized Hoodie',
    brand: 'Acne Studios',
    category: 'stickat',
    price: 1350,
    originalPrice: 3200,
    condition: 'Mycket bra skick',
    size: 'M',
    sizeCategory: 'clothing',
    color: 'Grå',
    colorHex: '#6B7280',
    marketplace: 'Plick',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop',
    url: 'https://plick.se/sok?q=acne+face+hoodie',
    desc: 'Klassisk face-patch hoodie i melerad grå ekologisk bomull. Sparsamt buren.',
    sellerRating: '★★★★★ (38)',
    sellerTrustScore: 94,
    photosCount: 4,
    qualityScore: 88,
    valueScore: 90,
    finalScore: 89,
    role: 'Budget'
  },
  {
    id: 'acne-1996-denim',
    title: 'Acne Studios 1996 Trash Straight Denim',
    brand: 'Acne Studios',
    category: 'jeans',
    price: 1450,
    originalPrice: 2900,
    condition: 'Bra skick',
    size: 'W31',
    sizeCategory: 'denim',
    color: 'Blå',
    colorHex: '#2563EB',
    marketplace: 'Vinted',
    tag: 'Rättvist',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop',
    url: 'https://www.vinted.se/catalog?search_text=acne+1996+jeans',
    desc: 'Rak passform, klassisk 90-tals siluett med vintage trash-tvätt. Lätt naturligt slitage.',
    sellerRating: '★★★★☆ (19)',
    sellerTrustScore: 87,
    photosCount: 5,
    qualityScore: 84,
    valueScore: 81,
    finalScore: 82,
    role: 'Mid-range'
  },

  // Ganni
  {
    id: 'ganni-wool-knit',
    title: 'Ganni Heavy Wool Cable-Knit Jumper',
    brand: 'Ganni',
    category: 'stickat',
    price: 1250,
    originalPrice: 3200,
    condition: 'Mycket bra skick',
    size: 'S',
    sizeCategory: 'clothing',
    color: 'Beige',
    colorHex: '#D7C4B7',
    marketplace: 'Vinted',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop',
    url: 'https://www.vinted.se/catalog?search_text=ganni+knit',
    desc: 'Mjuk och varm ullblandning i havremelerad färg. Perfekt skick utan noppor.',
    sellerRating: '★★★★★ (64)',
    sellerTrustScore: 96,
    photosCount: 5,
    qualityScore: 91,
    valueScore: 93,
    finalScore: 92,
    role: 'Best Value'
  },
  {
    id: 'ganni-seersucker-dress',
    title: 'Ganni Seersucker Checked Maxi Dress',
    brand: 'Ganni',
    category: 'klanning',
    price: 980,
    originalPrice: 2600,
    condition: 'Nyskick',
    size: '38',
    sizeCategory: 'clothing',
    color: 'Grön',
    colorHex: '#10B981',
    marketplace: 'Sellpy',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop',
    url: 'https://www.sellpy.se/search?q=ganni+seersucker',
    desc: 'Signaturmodell med puffärm och smock. Kontrollerad och hygienpackad av Sellpy.',
    sellerRating: 'Sellpy Verified',
    sellerTrustScore: 99,
    photosCount: 6,
    qualityScore: 94,
    valueScore: 89,
    finalScore: 91,
    role: 'Budget'
  },
  {
    id: 'ganni-bou-bag',
    title: 'Ganni Bou Bag Recycled Leather',
    brand: 'Ganni',
    category: 'vaskor',
    price: 1850,
    originalPrice: 3900,
    condition: 'Nyskick',
    size: 'One Size',
    sizeCategory: 'onesize',
    color: 'Rosa',
    colorHex: '#EC4899',
    marketplace: 'Plick',
    tag: 'Rättvist',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop',
    url: 'https://plick.se/sok?q=ganni+bou+bag',
    desc: 'Hexagonal form i mjukt veganskt återvunnet läder. Flätat handtag i nyskick.',
    sellerRating: '★★★★★ (21)',
    sellerTrustScore: 95,
    photosCount: 4,
    qualityScore: 92,
    valueScore: 84,
    finalScore: 88,
    role: 'Mid-range'
  },

  // Levi's
  {
    id: 'levis-501-vintage-wash',
    title: 'Vintage Levi’s 501 Straight Leg Denim',
    brand: "Levi's",
    category: 'jeans',
    price: 450,
    originalPrice: 1200,
    condition: 'Vintageskick',
    size: 'W30',
    sizeCategory: 'denim',
    color: 'Blå',
    colorHex: '#2563EB',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=vintage+levis+501',
    desc: 'Autentiska 90-tals 501or tillverkade i USA. Perfekt naturlig fade och slitning.',
    sellerRating: '★★★★★ (215)',
    sellerTrustScore: 97,
    photosCount: 7,
    qualityScore: 88,
    valueScore: 96,
    finalScore: 92,
    role: 'Best Value'
  },
  {
    id: 'levis-ribcage-black',
    title: 'Levi’s Ribcage Straight Ankle Black',
    brand: "Levi's",
    category: 'jeans',
    price: 390,
    originalPrice: 1300,
    condition: 'Mycket bra skick',
    size: 'W28',
    sizeCategory: 'denim',
    color: 'Svart',
    colorHex: '#121212',
    marketplace: 'Vinted',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&auto=format&fit=crop',
    url: 'https://www.vinted.se/catalog?search_text=levis+ribcage+svart',
    desc: 'Ultrahög midja med rak passform. Sparsamt använda, djup svart färg bibehållen.',
    sellerRating: '★★★★★ (45)',
    sellerTrustScore: 93,
    photosCount: 4,
    qualityScore: 86,
    valueScore: 94,
    finalScore: 90,
    role: 'Budget'
  },

  // Our Legacy
  {
    id: 'ourlegacy-camion-boots',
    title: 'Our Legacy Camion Boots Black Leather',
    brand: 'Our Legacy',
    category: 'sneakers',
    price: 3400,
    originalPrice: 5800,
    condition: 'Mycket bra skick',
    size: '42',
    sizeCategory: 'shoes',
    color: 'Svart',
    colorHex: '#121212',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=our+legacy+camion+boots',
    desc: 'Ikoniska Camion Boots i italienskt kalvskinn med Vibram-sula. Lätt veckning i skinnet.',
    sellerRating: '★★★★★ (89)',
    sellerTrustScore: 99,
    photosCount: 6,
    qualityScore: 93,
    valueScore: 89,
    finalScore: 91,
    role: 'Premium'
  },
  {
    id: 'ourlegacy-third-cut',
    title: 'Our Legacy Third Cut Digital Denim Trompe L’oeil',
    brand: 'Our Legacy',
    category: 'jeans',
    price: 2600,
    originalPrice: 4200,
    condition: 'Nyskick',
    size: 'W32',
    sizeCategory: 'denim',
    color: 'Blå',
    colorHex: '#2563EB',
    marketplace: 'Plick',
    tag: 'Rättvist',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop',
    url: 'https://plick.se/sok?q=our+legacy+third+cut',
    desc: 'Digitalt printat vintage-mönster på råbomull. Endast provade inomhus.',
    sellerRating: '★★★★★ (14)',
    sellerTrustScore: 96,
    photosCount: 5,
    qualityScore: 97,
    valueScore: 84,
    finalScore: 90,
    role: 'Premium'
  },

  // Arc'teryx
  {
    id: 'arcteryx-beta-lt',
    title: "Arc'teryx Beta LT Jacket Gore-Tex Pro",
    brand: "Arc'teryx",
    category: 'jackor',
    price: 3600,
    originalPrice: 5500,
    condition: 'Mycket bra skick',
    size: 'L',
    sizeCategory: 'clothing',
    color: 'Svart',
    colorHex: '#121212',
    marketplace: 'Blocket',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop',
    url: 'https://www.blocket.se/sok?q=arcteryx+beta+lt',
    desc: 'Hel och ren skaljacka i Gore-Tex 3L. Samtliga tejptätningar intakta och impregnerad nyligen.',
    sellerRating: 'Verifierad säljare',
    sellerTrustScore: 96,
    photosCount: 8,
    qualityScore: 92,
    valueScore: 90,
    finalScore: 91,
    role: 'Best Value'
  },
  {
    id: 'arcteryx-atom-hoody',
    title: "Arc'teryx Atom LT Hoody Lightweight Insulated",
    brand: "Arc'teryx",
    category: 'jackor',
    price: 1800,
    originalPrice: 3200,
    condition: 'Bra skick',
    size: 'M',
    sizeCategory: 'clothing',
    color: 'Marinblå',
    colorHex: '#1E293B',
    marketplace: 'Tradera',
    tag: 'Rättvist',
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=arcteryx+atom+lt',
    desc: 'Coreloft-fodrad mellanlagersjacka. Litet märke på vänster ärm, fullt funktionell.',
    sellerRating: '★★★★★ (102)',
    sellerTrustScore: 95,
    photosCount: 5,
    qualityScore: 82,
    valueScore: 84,
    finalScore: 83,
    role: 'Mid-range'
  },

  // Totême
  {
    id: 'toteme-striped-knit',
    title: 'Totême Signature Striped Wool & Cotton Knit',
    brand: 'Totême',
    category: 'stickat',
    price: 2400,
    originalPrice: 5200,
    condition: 'Nyskick',
    size: 'M',
    sizeCategory: 'clothing',
    color: 'Flerfärgad',
    colorHex: 'linear-gradient(135deg, #121212 50%, #F9FAFB 50%)',
    marketplace: 'Plick',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop',
    url: 'https://plick.se/sok?q=toteme+striped+knit',
    desc: 'Oversized randig tröja med slitsar i sidan och vid polo. Lyxig tung kvalitet.',
    sellerRating: '★★★★★ (28)',
    sellerTrustScore: 97,
    photosCount: 5,
    qualityScore: 96,
    valueScore: 91,
    finalScore: 93,
    role: 'Premium'
  },
  {
    id: 'toteme-t-lock-bag',
    title: 'Totême T-Lock Clutch & Crossbody Bag',
    brand: 'Totême',
    category: 'vaskor',
    price: 5200,
    originalPrice: 9800,
    condition: 'Mycket bra skick',
    size: 'One Size',
    sizeCategory: 'onesize',
    color: 'Brun',
    colorHex: '#78350F',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=toteme+t+lock',
    desc: 'Strukturerat kornigt läder med guldfärgat T-lås. Mycket gott skick med kvitto från NK.',
    sellerRating: '★★★★★ (51)',
    sellerTrustScore: 98,
    photosCount: 7,
    qualityScore: 95,
    valueScore: 89,
    finalScore: 92,
    role: 'Premium'
  },

  // Adidas
  {
    id: 'adidas-samba-og',
    title: 'Adidas Originals Samba OG White Black Gum',
    brand: 'Adidas',
    category: 'sneakers',
    price: 680,
    originalPrice: 1400,
    condition: 'Mycket bra skick',
    size: '39',
    sizeCategory: 'shoes',
    color: 'Vit',
    colorHex: '#F9FAFB',
    marketplace: 'Plick',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop',
    url: 'https://plick.se/sok?q=adidas+samba+og',
    desc: 'Klassiska Samba i läder med mockadetaljer på tån. Sparsamt använda under sommaren.',
    sellerRating: '★★★★★ (17)',
    sellerTrustScore: 92,
    photosCount: 5,
    qualityScore: 88,
    valueScore: 93,
    finalScore: 91,
    role: 'Budget'
  },
  {
    id: 'adidas-gazelle-indoor',
    title: 'Adidas Gazelle Indoor Blue Fusion Gum',
    brand: 'Adidas',
    category: 'sneakers',
    price: 790,
    originalPrice: 1500,
    condition: 'Nyskick',
    size: '41',
    sizeCategory: 'shoes',
    color: 'Blå',
    colorHex: '#2563EB',
    marketplace: 'Vinted',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop',
    url: 'https://www.vinted.se/catalog?search_text=adidas+gazelle+indoor',
    desc: 'Helt nya i originalkartong. Köpta på Sneakersnstuff, säljes pga fel storlek.',
    sellerRating: '★★★★★ (33)',
    sellerTrustScore: 96,
    photosCount: 6,
    qualityScore: 96,
    valueScore: 90,
    finalScore: 93,
    role: 'Best Value'
  },

  // Stüssy
  {
    id: 'stussy-mohair-cardigan',
    title: 'Stüssy Shaggy Mohair Blend Cardigan Plaid',
    brand: 'Stüssy',
    category: 'stickat',
    price: 1850,
    originalPrice: 2800,
    condition: 'Nyskick',
    size: 'L',
    sizeCategory: 'clothing',
    color: 'Grön',
    colorHex: '#10B981',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=stussy+mohair+cardigan',
    desc: 'Slutsåld mohairkofta med hornknappar. Endast använd vid fotografering.',
    sellerRating: '★★★★★ (73)',
    sellerTrustScore: 98,
    photosCount: 5,
    qualityScore: 96,
    valueScore: 88,
    finalScore: 92,
    role: 'Best Value'
  },
  {
    id: 'stussy-basic-tee',
    title: 'Stüssy Basic Stock Logo Heavyweight T-Shirt',
    brand: 'Stüssy',
    category: 't-shirt',
    price: 320,
    originalPrice: 650,
    condition: 'Bra skick',
    size: 'XL',
    sizeCategory: 'clothing',
    color: 'Vit',
    colorHex: '#F9FAFB',
    marketplace: 'Sellpy',
    tag: 'Rättvist',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop',
    url: 'https://www.sellpy.se/search?q=stussy+t-shirt',
    desc: 'Klassisk screentryckt logo på bröst och rygg. Ingen blekning eller sprickor.',
    sellerRating: 'Sellpy Verified',
    sellerTrustScore: 99,
    photosCount: 4,
    qualityScore: 82,
    valueScore: 85,
    finalScore: 84,
    role: 'Budget'
  },

  // Carhartt
  {
    id: 'carhartt-detroit-jacket',
    title: 'Vintage Carhartt J97 Detroit Workwear Jacket',
    brand: 'Carhartt',
    category: 'jackor',
    price: 2200,
    originalPrice: 3200,
    condition: 'Vintageskick',
    size: 'L',
    sizeCategory: 'clothing',
    color: 'Brun',
    colorHex: '#78350F',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=carhartt+detroit+jacket',
    desc: 'Original tillverkad i USA med filtad ullfoder och manchesterkrage. Riktigt snygg patina.',
    sellerRating: '★★★★★ (180)',
    sellerTrustScore: 98,
    photosCount: 7,
    qualityScore: 92,
    valueScore: 91,
    finalScore: 91,
    role: 'Best Value'
  },

  // Stone Island
  {
    id: 'stoneisland-soft-shell',
    title: 'Stone Island Soft Shell-R Jacket Black Badge',
    brand: 'Stone Island',
    category: 'jackor',
    price: 3200,
    originalPrice: 6800,
    condition: 'Mycket bra skick',
    size: 'M',
    sizeCategory: 'clothing',
    color: 'Svart',
    colorHex: '#121212',
    marketplace: 'Blocket',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop',
    url: 'https://www.blocket.se/sok?q=stone+island+soft+shell',
    desc: 'Certilogo verifierad äkta. Vattentät soft shell med fleeceinsida. Kompassmärke i nyskick.',
    sellerRating: 'Verifierad säljare',
    sellerTrustScore: 97,
    photosCount: 6,
    qualityScore: 94,
    valueScore: 92,
    finalScore: 93,
    role: 'Premium'
  },

  // Diesel
  {
    id: 'diesel-1dr-bag',
    title: 'Diesel 1DR Metallic Mirror Shoulder Bag',
    brand: 'Diesel',
    category: 'vaskor',
    price: 2100,
    originalPrice: 4800,
    condition: 'Mycket bra skick',
    size: 'One Size',
    sizeCategory: 'onesize',
    color: 'Flerfärgad',
    colorHex: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    marketplace: 'Plick',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&auto=format&fit=crop',
    url: 'https://plick.se/sok?q=diesel+1dr+bag',
    desc: 'Ikoniskt ovalt D-spänne med metallisk yta. Mycket sparsamt buren med originalkartong.',
    sellerRating: '★★★★★ (19)',
    sellerTrustScore: 94,
    photosCount: 5,
    qualityScore: 92,
    valueScore: 91,
    finalScore: 91,
    role: 'Best Value'
  },

  // Maison Margiela
  {
    id: 'margiela-tabi-boots',
    title: 'Maison Margiela Tabi Ankle Boots Soft Leather',
    brand: 'Maison Margiela',
    category: 'sneakers',
    price: 5800,
    originalPrice: 11200,
    condition: 'Mycket bra skick',
    size: '38',
    sizeCategory: 'shoes',
    color: 'Svart',
    colorHex: '#121212',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=maison+margiela+tabi',
    desc: 'Klassiska split-toe Tabi i smidigt lammskinn med rund klack. Sulsatta hos skomakare.',
    sellerRating: '★★★★★ (46)',
    sellerTrustScore: 99,
    photosCount: 8,
    qualityScore: 95,
    valueScore: 89,
    finalScore: 92,
    role: 'Premium'
  },

  // Prada
  {
    id: 'prada-re-nylon-pouch',
    title: 'Prada Re-Nylon Triangle Logo Shoulder Bag',
    brand: 'Prada',
    category: 'vaskor',
    price: 4900,
    originalPrice: 12500,
    condition: 'Bra skick',
    size: 'One Size',
    sizeCategory: 'onesize',
    color: 'Svart',
    colorHex: '#121212',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=prada+re-nylon',
    desc: 'Äkta nylonväska med emaljerad triangelogotyp och Saffiano-läderdetaljer.',
    sellerRating: '★★★★★ (112)',
    sellerTrustScore: 97,
    photosCount: 6,
    qualityScore: 90,
    valueScore: 92,
    finalScore: 91,
    role: 'Premium'
  },

  // Asics
  {
    id: 'asics-gel-kayano-14',
    title: 'Asics Gel-Kayano 14 Metallic Plum Cream',
    brand: 'Asics',
    category: 'sneakers',
    price: 1350,
    originalPrice: 1900,
    condition: 'Nyskick',
    size: '43',
    sizeCategory: 'shoes',
    color: 'Vit',
    colorHex: '#F9FAFB',
    marketplace: 'Plick',
    tag: 'Rättvist',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop',
    url: 'https://plick.se/sok?q=asics+gel+kayano+14',
    desc: 'Eftertraktad färgställning med metalliska overlays. Helt oanvända med tags kvar.',
    sellerRating: '★★★★★ (26)',
    sellerTrustScore: 95,
    photosCount: 5,
    qualityScore: 98,
    valueScore: 84,
    finalScore: 91,
    role: 'Mid-range'
  },

  // New Balance
  {
    id: 'newbalance-1906r',
    title: 'New Balance 1906R Protection Pack Castlerock',
    brand: 'New Balance',
    category: 'sneakers',
    price: 1100,
    originalPrice: 2100,
    condition: 'Mycket bra skick',
    size: '44',
    sizeCategory: 'shoes',
    color: 'Grå',
    colorHex: '#6B7280',
    marketplace: 'Tradera',
    tag: 'Kap!',
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop',
    url: 'https://www.tradera.com/search?q=new+balance+1906r',
    desc: 'Råskurna paneler och bekväm N-ergy dämpning. Använda ett fåtal gånger i fint väder.',
    sellerRating: '★★★★★ (88)',
    sellerTrustScore: 96,
    photosCount: 6,
    qualityScore: 90,
    valueScore: 92,
    finalScore: 91,
    role: 'Best Value'
  }
];

export const INITIAL_LISTINGS: SearchListing[] = [
  ...BASE_LISTINGS,
  ...EXTENDED_CURATED_LISTINGS
];

export const INITIAL_FILTER_STATE: SearchFilterState = {
  brands: [],
  sizes: [],
  colors: [],
  conditions: [],
  minPrice: null,
  maxPrice: null,
  marketplaces: [],
  tags: []
};

/**
 * Filter and rank listings against query and facets using the intelligent relevance engine.
 */
export function filterListings(
  items: SearchListing[],
  query: string,
  filters: SearchFilterState,
  sortBy: 'relevance' | 'lowestPrice' | 'highestPrice' | 'newest' | 'dealScore' = 'relevance'
): SearchListing[] {
  const cleanQ = query.trim();

  // Combine static items with any dynamic listings if needed
  let pool = [...items];

  // If query is provided, score and match items
  type ScoredItem = { item: SearchListing; score: number };
  let scoredItems: ScoredItem[] = [];

  if (cleanQ) {
    for (const item of pool) {
      const { score, isMatch } = scoreListingRelevance(item, cleanQ);
      if (isMatch && matchesFacets(item, filters)) {
        scoredItems.push({ item, score });
      }
    }

    // If query has few results (< 4) in the static catalog, synthesize authentic matching listings
    if (scoredItems.length < 4) {
      const dynamicListings = generateDynamicListingsForQuery(cleanQ, 6 - scoredItems.length);
      for (const dItem of dynamicListings) {
        if (matchesFacets(dItem, filters)) {
          const { score } = scoreListingRelevance(dItem, cleanQ);
          scoredItems.push({ item: dItem, score: Math.max(score, 75) });
        }
      }
    }
  } else {
    // No text query: apply facets to all items
    for (const item of pool) {
      if (matchesFacets(item, filters)) {
        scoredItems.push({ item, score: item.finalScore ?? 80 });
      }
    }
  }

  // Sort results
  scoredItems.sort((a, b) => {
    if (sortBy === 'lowestPrice') {
      return a.item.price - b.item.price;
    }
    if (sortBy === 'highestPrice') {
      return b.item.price - a.item.price;
    }
    if (sortBy === 'dealScore') {
      return (b.item.finalScore ?? 80) - (a.item.finalScore ?? 80);
    }
    if (sortBy === 'newest') {
      const conditionWeight = (c: string) => {
        if (c.includes('Nyskick')) return 4;
        if (c.includes('Mycket bra')) return 3;
        if (c.includes('Bra')) return 2;
        return 1;
      };
      return conditionWeight(b.item.condition) - conditionWeight(a.item.condition);
    }

    // Default: relevance (higher relevance score, then deal tag bonus, then final deal score)
    const scoreDiff = b.score - a.score;
    if (Math.abs(scoreDiff) > 5) {
      return scoreDiff;
    }
    const tagWeight = (t: string) => t === 'Kap!' ? 3 : t === 'Rättvist' ? 2 : 1;
    const diffTag = tagWeight(b.item.tag) - tagWeight(a.item.tag);
    if (diffTag !== 0) return diffTag;
    return (b.item.finalScore ?? 80) - (a.item.finalScore ?? 80);
  });

  return scoredItems.map(si => si.item);
}

/**
 * Compute facet counts for brands, sizes, colors, conditions, and marketplaces
 */
export function computeFacets(items: SearchListing[]): SearchFacets {
  const brandMap = new Map<string, number>();
  const sizeMap = new Map<string, { count: number; category: string }>();
  const colorMap = new Map<string, number>();
  const conditionMap = new Map<string, number>();
  const marketplaceMap = new Map<string, number>();
  const tagMap = new Map<string, number>();

  let minP = Infinity;
  let maxP = -Infinity;

  items.forEach(item => {
    // Brands
    brandMap.set(item.brand, (brandMap.get(item.brand) || 0) + 1);

    // Sizes
    const currentSize = sizeMap.get(item.size) || { count: 0, category: item.sizeCategory };
    currentSize.count += 1;
    sizeMap.set(item.size, currentSize);

    // Colors
    colorMap.set(item.color, (colorMap.get(item.color) || 0) + 1);

    // Conditions
    conditionMap.set(item.condition, (conditionMap.get(item.condition) || 0) + 1);

    // Marketplaces
    marketplaceMap.set(item.marketplace, (marketplaceMap.get(item.marketplace) || 0) + 1);

    // Tags
    tagMap.set(item.tag, (tagMap.get(item.tag) || 0) + 1);

    // Price
    if (item.price < minP) minP = item.price;
    if (item.price > maxP) maxP = item.price;
  });

  const brands = Array.from(brandMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const sizes = Array.from(sizeMap.entries())
    .map(([size, data]) => ({ size, count: data.count, category: data.category }))
    .sort((a, b) => b.count - a.count);

  const colors = Array.from(colorMap.entries())
    .map(([name, count]) => ({
      name,
      hex: COLOR_CONFIG[name]?.hex || '#9CA3AF',
      count
    }))
    .sort((a, b) => b.count - a.count);

  const conditionLabels: Record<string, string> = {
    'Nyskick': 'Nyskick (med lappar/oanvänd)',
    'Mycket bra skick': 'Mycket bra skick',
    'Bra skick': 'Bra skick (normal användning)',
    'Vintageskick': 'Vintageskick (fin patina)'
  };

  const conditions = Array.from(conditionMap.entries())
    .map(([id, count]) => ({
      id,
      label: conditionLabels[id] || id,
      count
    }));

  const marketplaces = Array.from(marketplaceMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const tags = Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }));

  return {
    brands,
    sizes,
    colors,
    conditions,
    marketplaces,
    tags,
    priceRange: {
      min: minP === Infinity ? 0 : minP,
      max: maxP === -Infinity ? 10000 : maxP
    }
  };
}
