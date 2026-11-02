import { NormalizedListing } from './searchEngine.js';

export class TraderaFetcher {
  /**
   * Fetches active listings directly from Tradera search page.
   * Utilizes a dual parsing strategy:
   * 1. Next.js inline structured state JSON (__NEXT_DATA__)
   * 2. Fallback HTML selector card parser
   */
  public static async fetch(query: string): Promise<NormalizedListing[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return [];
    }

    console.log(`🔍 [TraderaFetcher] Initiating direct active listing query for: "${normalizedQuery}"...`);

    try {
      const url = `https://www.tradera.com/search?q=${encodeURIComponent(normalizedQuery)}`;
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'sv-SE,sv;q=0.8,en-US;q=0.5,en;q=0.3'
        }
      });

      if (!res.ok) {
        console.error(`⚠️ [TraderaFetcher] Fetch failed with status: ${res.status}`);
        return [];
      }

      const html = await res.text();
      
      // Dual Strategy 1: Attempt Next.js state data extraction
      try {
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]+?)<\/script>/);
        if (nextDataMatch) {
          const stateJson = JSON.parse(nextDataMatch[1]);
          const items = stateJson?.props?.pageProps?.initialState?.discover?.items;
          
          if (Array.isArray(items) && items.length > 0) {
            const listings: NormalizedListing[] = [];
            
            for (const item of items) {
              // Ensure we only extract products that are active and have valid details
              if (!item.shortDescription || !item.itemUrl) continue;
              
              // Ensure we don't return search pages, only direct product pages
              const urlLower = item.itemUrl.toLowerCase();
              if (
                !urlLower.includes('/item/') ||
                urlLower.includes('/search') ||
                urlLower.includes('/sok') ||
                urlLower.includes('/discover') ||
                urlLower.includes('/category') ||
                urlLower.includes('/tag') ||
                urlLower.includes('/results')
              ) {
                continue;
              }
              
              // Map Image Layout URL
              let image = '';
              if (item.imageUrlTemplate) {
                // Tradera CDN replaces {format} with medium/large/original
                image = item.imageUrlTemplate.replace('{format}', 'medium');
              } else if (item.imageSecondaryUrlTemplate) {
                image = item.imageSecondaryUrlTemplate.replace('{format}', 'medium');
              } else {
                continue; // Image is mandatory as per requirements
              }

              // Extract price
              const price = typeof item.price === 'number' ? item.price : 0;
              if (price <= 0) continue; // Price represents a mandatory field

              // Extract brand
              let brand = 'Unknown';
              if (Array.isArray(item.attributes)) {
                const brandAttr = item.attributes.find((attr: any) => attr.name === 'brand');
                if (brandAttr && Array.isArray(brandAttr.values) && brandAttr.values[0]) {
                  brand = brandAttr.values[0];
                }
              }
              if (brand === 'Unknown') {
                const firstWord = item.shortDescription.trim().split(/[\s”"’']+/)[0];
                if (firstWord) brand = firstWord;
              }

              // Extract condition
              let condition = 'Bra skick';
              if (Array.isArray(item.attributes)) {
                const condAttr = item.attributes.find((attr: any) => attr.name === 'condition');
                if (condAttr && Array.isArray(condAttr.values) && condAttr.values[0]) {
                  condition = condAttr.values[0];
                }
              }

              listings.push({
                title: item.shortDescription.trim(),
                brand: brand.trim(),
                price,
                image,
                marketplace: 'Tradera',
                url: item.itemUrl,
                condition: condition.trim(),
                hasDirectUrl: true
              });
            }

            if (listings.length > 0) {
              console.log(`✅ [TraderaFetcher] Successfully parsed ${listings.length} live listings from Next.js state.`);
              return listings;
            }
          }
        }
      } catch (jsonErr: any) {
        console.warn(`⚠️ [TraderaFetcher] Failed parsing __NEXT_DATA__, attempting HTML fallback:`, jsonErr.message);
      }

      // Dual Strategy 2: HTML Card parsing fallback
      const listings: NormalizedListing[] = [];
      const cardStartRegex = /<div id="item-card-([0-9]+)"/g;
      const indices: number[] = [];
      let match;
      while ((match = cardStartRegex.exec(html)) !== null) {
        indices.push(match.index);
        if (indices.length >= 80) break; // upper bound check
      }
      
      for (let i = 0; i < indices.length; i++) {
        const startIdx = indices[i];
        const endIdx = i + 1 < indices.length ? indices[i + 1] : html.length;
        const block = html.substring(startIdx, endIdx);
        
        // 1. Extract Item Path/URL
        const pathMatch = block.match(/\/item\/([0-9]+)\/([0-9]+)\/[^\s"?#<>']+/);
        if (!pathMatch) continue;
        const path = pathMatch[0];
        const url = `https://www.tradera.com${path}`;

        const urlLower = url.toLowerCase();
        if (
          !urlLower.includes('/item/') ||
          urlLower.includes('/search') ||
          urlLower.includes('/sok') ||
          urlLower.includes('/discover') ||
          urlLower.includes('/category') ||
          urlLower.includes('/tag') ||
          urlLower.includes('/results')
        ) {
          continue;
        }
        
        // 2. Extract Title
        let title = '';
        const titleAttrMatch = block.match(/title="([^"]+)"/);
        if (titleAttrMatch) {
           title = titleAttrMatch[1];
        } else {
           const escapedPath = path.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
           const hrefTextMatch = block.match(new RegExp(`href="${escapedPath}">([^<]+)<`));
           if (hrefTextMatch) {
             title = hrefTextMatch[1];
           }
        }
        
        if (!title || title.toLowerCase() === 'mer info' || title.toLowerCase().includes('bild')) {
          continue;
        }
        
        // 3. Extract Image URL
        let image = '';
        const srcSetMatch = block.match(/srcSet="([^"\s,]+)/);
        if (srcSetMatch) {
          image = srcSetMatch[1];
        } else {
          const srcMatch = block.match(/src="([^"]+)"/);
          if (srcMatch) {
            image = srcMatch[1];
          }
        }
        
        if (!image) {
          continue; // Image is mandatory as per requirements
        }
        
        // 4. Extract Price
        let price = 0;
        const priceMatch = block.match(/data-testid="price">([^<]+)/);
        if (priceMatch) {
          const rawPrice = priceMatch[1]
            .replace(/kr/gi, '')
            .replace(/\s/g, '')
            .replace(/\u00A0/g, '')
            .trim();
          price = parseInt(rawPrice, 10);
        }
        
        if (!price || isNaN(price)) {
          const binPriceMatch = block.match(/data-testid="bin-price">([^<]+)/);
          if (binPriceMatch) {
            const rawBin = binPriceMatch[1]
              .replace(/kr/gi, '')
              .replace(/\s/g, '')
              .replace(/\u00A0/g, '')
              .trim();
            price = parseInt(rawBin, 10);
          }
        }
        
        if (!price || isNaN(price)) {
          continue; // Price represents a mandatory field
        }
        
        // 5. Extract Brand
        let brand = 'Unknown';
        const words = title.trim().split(/[\s”"’']+/);
        if (words.length > 0 && words[0]) {
          brand = words[0];
        }
        
        listings.push({
          title: title.trim(),
          brand: brand.trim(),
          price,
          image,
          marketplace: 'Tradera',
          url,
          condition: 'Bra skick',
          hasDirectUrl: true
        });
      }

      console.log(`✅ [TraderaFetcher] HTML fallback parsed ${listings.length} live listings.`);
      return listings;
    } catch (err: any) {
      console.error(`🔴 [TraderaFetcher] Unexpected error while fetching live Tradera listings:`, err.message);
      return [];
    }
  }
}
