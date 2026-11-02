import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, HelpCircle, AlertCircle, Sparkles, FolderOpen, Mail } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface FAQItem {
  id: string;
  category: 'search' | 'marketplace' | 'subscription' | 'safety';
  question: string;
  answer: string;
}

export default function Faq() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'search' | 'marketplace' | 'subscription' | 'safety'>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'q-search-1': true // open first by default
  });

  const categories = {
    all: language === 'SV' ? 'Alla frågor' : 'All questions',
    search: language === 'SV' ? 'Sökfrågor' : 'Search questions',
    marketplace: language === 'SV' ? 'Marknadsplatser' : 'Marketplaces',
    subscription: language === 'SV' ? 'Prenumeration' : 'Subscription',
    safety: language === 'SV' ? 'Säkerhet & Förtroende' : 'Trust & Safety',
  };

  const faqList = useMemo<FAQItem[]>(() => {
    if (language === 'SV') {
      return [
        {
          id: 'q-search-1',
          category: 'search',
          question: 'Hur fungerar Repeaks sökfunktion?',
          answer: 'Repeak är en intelligent sök- och prisjämförelsetjänst. När du anger ett sökord skickar vår motor realtidsförfrågningar till anslutna andrahandsmarknader som Tradera, Plick och Blocket. Vi sammanställer och sorterar resultatet blixtsnabbt i en och samma vy.'
        },
        {
          id: 'q-search-2',
          category: 'search',
          question: 'Kan jag spara sökningar eller sätta upp bevakningar?',
          answer: 'Ja, med ett Repeak-konto kan du bevaka dina favoritsökningar. Du anger dina önskade filter (t.ex. maxpris eller specifika storlekar) och sparar bevakningen. Pro-medlemmar får mejlnotiser inom 1 minut när ett matchande plagg publiceras.'
        },
        {
          id: 'q-search-3',
          category: 'search',
          question: 'Hur hittar jag specifika storlekar på olika appar?',
          answer: 'I sökformuläret kan du välja din storlek. Vår AI översätter och mappar storlekarna korrekt över de olika marknadsplatserna (så att t.ex. en jeansstorlek 30/32 mappar till rätt filter på både Tradera och Plick).'
        },
        {
          id: 'q-market-1',
          category: 'marketplace',
          question: 'Vilka marknadsplatser söker Repeak på?',
          answer: 'Just nu söker vi primärt på Tradera, Plick och Blocket live, samt visar historik och indexerat material från Sellpy, Vinted och Vestiaire Collective. Vi lägger kontinuerligt till fler integrerade nordiska andrahandsplattformar.'
        },
        {
          id: 'q-market-2',
          category: 'marketplace',
          question: 'Betalar jag direkt hos Repeak när jag handlar?',
          answer: 'Nej. Repeak är en oberoende jämförelseportal. När du hittar ett plagg du vill köpa och klickar på "Visa annons" slussas du direkt vidare till den externa marknadsplatsen (t.ex. Tradera eller Plick) där du slutför transaktionen på deras plattform.'
        },
        {
          id: 'q-sub-1',
          category: 'subscription',
          question: 'Hur fungerar den gratis provperioden på Pro?',
          answer: 'Vår provperiod är 7 dagar lång och helt kostnadsfri. Den låter dig testa alla Pro-fördelar, inklusive hastighetsbevakningar dygnet runt och fullt tillgång till historiska priser. Du kan pausa eller avsluta provperioden när som helst.'
        },
        {
          id: 'q-sub-2',
          category: 'subscription',
          question: 'Vilka betalningsmetoder erbjuder ni?',
          answer: 'Vi stöder alla större kreditkort (Visa, MasterCard, American Express) samt digitala betalkanaler som Apple Pay och fiktiva Klarna-fakturor via vårt säkra uppgraderingssystem.'
        },
        {
          id: 'q-sub-3',
          category: 'subscription',
          question: 'Hur avslutar jag min prenumeration?',
          answer: 'Du kan säga upp ditt medlemskap med en enda knapptryckning under "Mitt konto" (under fliken Inställningar). Din Pro-status förblir aktiv till slutet av din nuvarande betalningsperiod, därefter dras inga ytterligare avgifter.'
        },
        {
          id: 'q-safety-1',
          category: 'safety',
          question: 'Hur bedömer er AI om ett plagg är äkta eller en kopia?',
          answer: 'Våra neurobiologiskt inspirerade visionmodeller och mönsterigenkännings-verktyg jämför produktbeskrivningar, bilddetaljer och säljarens feedback-historik med tusentals kända referenser. Tveksamma annonser flaggas omedelbart med säljvarningar.'
        },
        {
          id: 'q-safety-2',
          category: 'safety',
          question: 'Vad är AI-kapbetyget för något?',
          answer: 'När vi hittar en annons räknar vi ut ett genomsnittligt marknadsvärde för samma plagg historiskt. Om säljarens pris ligger väsentligt under det beräknade marknadsvärdet flaggar vi varan som ett "Kap!". Ligger det väsentligt över varnar vi för överpris.'
        }
      ];
    } else {
      return [
        {
          id: 'q-search-1',
          category: 'search',
          question: 'How does Repeak search work?',
          answer: 'Repeak is an advanced secondhand search engine. When you perform a search, our system orchestrates real-time index API pulls across databases from Tradera, Plick, and Blocket, unifying all results in a single, lightning-fast dashboard.'
        },
        {
          id: 'q-search-2',
          category: 'search',
          question: 'Can I save searched profiles or configure alerts?',
          answer: 'Yes! Repeak accounts let you write and save tracking criteria (such as desired sizing envelopes or price thresholds). Pro profiles leverage server agents to dispatch immediate email alerts within 1 minute of a new matching listing.'
        },
        {
          id: 'q-search-3',
          category: 'search',
          question: 'How are sizes standardized across platforms?',
          answer: 'Our sizing translation engine correlates listing tags from diverse environments (e.g. mapping Denim 30/32 accurately to appropriate categories on both Tradera and Plick databases).'
        },
        {
          id: 'q-market-1',
          category: 'marketplace',
          question: 'Which secondhand marketplaces does Repeak crawl?',
          answer: 'We scan Tradera, Plick, and Blocket live, and reference price statistics from Sellpy, Vinted, and Vestiaire. We continuously index new fashion platforms to provide unmatched coverage.'
        },
        {
          id: 'q-market-2',
          category: 'marketplace',
          question: 'Do payments occur inside Repeak?',
          answer: 'No. Repeak acts purely as an advisory pricing aggregator. Clicking "View listing" transfers you directly to the original seller’s marketplace checkout system where your purchase is securely processed under their platform guidelines.'
        },
        {
          id: 'q-sub-1',
          category: 'subscription',
          question: 'How does the free Pro trial operate?',
          answer: 'Our 7-day trial offers unrestricted access to premium platform suites like 1-minute alert cycles and the complete historic valuation catalog. You may pause, cancel, or modify your subscription status instantly without penalty.'
        },
        {
          id: 'q-sub-2',
          category: 'subscription',
          question: 'Which payment mechanisms do you accept?',
          answer: 'We support all major credit cards including Visa, Mastercard, American Express, alongside secure checkouts via standard digital wallets and Klarna mocks.'
        },
        {
          id: 'q-sub-3',
          category: 'subscription',
          question: 'How do I cancel my plan?',
          answer: 'You can terminate active billing with a single click in your "My Account" settings panel. Subscription access will remain functional until the end of your billing cycle.'
        },
        {
          id: 'q-safety-1',
          category: 'safety',
          question: 'How does the AI detect counterfeit items?',
          answer: 'Our deep-learning visual scanners inspect listing metadata, photo fidelity indicators, and seller transaction scorecards. If severe anomalies appear, safety alarms prompt cautious inspection.'
        },
        {
          id: 'q-safety-2',
          category: 'safety',
          question: 'What is the Repeak AI Deal Tag?',
          answer: 'Our algorithm crawls hundreds of thousand historic sales listings to estimate real fair values. If a live option is priced significantly lower than average we tag it a "Bargain!". If it exceeds expectations, we alert you of overpriced margins.'
        }
      ];
    }
  }, [language]);

  const filteredFaqs = useMemo(() => {
    return faqList.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [faqList, activeCategory, searchQuery]);

  const toggleOpen = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-12 relative">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />

      {/* Hero Header Search */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pt-12 pb-16 text-center relative z-10">
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#3cbd82] uppercase bg-[#153a2a]/30 border border-[#3cbd82]/20 px-3 py-1.5 rounded-full font-bold mb-4 inline-block">
          {language === 'SV' ? 'REPEAK KUNDMOTTAGNING' : 'FAQ KNOWLEDGE HUB'}
        </span>
        <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight text-white mb-6">
          {language === 'SV' ? 'Hur kan vi hjälpa dig?' : 'How can we help you today?'}
        </h1>

        {/* Live Search Questions Input */}
        <div className="relative max-w-xl mx-auto mb-8 shadow-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-white/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'SV' ? 'Sök efter frågor (t.ex. provperiod, Tradera)...' : 'Search questions (e.g. trial, Tradera)...'}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#3cbd82]/60 focus:bg-[#3cbd82]/5 placeholder-white/30 transition-all font-sans"
          />
        </div>

        {/* Categories Tab Control */}
        <div className="flex flex-wrap justify-center items-center gap-2 max-w-2xl mx-auto font-sans">
          {(Object.keys(categories) as Array<keyof typeof categories>).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#3cbd82] text-[#091a11]'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {categories[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordions List */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-6 relative z-10">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-2xl p-8">
            <AlertCircle className="w-10 h-10 text-white/30 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white mb-1.5">
              {language === 'SV' ? 'Hittade inga matchande svar' : 'No matching answers found'}
            </h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              {language === 'SV' 
                ? 'Prova att söka efter ett sökord som "bevakning", "pris" eller "äkerhet".' 
                : 'Try searching for an alternative phrase like "bevakning", "safeties", or "alert".'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div 
                  key={faq.id} 
                  className={`bg-[#0a0a0c]/90 border rounded-2xl overflow-hidden transition-all duration-300 font-sans ${
                    isOpen ? 'border-white/15 shadow-xl' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <button
                    onClick={() => toggleOpen(faq.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${isOpen ? 'text-[#3cbd82]' : 'text-white/40'}`} />
                      <span className="text-sm font-semibold text-white tracking-tight leading-snug">{faq.question}</span>
                    </div>
                    <span className={`p-1 rounded-lg bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#3cbd82]' : 'text-white/40'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-6 pt-1 border-t border-white/5 text-xs text-white/60 leading-relaxed font-light font-sans ml-8 pl-0">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Live Helper Ticket Box */}
      <section className="max-w-xl mx-auto px-4 md:px-6 py-16 text-center relative z-10 mt-6">
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#3cbd82]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-5 h-5 text-[#3cbd82]" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-display">
            {language === 'SV' ? 'Hittade du inte svaret du sökte?' : 'Still have questions?'}
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto mb-5 leading-normal font-light">
            {language === 'SV' 
              ? 'Kontakta vår trevliga support genom att skicka ett meddelande direkt via kontaktformuläret.' 
              : 'Our customer support experts are available to consult on specialized fashion search needs.'}
          </p>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl bg-white/5 text-white text-xs font-bold border border-white/15 hover:bg-[#3cbd82]/10 hover:border-[#3cbd82]/40 hover:text-white transition-all cursor-pointer font-sans inline-block"
          >
            {language === 'SV' ? 'Kontakta oss' : 'Inquire support'}
          </Link>
        </div>
      </section>
    </div>
  );
}
