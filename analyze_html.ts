import fs from 'fs';

function analyzeHtml() {
  console.log('=== ANALYZING TRADERA HTML ===');
  if (fs.existsSync('tradera.html')) {
    const html = fs.readFileSync('tradera.html', 'utf8');
    
    // Find item links matching href="/item/<digits>/<title>"
    const itemLinkRegex = /href="\/item\/([^\s"]+)"/g;
    let match;
    const itemLinks: string[] = [];
    while ((match = itemLinkRegex.exec(html)) !== null && itemLinks.length < 15) {
      itemLinks.push(match[1]);
    }
    console.log(`Found ${itemLinks.length} item href links on Tradera search page. Samples:`);
    itemLinks.forEach(link => console.log(' - /item/' + link));
    
    // Let's look for images and prices near /item/
    // Let's print some lines of html around one of the item links
    if (itemLinks.length > 0) {
      const firstLink = itemLinks[0];
      const index = html.indexOf(`/item/${firstLink}`);
      if (index !== -1) {
        console.log('\n--- Context of first item link ---');
        const snippet = html.substring(Math.max(0, index - 500), Math.min(html.length, index + 1500));
        console.log(snippet.substring(0, 1000) + '...');
        
        // Let's research if we can extract prices and titles from adjacent image or spans
        // In the snippet, let's see if we can find price structures like 'kr' (e.g. 500 kr, 500 SEK)
      }
    }
    
    // It's possible Tradera details are inside a script tags with __NEXT_DATA__ which we proved exists!
    // Wait, in our first test, did we find a __NEXT_DATA__ tag in the search page? Yes! It was length 241700!
    // But inspect_tradera.ts didn't find "items" in pageProps. Let's look for what is in pageProps in detail!
    // Let's read the saved `tradera_next_data.json` and output all recursive keys in `pageProps` with high detail!
  }

  console.log('\n=== ANALYZING PLICK ROOT HTML ===');
  if (fs.existsSync('plick_root.html')) {
    const html = fs.readFileSync('plick_root.html', 'utf8');
    
    // Look for NEXT_DATA
    const holdsNextData = html.includes('id="__NEXT_DATA__"');
    console.log('Plick root has __NEXT_DATA__:', holdsNextData);
    
    // Search for any script tags or keywords like "api" or "graphql" or "ajax" or "algolia"
    const regexApi = /(api\.[a-zA-Z0-9.\-_]+\.[a-z]{2,}|[a-zA-Z0-9.\-_]+\/api)/gi;
    let apiMatch;
    const apiMatches = new Set();
    while ((apiMatch = regexApi.exec(html)) !== null && apiMatches.size < 10) {
      apiMatches.add(apiMatch[1]);
    }
    console.log('Inferred API strings in Plick HTML:', Array.from(apiMatches));
    
    // Search for keywords like "searchUrl", "graphql", "accessToken" or similar
    const keywords = ['graphql', 'algolia', 'elasticsearch', 'client', 'search', 'query', 'sok', 'sök'];
    keywords.forEach(kw => {
      const idx = html.toLowerCase().indexOf(kw);
      console.log(`Keyword "${kw}" found around index:`, idx);
      if (idx !== -1) {
        console.log(`Snippet around "${kw}":`, html.substring(idx - 50, idx + 100));
      }
    });
  }
}

analyzeHtml();
