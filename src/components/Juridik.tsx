import React, { useState, useEffect } from 'react';
import { Shield, FileText, CheckCircle, Cookie, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Juridik() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let matchedTab: 'privacy' | 'terms' | 'cookies' | null = null;
      if (hash === '#juridik-terms') {
        matchedTab = 'terms';
      } else if (hash === '#juridik-privacy' || hash === '#juridik') {
        matchedTab = 'privacy';
      } else if (hash === '#juridik-cookies') {
        matchedTab = 'cookies';
      }
      
      if (matchedTab) {
        setActiveTab(matchedTab);
        const element = document.getElementById('juridik');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Let's run a short timeout to let the page fully render before jumping on direct link
    const timer = setTimeout(handleHashChange, 100);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(timer);
    };
  }, []);

  const content = {
    SV: {
      title: 'Juridisk information',
      subtitle: 'Våra policyer, användarvillkor och integritetsåtaganden för en transparent och säker andrahandsmarknad.',
      tabs: {
        privacy: 'Integritetspolicy',
        terms: 'Användarvillkor',
        cookies: 'Cookiepolicy',
      },
      lastUpdated: 'Senast uppdaterad: 3 juni 2026',
      privacy: {
        title: 'Integritetspolicy',
        intro: 'Repeak AB ("vi", "oss" eller "vår") värnar om din personliga integritet. Denna policy beskriver hur vi samlar in, använder, skyddar och delar din personliga information när du använder vår sök- och jämförelsetjänst.',
        sections: [
          {
            title: '1. Information vi samlar in',
            desc: 'När du registrerar ett konto, startar en provperiod eller använder vår sökportal lagrar vi information såsom din e-postadress, föredragna storlekar, prispreferenser och sökbevakningar. Vi sparar även sökord, uppladdade bilder för bildsökning samt historiska interaktionsdata för att kalibrera våra AI-värderingar.'
          },
          {
            title: '2. Hur vi använder din data',
            desc: 'Din information används för att leverera och förbättra tjänsten: skicka matchande prisfyndnotiser via e-post, beräkna genomsnittliga marknadspriser med statistisk noggrannhet, samt upptäcka och blockera misstänkta bedrägerier.'
          },
          {
            title: '3. Datasäkerhet och lagring',
            desc: 'Vi lagrar din data krypterat i säkra molndatabaser i Europa (med primär lagring i Firestore med hårda behörighetsregler). Vi behåller endast dina data så länge det är nödvändigt för att uppfylla de ändamål som beskrivs i denna policy eller tills du begär att kontot raderas.'
          },
          {
            title: '4. Tredjepartsdelning',
            desc: 'Vi delar aldrig dina personuppgifter med obehöriga tredjeparter. Datan används uteslutande internt. När du klickar på en extern länk för att köpa ett plagg på exempelvis Tradera eller Vinted, gäller den plattformens egna integritetspolicy.'
          }
        ]
      },
      terms: {
        title: 'Användarvillkor',
        intro: 'Genom att använda Repeak samtycker du till att följa och bindas av följande användarvillkor. Vänligen läs dem noggrant innan du startar din sökbevakning eller tecknar en prenumeration.',
        sections: [
          {
            title: '1. Godtagbar användning',
            desc: 'Repeak är en jämförelsetjänst för konsumenter och hobbysamlare. Automatiserad dataextraktion (scraping) av vår portal eller vårt trendindex är strikt förbjudet utan föregående skriftligt tillstånd från oss.'
          },
          {
            title: '2. Tjänstens natur',
            desc: 'Vi skannar och sammanställer annonser från externa plattformar i realtid. Vi är inte ansvariga för felaktigheter i externa annonser, prisförändringar på externa sidor, uteblivna leveranser, eller felaktigt beskrivet skick på de plagg du köper på externa sajter.'
          },
          {
            title: '3. Prenumerationer & PRO-konton',
            desc: 'Repeaks basversion är helt kostnadsfri. PRO-prenumerationer förnyas månadsvis eller årligen och kan när som helst avslutas med ett klick via din kontopanel. Vid avslutsbegäran löper tillgången vidare t.o.m. slutet av den betalda perioden.'
          },
          {
            title: '4. Ansvarsbegränsning',
            desc: 'Våra AI-baserade marknadsvärderingar är rådgivande uppskattningar baserade på historisk och levande annonsdata. Repeak påtar sig inget ekonomiskt ansvar för felaktiga värderingar eller affärsbeslut fattade baserat på våra index.'
          }
        ]
      },
      cookies: {
        title: 'Cookiepolicy',
        intro: 'Repeak använder cookies och liknande spårningstekniker för att förbättra din navigeringsupplevelse, komma ihåg dina språkinställningar och analysera trafiken på vår sajt.',
        sections: [
          {
            title: 'Vad är cookies?',
            desc: 'En cookie är en liten textfil som sparas på din dator, mobil eller surfplatta när du besöker en webbplats. Den tillåter oss att identifiera din webbläsare, komma ihåg att du är inloggad som Joel och ladda dina sökningar blixtsnabbt.'
          },
          {
            title: 'Hur vi använder dem',
            desc: 'Vi använder nödvändiga cookies för sessionhantering och språkval, samt analytiska cookies (via Google Analytics integrationsskript) för att anpassa gränssnittet, mäta klickhastighet och identifiera flaskhalsar.'
          },
          {
            title: 'Hantera dina preferenser',
            desc: 'Du kan stänga av cookies helt i din webbläsares säkerhetsinställningar. Observera att vissa viktiga funktioner som personliga sökbevakningar eller aktiv provperiodsregistrering då kan sluta fungera korrekt.'
          }
        ]
      }
    },
    EN: {
      title: 'Legal Information',
      subtitle: 'Our terms, privacy blueprints, and cookie declarations built to guarantee a transparent and trustworthy secondhand system.',
      tabs: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Use',
        cookies: 'Cookie Policy',
      },
      lastUpdated: 'Last updated: June 3, 2026',
      privacy: {
        title: 'Privacy Policy',
        intro: 'Repeak AB ("we", "us", or "our") deeply respects your personal privacy. This policy outlines how we collect, process, protect, and share your personal data when using our search aggregator.',
        sections: [
          {
            title: '1. Information We Collect',
            desc: 'When you create an account, register for a trial, or use our search system, we store email coordinates, sizing profiles, price limits, and active alarms. We also save query telemetry and uploaded images to calibrate and fine-tune our custom AI grading models.'
          },
          {
            title: '2. How We Process Data',
            desc: 'Data is strictly utilized to deliver and polish the application: transmitting real-time deal alerts, generating precise market benchmark estimates, and blocking cyber threats or fake listings.'
          },
          {
            title: '3. Data Security & Storage',
            desc: 'Your credentials are kept encrypted inside resilient database architectures in Europe (primarily Google Cloud Firestore governed by strict authorization schemas). We retain logs only for the duration required to power active streams or until you request a permanent dump.'
          },
          {
            title: '4. Third-Party Disclosures',
            desc: 'We do not sell or lease profile analytics to commercial third parties. When buying an item via an outgoing partner link (such as Tradera or Vinted), your interactions become bound to that target marketplace\'s own privacy rules.'
          }
        ]
      },
      terms: {
        title: 'Terms of Use',
        intro: 'By accessing or utilizing Repeak, you fully agree to comply with and be bound by the following terms. Please read these agreements thoroughly before establishing search monitors.',
        sections: [
          {
            title: '1. Acceptable Use',
            desc: 'Repeak is a direct-to-consumer price index. Automated system extraction, screen scraping, or visual harvesting of our trend matrix and assets is explicitly prohibited without explicit prior written authorization.'
          },
          {
            title: '2. Scope of Service',
            desc: 'We consolidate listings from around the web on an "as-is" basis. We are not a direct sales vendor and hold no liability for discrepancies in listing descriptions, condition issues, shipping failures, or pricing edits made on external sites.'
          },
          {
            title: '3. Subscription Tiers & PRO Accounts',
            desc: 'Basic search feeds are 100% free. PRO subscriptions renew automatically on a recurring monthly or annual basis. You can pause or terminate billing instantly in a single click from your setting panel.'
          },
          {
            title: '4. Disclaimer of Liability',
            desc: 'Our AI evaluations are advisory estimates calculated using historic and current listings. Repeak does not assume financial responsibility or transaction liability for any purchasing decisions made using our search database.'
          }
        ]
      },
      cookies: {
        title: 'Cookie Policy',
        intro: 'Repeak utilizes cookies and related storage mechanisms to save environment settings, retain language context, and evaluate traffic patterns.',
        sections: [
          {
            title: 'What Are Cookies?',
            desc: 'A cookie is a small physical text token saved on your storage hardware. It permits our web servers to recognize your specific session, preserve active login streams as Joel, and process instant UI transitions.'
          },
          {
            title: 'How We Deploy Them',
            desc: 'We utilize essential session tokens alongside analytical tags (via Google Analytics scripts) to measure server latencies, test layouts, and gauge traffic density safely.'
          },
          {
            title: 'Managing Settings',
            desc: 'You can disable cookie storage globally via your browser\'s native privacy settings. Please note that doing so might limit core features, alert feeds, or authenticated preferences.'
          }
        ]
      }
    }
  };

  const activeContent = language === 'SV' ? content.SV : content.EN;
  const currentDetails = activeTab === 'privacy' 
    ? activeContent.privacy 
    : activeTab === 'terms' 
      ? activeContent.terms 
      : activeContent.cookies;

  const renderIcon = () => {
    switch(activeTab) {
      case 'privacy': return <Shield className="w-6 h-6 text-[#3cbd82]" />;
      case 'terms': return <FileText className="w-6 h-6 text-[#3cbd82]" />;
      case 'cookies': return <Cookie className="w-6 h-6 text-[#3cbd82]" />;
    }
  };

  return (
    <section className="bg-[#050505] py-24 px-4 md:px-6 relative overflow-hidden border-t border-white/5 scroll-mt-24" id="juridik">
      {/* Decorative gradient orb for Scandinavian sleek styling */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Monospace Badge */}
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#3cbd82] uppercase bg-[#153a2a]/30 border border-[#3cbd82]/20 px-3 py-1 rounded-full font-bold mb-4 inline-block">
          {activeContent.tabs[activeTab].toUpperCase()}
        </span>
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-white mb-4">
          {activeContent.title}
        </h2>
        
        {/* Subtitle */}
        <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          {activeContent.subtitle}
        </p>

        {/* Tab Controls */}
        <div className="flex justify-center items-center gap-2 max-w-md mx-auto mb-12 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{activeContent.tabs.privacy}</span>
            <span className="sm:hidden">{language === 'SV' ? 'Integritet' : 'Privacy'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{activeContent.tabs.terms}</span>
            <span className="sm:hidden">{language === 'SV' ? 'Villkor' : 'Terms'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('cookies')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{activeContent.tabs.cookies}</span>
            <span className="sm:hidden">{language === 'SV' ? 'Cookies' : 'Cookies'}</span>
          </button>
        </div>

        {/* Document Panel */}
        <div className="bg-[#0a0a0c]/80 border border-white/10 rounded-2xl p-6 md:p-8 text-left shadow-2xl relative">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 select-none">
                {renderIcon()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans">{currentDetails.title}</h3>
                <p className="text-[10px] font-mono text-white/40 mt-0.5">{activeContent.lastUpdated}</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#3cbd82]/90 bg-[#3cbd82]/5 border border-[#3cbd82]/10 px-2 py-0.5 rounded">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{language === 'SV' ? 'SVERIGE REGULERAD' : 'GDPR COMPLIANT'}</span>
            </div>
          </div>

          {/* Intro Text */}
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-8 border-l-2 border-[#3cbd82] pl-4 italic">
            {currentDetails.intro}
          </p>

          {/* Sections List */}
          <div className="space-y-6">
            {currentDetails.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-white font-sans flex items-center gap-2">
                  <span className="text-[#3cbd82] font-mono">▸</span>
                  {sec.title}
                </h4>
                <p className="text-white/60 text-xs leading-relaxed font-normal pl-4 font-sans">
                  {sec.desc}
                </p>
              </div>
            ))}
          </div>

          {/* User Confirmation Banner */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div className="text-white/40 text-[11px] font-medium text-center sm:text-left font-mono">
              {accepted 
                ? (language === 'SV' ? '✓ DITT SAMTYCKE HAR REGISTRERATS' : '✓ YOUR CONSENT HAS BEEN REGISTERED')
                : (language === 'SV' 
                    ? 'Genom att använda portalen godkänner du detta automatiskt.' 
                    : 'Using the portal constitutes automatic acceptance of these terms.')}
            </div>
            
            {accepted ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/20 border border-[#3cbd82]/40 text-[#3cbd82] text-[11px] font-bold rounded-lg animate-pulse">
                <CheckCircle className="w-4 h-4 text-[#3cbd82]" />
                <span>{language === 'SV' ? 'Godkänd' : 'Consented'}</span>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => {
                  setAccepted(true);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer select-none active:scale-95"
              >
                {language === 'SV' ? 'Jag samtycker' : 'I Accept'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
