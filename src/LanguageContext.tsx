import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'SV' | 'EN';

export interface TranslationDict {
  header: {
    home: string;
    hotCurrently: string;
    howItWorks: string;
    aboutUs: string;
    getStarted: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buy: string;
    sell: string;
    searchPlaceholder: string;
    sellPlaceholder: string;
    searchLabel: string;
    sellLabel: string;
    sizeLabel: string;
    priceLabel: string;
    pricePlaceholder: string;
    searchBtn: string;
    sellBtn: string;
    conMarketLabel: string;
    liveHeader: string;
    filteredPrefix: string;
    scanningTitle: string;
    scanningSubtitle: string;
    searchedCloth: string;
    valuedCloth: string;
    marketValue: string;
    basedOnHistory: string;
    suggestedEndPrice: string;
    normalPriceRange: string;
    salesTarget: string;
    bargainUnder: string;
    startingBid: string;
    foundListings: string;
    noListingsFound: string;
    showListing: string;
    searchOnPlick: string;
    searchOnTradera: string;
    aiTitle: string;
    aiDesc: string;
    emptySearch: string;
    scanningFooter: string;
    autoIntegration: string;
    categories: {
      jeans: string;
      knitwear: string;
      sneakers: string;
      bags: string;
    };
    platforms: {
      all: string;
    };
  };
  howItWorks: {
    badge: string;
    title: string;
    steps: {
      oneTitle: string;
      oneDesc: string;
      twoTitle: string;
      twoDesc: string;
      threeTitle: string;
      threeDesc: string;
    };
  };
  whyRepeak: {
    title: string;
    desc1: string;
    desc2: string;
    badge1: string;
    badge2: string;
    badge3: string;
  };
  faq: {
    badge: string;
    title: string;
    description: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    btn: string;
    successTitle: string;
    successSubtitle: string;
    subscribeAnother: string;
  };
  footer: {
    desc: string;
    linksTitle: string;
    legalTitle: string;
    terms: string;
    privacy: string;
    copyright: string;
    swedishDesign: string;
    linkHome: string;
    linkHow: string;
    linkPrice: string;
    linkBusiness: string;
    linkInvite: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPlans: string;
    ctaDiagnostics: string;
    monthly: string;
    yearly: string;
    discount: string;
    mostPopular: string;
    billedAnnually: string;
    billedMonthly: string;
    zeroCommitment: string;
    includedHeader: string;
    proTrialAction: string;
    proTrialFootnote: string;
    enterpriseCta: string;
    enterprisePrice: string;
    comparisonTitle: string;
    comparisonDesc: string;
    capabilityCol: string;
    recSelection: string;
  };
  simulator: {
    badge: string;
    title: string;
    description: string;
    selectFashionArchive: string;
    sublabelRetail: string;
    activeTitle: string;
    compareBtnText: string;
    runDeepExtraction: string;
    btnScanningText: string;
    btnNormalText: string;
    savingsMetric: string;
    accuracyMetric: string;
    scoutingTitle: string;
    scoutTerminalText: string;
    findingMatchesText: string;
    scanningStatusText: string;
    calibratingDetailsText: string;
    matchFoundAlertText: string;
    scannedArchiveTitle: string;
    bestMarketDealTitle: string;
    unifiedHeading: string;
    authenticatorTitle: string;
    armAlertBtn: string;
    armedAlertState: string;
    alertDetails: string;
    proLockBadge: string;
    proLockText: string;
    sourceIndexLabel: string;
    automationAlertSub: string;
  };
}

const TRANSLATIONS: Record<Language, TranslationDict> = {
  SV: {
    header: {
      home: 'HEM',
      hotCurrently: 'HETT JUST NU',
      howItWorks: 'HUR DET FUNKAR',
      aboutUs: 'OM OSS',
      getStarted: 'Kom igång'
    },
    hero: {
      title: 'Hitta modet',
      subtitle: 'Modus hittar priset',
      description: 'Sök över alla secondhand-appar samtidigt. Få en oberoende AI-värdering och undvik dåliga köp.',
      buy: 'Köpa',
      sell: 'Sälja',
      searchPlaceholder: 'Vad letar du efter?',
      sellPlaceholder: 'Skriv vad du vill värdera & sälja...',
      searchLabel: 'sök',
      sellLabel: 'värdera',
      sizeLabel: 'storlek',
      priceLabel: 'pris',
      pricePlaceholder: 'Max SEK',
      searchBtn: 'Sök',
      sellBtn: 'Värdera',
      conMarketLabel: 'Anslutna marknadsplatser för sökning',
      liveHeader: 'REPEAK LIVE AGGREGATION',
      filteredPrefix: 'Filtrerat',
      scanningTitle: 'Söker och hämtar från 8 marknadsplatser...',
      scanningSubtitle: 'Jämför texturer, prishistorik och produktkod...',
      searchedCloth: 'Sökt plagg',
      valuedCloth: 'Värderat plagg',
      marketValue: 'Beräknat marknadsvärde',
      basedOnHistory: 'Baserat på historik',
      suggestedEndPrice: 'Föreslaget slutpris',
      normalPriceRange: 'Normalt prisspann',
      salesTarget: 'Målsättning vid försäljning',
      bargainUnder: 'Köp under {val} kr är kap!',
      startingBid: 'Lägg utgångsbud på {val} kr',
      foundListings: 'Funna annonser på nätet',
      noListingsFound: 'Inga annonser hittades på {platform} för det här plagget.',
      showListing: 'Visa annons',
      searchOnPlick: 'Sök på Plick',
      searchOnTradera: 'Sök på Tradera',
      aiTitle: 'Oberoende AI-värderingar',
      aiDesc: 'Repeaks algoritm skannar och beräknar prishistorik för över 200 000 annonser i veckan. Vi varnar dig direkt om säljaren begär ett oskäligt pris jämfört med snittvärdet.',
      emptySearch: 'Välj ett förvalt plagg ovan eller sök efter vad du letar efter för att skanna!',
      scanningFooter: 'Repeak skannar: Blocket, Tradera, Vinted, Plick, Sellpy, Vestiaire',
      autoIntegration: 'Integrerar automatiskt prissänkningar',
      categories: {
        jeans: 'Jeans',
        knitwear: 'Stickat',
        sneakers: 'Sneakers',
        bags: 'Väskor'
      },
      platforms: {
        all: 'ALLA APPAR'
      }
    },
    howItWorks: {
      badge: 'Enkelhet',
      title: 'Så funkar Repeak',
      steps: {
        oneTitle: 'Sök Smartare',
        oneDesc: 'Ladda upp en bild eller beskriv vad du letar efter. Vår AI identifierar plagget och skapar sökningar på alla stora sajter.',
        twoTitle: 'Jämför Priser',
        twoDesc: 'Är det verkligen ett kap? Vi analyserar tusentals avslutade annonser för att ge dig ett rättvist marknadsvärde.',
        threeTitle: 'Handla Säkert',
        threeDesc: 'Vi varnar för misstänkta bedrägerier och kopior. Klicka dig vidare till butiken när du hittat rätt.'
      }
    },
    whyRepeak: {
      title: 'Varför Repeak?',
      desc1: 'Andrahandsmarknaden är en djungel. Tradera, Blocket, Vinted, Plick... att hitta rätt plagg till rätt pris tar tid och kräver tålamod. Vi tröttnade på att ha 15 flikar öppna samtidigt.',
      desc2: 'Repeak föddes ur idén att samla allt på ett ställe. Med hjälp av modern AI hjälper vi dig åtgärda bruset, undvika överpriser och göra modevärlden lite mer hållbar, ett plagg i taget.',
      badge1: 'Oberoende',
      badge2: 'AI-Drivet',
      badge3: 'Hållbart'
    },
    faq: {
      badge: 'Frågor & Svar',
      title: 'Vanliga frågor om Repeak',
      description: 'Här hittar du svaren på hur vi hjälper dig att göra bättre och säkrare val på andrahandsmarknaden.',
      q1: 'Hur fungerar sökbevakningen i realtid?',
      a1: 'Våra robotar söker av och indexerar anslutna plattformar i realtid. Så fort ett plagg som matchar dina önskemål (märke, storlek, maxpris) läggs ut på exempelvis Tradera eller Vinted, skickar vi en notis till din mail eller telefon direkt.',
      q2: 'Hur pålitlig är AI-värderingen och marknadsanalysen?',
      a2: 'Vår AI analyserar historisk data och avslutade försäljningar från alla stora svenska och internationella plattformar. Genom att sammanställa faktiskt slutpris (viktat efter skick och årtal) kan vi ge en oberoende rekommendation om ifall en annons är ett kap, rättvist prissatt eller ett överpris.',
      q3: 'Vilka marknadsplatser söker Repeak på?',
      a3: 'Vi söker samtidigt på Tradera, Blocket, Vinted, Sellpy, Plick och Vestiaire Collective. Den skandinaviska marknaden är fullt integrerad och vi lägger löpande till fler globala och lokala butiker.',
      q4: 'Kostar Repeak någonting att använda?',
      a4: 'Det är helt gratis att söka, värdera och jämföra priser på Repeak. För hobbysamlare och power-säljare erbjuder vi i framtiden även PRO-funktioner såsom direkta push-notiser och djupgående trendanalyser.',
      q5: 'Hur fungerar bildsökningen?',
      a5: 'Du laddar upp en bild eller skärmdump på en tröja, ett par jeans eller sneakers. Vår AI identifierar märket, mönstret och snittet för att omedelbart hitta identiska eller liknande plagg till salu på alla sidor.'
    },
    newsletter: {
      title: 'Missa aldrig ett kap',
      subtitle: 'Gå med i Repeak Club. Få veckans bästa kap, trendspaningar och säljtips direkt i inkorgen.',
      placeholder: 'Din e-postadress',
      btn: 'Prenumerera',
      successTitle: 'Tack för din anmälan!',
      successSubtitle: 'Du har lagts till i Repeak Club. Håll utkik i inkorgen!',
      subscribeAnother: 'Anmäl en till adress'
    },
    footer: {
      desc: 'Repeak är en oberoende sök- och jämförelsetjänst. Vi hjälper dig hitta hållbart mode smartare genom att samla hela marknaden på ett ställe.',
      linksTitle: 'Länkar',
      legalTitle: 'Juriniskt',
      terms: 'Villkor',
      privacy: 'Integritetspolicy',
      copyright: '© 2026 Repeak AB. Alla rättigheter reserverade.',
      swedishDesign: 'Svensk design och utveckling',
      linkHome: 'Hem',
      linkHow: 'Hur det funkar',
      linkPrice: 'Prisplan',
      linkBusiness: 'För företag',
      linkInvite: 'Bjud in vänner'
    },
    pricing: {
      badge: 'Bloomberg för secondhandmodet',
      title: 'Maximera ditt andrahandsvärde',
      subtitle: 'Få omedelbara fyndnotiser, avancerad äkthetsanalys och marknadsinsikter i realtid före alla andra.',
      ctaPlans: 'Visa Pro Plus',
      ctaDiagnostics: 'Kör gratis diagnostik',
      monthly: 'Månadsvis',
      yearly: 'Årsvis',
      discount: '-20%',
      mostPopular: 'MEST POPULÄR',
      billedAnnually: 'Faktureras årsvis ({val} kr/år)',
      billedMonthly: 'Faktureras månadsvis',
      zeroCommitment: 'Ingen bindningstid',
      includedHeader: 'Ingående funktioner:',
      proTrialAction: 'Påbörja 7-dagars gratis provperiod',
      proTrialFootnote: 'Full tillgång. Avsluta när du vill.',
      enterpriseCta: 'Kontakta säljavdelningen',
      enterprisePrice: 'Anpassad',
      comparisonTitle: 'Djupgående specifikationer',
      comparisonDesc: 'En komplett jämförelse av funktioner och premiumtrösklar för våra tre nivåer.',
      capabilityCol: 'Förmåga',
      recSelection: 'REKOMMENDERAT VAL'
    },
    simulator: {
      badge: 'SKANNER-PREVIEW',
      title: 'Värderings- & scoutterminal',
      description: 'Testa vår curerade bevakningsterminal. Vi aggregerar annonsdata från globala arkiv, beräknar prisintervall och kontrollerar äkthetsindikatorer.',
      selectFashionArchive: '1. Välj modeobjekt',
      sublabelRetail: 'Butikspris i snitt',
      activeTitle: 'KÖPARE / SÄLJARE INDEX',
      compareBtnText: 'Jämför annonser →',
      runDeepExtraction: '2. Kör djupanalys',
      btnScanningText: 'Analyserar data...',
      btnNormalText: 'Sök på alla 8 plattformar',
      savingsMetric: 'Genomsnittlig besparing',
      accuracyMetric: 'Värderingsprecision',
      scoutingTitle: 'INSAMLADE NYCKELTAL',
      scoutTerminalText: 'Att söka sällsynt mode i andra hand handlar om information. Repeaks motor skannar katalogavvikelser i realtid.',
      findingMatchesText: 'Söker och hämtar från arkiv...',
      scanningStatusText: 'Verifierar annonser online (Grailed, Sellpy, Vinted, eBay, Depop)...',
      calibratingDetailsText: 'Utvärderar plaggmått, logotypstämpling och texturfokus...',
      matchFoundAlertText: 'Sökning slutförd. Hittade 4 historiska matchningar.',
      scannedArchiveTitle: 'Sökt produkt',
      bestMarketDealTitle: 'Bästa matchade fynd',
      unifiedHeading: 'Aggregering i realtid',
      authenticatorTitle: 'Äkthet & avvikelser (V4)',
      armAlertBtn: '⚡ Aktivera sökbevakning',
      armedAlertState: '✓ Bevakning aktiv {val}',
      alertDetails: 'Sparar sökvillkor och skickar en pushnotis i mobilen när ett verifierat fynd dyker upp.',
      proLockBadge: '🔒 INKLUDERAR LÅST PRO-FUNKTION',
      proLockText: 'Avancerad äkthetsmatris är begränsad på gratisversionen. Pro låser upp vår fullständiga 12-punkters skanning.',
      sourceIndexLabel: 'INKLUDERAR DATAKÄLLOR FRÅN GRAILED, VESTIAIRE, DEPOP, EBAY, VINTED',
      automationAlertSub: 'Pro-konton har helautomatiserad direktbevakning utan fördröjning.'
    }
  },
  EN: {
    header: {
      home: 'HOME',
      hotCurrently: 'TRENDING',
      howItWorks: 'HOW IT WORKS',
      aboutUs: 'ABOUT US',
      getStarted: 'Get Started'
    },
    hero: {
      title: 'Find the Fashion',
      subtitle: 'Modus finds the price',
      description: 'Search across all secondhand apps simultaneously. Get an independent AI valuation and avoid bad purchases.',
      buy: 'Buy',
      sell: 'Sell',
      searchPlaceholder: 'What are you looking for?',
      sellPlaceholder: 'Type what you want to value & sell...',
      searchLabel: 'search',
      sellLabel: 'value',
      sizeLabel: 'size',
      priceLabel: 'price',
      pricePlaceholder: 'Max USD',
      searchBtn: 'Search',
      sellBtn: 'Value',
      conMarketLabel: 'Connected marketplaces for search',
      liveHeader: 'REPEAK LIVE AGGREGATION',
      filteredPrefix: 'Filtered',
      scanningTitle: 'Searching and fetching from 8 marketplaces...',
      scanningSubtitle: 'Comparing textures, price history, and product codes...',
      searchedCloth: 'Searched Item',
      valuedCloth: 'Valued Item',
      marketValue: 'Calculated Market Value',
      basedOnHistory: 'Based on history',
      suggestedEndPrice: 'Suggested end price',
      normalPriceRange: 'Normal price range',
      salesTarget: 'Sales target',
      bargainUnder: 'Buying under {val} kr is a steal!',
      startingBid: 'Set starting bid at {val} kr',
      foundListings: 'Found listings online',
      noListingsFound: 'No listings found on {platform} for this item.',
      showListing: 'View listing',
      searchOnPlick: 'Search on Plick',
      searchOnTradera: 'Search on Tradera',
      aiTitle: 'Independent AI Valuations',
      aiDesc: "Repeak's algorithm scans and calculates price history for over 200,000 listings per week. We notify you instantly if a seller asks for an unreasonable price compared to the average value.",
      emptySearch: 'Select a pre-selected item above or search for what you are looking for to start scanning!',
      scanningFooter: 'Repeak scans: Blocket, Tradera, Vinted, Plick, Sellpy, Vestiaire',
      autoIntegration: 'Automatically integrates price drops',
      categories: {
        jeans: 'Jeans',
        knitwear: 'Knitwear',
        sneakers: 'Sneakers',
        bags: 'Bags'
      },
      platforms: {
        all: 'ALL APPS'
      }
    },
    howItWorks: {
      badge: 'Simplicity',
      title: 'How Repeak Works',
      steps: {
        oneTitle: 'Search Smarter',
        oneDesc: 'Upload an image or describe what you are looking for. Our AI identifies the item and triggers searches across all major sites.',
        twoTitle: 'Compare Prices',
        twoDesc: 'Is it really a bargain? We analyze thousands of completed listings to give you a fair market value.',
        threeTitle: 'Shop Safely',
        threeDesc: 'We warn you about suspected scams and replicas. Click through to the original shop when you find the right match.'
      }
    },
    whyRepeak: {
      title: 'Why Repeak?',
      desc1: 'The secondhand market is a jungle. Tradera, Blocket, Vinted, Plick... finding the right piece at the right price takes time and patience. We got tired of having 15 tabs open at once.',
      desc2: 'Repeak was born out of the idea of gathering everything in one place. Using modern AI, we help you navigate the noise, avoid overpricing, and make the fashion world a bit more sustainable, one garment at a time.',
      badge1: 'Independent',
      badge2: 'AI-Powered',
      badge3: 'Sustainable'
    },
    faq: {
      badge: 'FAQ',
      title: 'Frequently Asked Questions',
      description: 'Find answers on how we help you make better and safer decisions on the secondhand market.',
      q1: 'How does real-time search monitoring work?',
      a1: 'Our bots monitor is and index connected platforms in real-time. As soon as a garment matching your preferences (brand, size, max price) is listed on Tradera or Vinted, we dispatch a notification to your email or phone instantly.',
      q2: 'How accurate is the AI valuation and market analysis?',
      a2: 'Our AI analyzes historical data and finalized sales across all major Scandinavian and international platforms. By aggregating actual checkout prices (weighted for condition and year), we can issue an independent recommendation on whether a listing is a deal, fairly priced, or overpriced.',
      q3: 'Which marketplaces does Repeak search?',
      a3: 'We simultaneously search Tradera, Blocket, Vinted, Sellpy, Plick, and Vestiaire Collective. The Scandinavian market is fully integrated, and we are continuously expanding with more global and local shops.',
      q4: 'Does Repeak cost anything to use?',
      a4: 'It is completely free to search, value, and compare prices on Repeak. For hobby collectors and power sellers, we will offer PRO features in the future, such as custom push notifications and deep trend reports.',
      q5: 'How does the image search function work?',
      a5: 'You upload a photo or screenshot of a sweater, jeans, or sneakers. Our AI identifies the brand, pattern, and cut to immediately retrieve identical or similar garments for sale on all pages.'
    },
    newsletter: {
      title: 'Never miss a bargain',
      subtitle: 'Join the Repeak Club. Get the weekly best deals, trend radars, and seller tips directly in your inbox.',
      placeholder: 'Your email address',
      btn: 'Subscribe',
      successTitle: 'Thank you for subscribing!',
      successSubtitle: "You've been added to the Repeak Club. Stay tuned in your inbox!",
      subscribeAnother: 'Subscribe another email'
    },
    footer: {
      desc: 'Repeak is an independent search and price comparison tool. We help you find sustainable fashion smarter by grouping the whole marketplace in one search.',
      linksTitle: 'Links',
      legalTitle: 'Legal',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      copyright: '© 2026 Repeak AB. All rights reserved.',
      swedishDesign: 'Swedish design and development',
      linkHome: 'Home',
      linkHow: 'How it works',
      linkPrice: 'Price Plan',
      linkBusiness: 'For Partners',
      linkInvite: 'Invite Friends'
    },
    pricing: {
      badge: 'Bloomberg for secondhand fashion',
      title: 'Upgrade your secondhand game',
      subtitle: 'Get instant deal alerts, advanced fake detection, and smarter fashion insights before everyone else.',
      ctaPlans: 'View Premium Plans',
      ctaDiagnostics: 'Run Free Diagnostics',
      monthly: 'Monthly',
      yearly: 'Yearly',
      discount: '-20%',
      mostPopular: 'MOST POPULAR',
      billedAnnually: 'Billed annually ({val} kr/year)',
      billedMonthly: 'Billed monthly',
      zeroCommitment: 'Zero commitment',
      includedHeader: 'Features Included:',
      proTrialAction: 'Start 7-Day Free Trial',
      proTrialFootnote: 'Full access. Cancel anytime.',
      enterpriseCta: 'Contact Sourcing Desk',
      enterprisePrice: 'Custom',
      comparisonTitle: 'Granular Capabilities Model',
      comparisonDesc: 'A side-by-side technical specification breakdown of the three tiers. Choose your precision level.',
      capabilityCol: 'Capability',
      recSelection: 'RECOMMENDED SELECTION'
    },
    simulator: {
      badge: 'SCANNER PREVIEW',
      title: 'Sourcing Terminal Simulation',
      description: 'Test our curated scouting system. We aggregate listing datasets across major global archives, analyze valuation ranges, and benchmark condition indicators.',
      selectFashionArchive: '1. Select Target Fashion Archive',
      sublabelRetail: 'Est. Retail',
      activeTitle: 'SOURCING INDEX',
      compareBtnText: 'Compare Listings →',
      runDeepExtraction: '2. Run Deep Extraction',
      btnScanningText: 'Analyzing Global Archives...',
      btnNormalText: 'Search Across 8 Platforms',
      savingsMetric: 'Avg. Verified Savings',
      accuracyMetric: 'Pricing Accuracy',
      scoutingTitle: 'COLLECTOR METRICS',
      scoutTerminalText: 'Buying rare garments is an information game. Casual shoppers buy unverified pieces; experienced scouts track catalog anomalies.',
      findingMatchesText: 'Scanning archives for active listings...',
      scanningStatusText: 'Comparing active listing datasets (Grailed, Vestiaire, Vinted, eBay, Depop)...',
      calibratingDetailsText: 'Benchmarking texture structure and material stamp alignment...',
      matchFoundAlertText: 'Discovery loop completed successfully. 4 historical reference matches verified.',
      scannedArchiveTitle: 'Target Archive',
      bestMarketDealTitle: 'Best Market Deal',
      unifiedHeading: 'Unified Sourcing',
      authenticatorTitle: 'Authenticator V4 Diagnostics',
      armAlertBtn: '⚡ Arm Alert for this Item',
      armedAlertState: '✓ Alert Armed {val}',
      alertDetails: 'Saves search parameters and triggers a mobile alert when a replica-screened seller prices below average.',
      proLockBadge: '🔒 PRO FEATURE LOCK INCLUDED',
      proLockText: 'Instant AI diagnostics are restricted on Free. Pro unlocks full 12-point vector scanner checks.',
      sourceIndexLabel: 'SOURCE OUTLET INDEX INCLUDES: Grailed, Vestiaire, Depop, eBay, Vinted',
      automationAlertSub: 'Pro features fully automated alert updates.'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  login: (email: string) => void;
  logout: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Attempt local storage sync if any exists
    const stored = localStorage.getItem('repeak_lang');
    return stored === 'EN' ? 'EN' : 'SV';
  });

  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    const stored = localStorage.getItem('repeak_logged_in');
    return stored !== 'false'; // default to true on fresh start as requested, but allow toggle to persist
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('repeak_lang', lang);
  };

  const setIsLoggedIn = (val: boolean) => {
    setIsLoggedInState(val);
    localStorage.setItem('repeak_logged_in', val ? 'true' : 'false');
  };

  const login = (email: string) => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoggedIn, setIsLoggedIn, login, logout }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
