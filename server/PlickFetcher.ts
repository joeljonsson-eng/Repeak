import { NormalizedListing } from './searchEngine.js';

export class PlickFetcher {
  /**
   * Fetches active listings directly from Plick search page.
   * Leverages robust HTML pattern parsing to build verified direct listing objects.
   */
  public static async fetch(query: string): Promise<NormalizedListing[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return [];
    }

    console.log(`🔍 [PlickFetcher] Initiating direct active listing query for: "${normalizedQuery}"...`);

    try {
      const url = `https://plick.se/produkter?query=${encodeURIComponent(normalizedQuery)}`;
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'sv-SE,sv;q=0.8,en-US;q=0.5,en;q=0.3'
        }
      });

      if (!res.ok) {
        console.error(`⚠️ [PlickFetcher] Fetch failed with status: ${res.status}`);
        return [];
      }

      const html = await res.text();
      const listings: NormalizedListing[] = [];
      
      // Split the HTML into blocks where each block begins with a listing card class
      const parts = html.split('class="listing-card-component"');
      if (parts.length <= 1) {
        console.log(`⚠️ [PlickFetcher] No listing-card-component classes found in HTML.`);
        return [];
      }
      
      for (let i = 1; i < parts.length; i++) {
        const block = parts[i];
        
        // 1. Extract Item/Product Link
        // Looks for a link tag wrapping the image layer inside the card component
        const linkMatch = block.match(/href="([^"]+)"[^>]*>\s*<div class="listing-card-component__image"/i);
        let href = '';
        if (linkMatch) {
          href = linkMatch[1];
        } else {
          // Alternative fallback matching any product links of the form '/[category-slug]/[item-slug]'
          const anyHref = block.match(/href="(\/[^/"]+\/[^"]+)"/);
          if (anyHref) {
            href = anyHref[1];
          }
        }
        
        if (!href) {
          continue; // No relative href found, skip this item entirely
        }

        // Apply strict filtering rules to keep only direct listing pages
        const hrefLower = href.toLowerCase();
        
        // Filter out indirect endpoints (/sok, /search, /discover, /category, /tag, /results, /profiler)
        if (
          hrefLower.includes('/sok') ||
          hrefLower.includes('/search') ||
          hrefLower.includes('/discover') ||
          hrefLower.includes('/category') ||
          hrefLower.includes('/tag') ||
          hrefLower.includes('/results') ||
          hrefLower.includes('/profiler/') ||
          hrefLower.includes('/profil/')
        ) {
          continue;
        }

        // Must be a direct product listing page
        const productUrl = `https://plick.se${href}`;

        // 2. Extract Image & Title
        let image = '';
        let title = '';
        
        // Match standard img components inside card
        const imgMatch = block.match(/<img class="listing-card-component__card-image" alt="([^"]*)"\s+src="([^"]+)"/i);
        if (imgMatch) {
          title = imgMatch[1];
          image = imgMatch[2];
        } else {
          const srcMatch = block.match(/src="([^"]+)"/);
          if (srcMatch) {
            image = srcMatch[1];
          }
          const altMatch = block.match(/alt="([^"]+)"/);
          if (altMatch) {
            title = altMatch[1];
          }
        }

        if (!title || !image) {
          continue; // Mandatory elements required per requirements
        }

        // Clean any double escaping or unwanted characters
        title = title.trim();

        // 3. Extract Price
        let price = 0;
        const priceMatch = block.match(/<strong class="text-truncate">([0-9]+)\s*SEK<\/strong>/i);
        if (priceMatch) {
          price = parseInt(priceMatch[1], 10);
        } else {
          const anyPriceMatch = block.match(/([0-9]+)\s*SEK/i);
          if (anyPriceMatch) {
            price = parseInt(anyPriceMatch[1], 10);
          }
        }

        if (!price || isNaN(price) || price <= 0) {
          continue; // Mandatory price
        }

        // 4. Extract Brand
        let brand = 'Unknown';
        const footerIdx = block.indexOf('class="listing-card-component__footer');
        if (footerIdx !== -1) {
          const footerBlock = block.substring(footerIdx);
          const footerBrandMatch = footerBlock.match(/<span class="text-truncate">\s*([^<>\n]+?)\s*<\/span>/i);
          if (footerBrandMatch) {
            brand = footerBrandMatch[1].trim();
          }
        }
        
        if (brand === 'Unknown') {
          // If brand matches 'Unknown', fetch first term from title
          const firstWord = title.split(/[\s”"’']+/)[0];
          if (firstWord) {
            brand = firstWord;
          }
        }

        // Plick items are pre-loved/secondhand items in good condition by default
        const condition = 'Bra skick';

        listings.push({
          title,
          brand,
          price,
          image,
          marketplace: 'Plick',
          url: productUrl,
          condition,
          hasDirectUrl: true
        });
      }

      console.log(`✅ [PlickFetcher] Direct Plick search successfully parsed ${listings.length} active listings.`);
      return listings;
    } catch (err: any) {
      console.error(`🔴 [PlickFetcher] Unexpected error while fetching live Plick listings:`, err.message);
      return [];
    }
  }
}
