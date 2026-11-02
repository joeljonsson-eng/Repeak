import React from 'react';
import { Shield, CheckCircle, ArrowDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Privacy() {
  const { language } = useLanguage();

  const content = {
    SV: {
      title: 'Integritetspolicy & Cookies',
      subtitle: 'Våra data- och säkerhetsåtaganden för en transparent andrahandsmarknad.',
      intro: 'Repeak AB ("vi", "oss" eller "vår") värnar om din personliga integritet och eftersträvar högsta säkerhetsnivå. Denna policy redogör för vår insamling, kryptering och bearbetning av data under GDPR.',
      sections: [
        {
          title: '1. Information vi samlar in',
          desc: 'När du registrerar ett konto, startar en provperiod eller aktiverar sökbevakningar lagrar vi din e-postadress, föredragna plagg, prisgränser och storleksprofiler. Detta krävs för att kalibrera våra sökklienter och ge dig exakta fyndnotiser.'
        },
        {
          title: '2. Hur vi använder din data',
          desc: 'Dina kunddata används för att driva och optimera tjänsten, skicka fyndmeddelanden via e-post, och beräkna korrekta genomsnittspriser baserat på historik.'
        },
        {
          title: '3. Datasäkerhet och lagring',
          desc: 'All information sparas krypterat i säkra molndatabaser i Europa governed by modern security architectures. Vi behåller dina uppgifter endast så länge ditt konto är aktivt eller tills du begär borttagning.'
        },
        {
          title: '4. Cookiepolicy och analys',
          desc: 'Vi använder cookies (små textfiler på din lokala disk) för att behålla ditt tillstånd som Joel och minnas dina språkval. Du kan inaktivera cookies i webbläsaren, men vissa sök- och bevakningsfunktioner kan då sluta fungera.'
        }
      ]
    },
    EN: {
      title: 'Privacy Policy & Cookies',
      subtitle: 'Our data rules, privacy declarations, and security arrangements.',
      intro: 'Repeak AB ("we", "us", or "our") deeply respects personal privacy. This statement outlines how your coordinates are processed, encrypted, and backed up in compliance with GDPR guidelines.',
      sections: [
        {
          title: '1. Information We Collect',
          desc: 'When you create a profile, launch a trial, or register watchlists, we store email, target sizes, budget ceilings, and brand preferences. This calibrated metadata is needed to run background tracking crawlers effectively.'
        },
        {
          title: '2. How We Deploy Data',
          desc: 'Data is strictly used to run correct alerting pipelines, calculate fair market averages, and prevent cyber abuse or counterfeit sales on the platform.'
        },
        {
          title: '3. Cloud Encryptions & Hardware',
          desc: 'We encrypt credentials inside protected EU cloud data silos. We preserve profile records for the minimum required window to power alerts or until account termination.'
        },
        {
          title: '4. Cookie Declarations and Analytics',
          desc: 'We deploy browser cookie indicators to remember you are logged in and retain localized layout translations. Disabling cookies from preferences may limit background matching systems.'
        }
      ]
    }
  };

  const activeContent = language === 'SV' ? content.SV : content.EN;

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-16 relative font-sans">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />

      <section className="max-w-3xl mx-auto px-4 md:px-6 pt-12 relative z-10 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#3cbd82]/10 border border-[#3cbd82]/25">
            <Shield className="w-6 h-6 text-[#3cbd82]" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#3cbd82] uppercase bg-[#153a2a]/30 px-2 py-0.5 rounded font-bold">
              GDPR REGULATED
            </span>
            <h1 className="text-2xl md:text-4xl font-black font-sans text-white tracking-tight mt-1">
              {activeContent.title}
            </h1>
          </div>
        </div>

        <p className="text-white/50 text-[11px] font-mono mt-1 mb-8">
          {language === 'SV' ? 'SENAST UPPDATERAD: 3 JUNI 2026' : 'LAST UPDATED: JUNE 3, 2026'}
        </p>

        {/* Intro */}
        <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-10 border-l-2 border-[#3cbd82] pl-4 italic bg-white/[0.01] py-4.5 rounded-r-xl pr-4">
          {activeContent.intro}
        </p>

        {/* Sections */}
        <div className="space-y-8 bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl">
          {activeContent.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2 pb-6 border-b border-white/5 last:border-0 last:pb-0">
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <span className="text-[#3cbd82] font-mono">▸</span>
                {sec.title}
              </h3>
              <p className="text-white/60 text-xs leading-relaxed font-light pl-4 font-sans">
                {sec.desc}
              </p>
            </div>
          ))}

          {/* Accept / Consent */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs flex justify-between items-center flex-wrap gap-4 mt-8">
            <span className="text-white/40">{language === 'SV' ? 'Genom att fortsätta använda Repeak godkänner du detta.' : 'By crawling the index, you fully consent with GDPR rules.'}</span>
            <div className="flex items-center gap-1.5 text-[#3cbd82] font-mono text-[10px] uppercase font-bold bg-[#3cbd82]/10 border border-[#3cbd82]/30 px-2 py-1 rounded">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{language === 'SV' ? 'GODKÄND' : 'COMPLIANT'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
