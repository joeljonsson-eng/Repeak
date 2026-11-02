import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Terms() {
  const { language } = useLanguage();

  const content = {
    SV: {
      title: 'Användarvillkor',
      subtitle: 'Våra spelregler och avtal för en transparent andrahandsmarknad.',
      intro: 'Genom att använda Repeaks söktjänster eller registrera dig som Pro-medlem förklarar du dig införstådd med och bunden av följande villkorsstruktur. Vänligen läs igenom dem omsorgsfullt.',
      sections: [
        {
          title: '1. Godtagbar användning',
          desc: 'Repeak är en jämförelseportal avsedd för hushåll och oberoende samlare. Automatiserad inhämtning (screen scraping) av vår prishistorik eller databaser är strikt förbjudet utan föregående skriftlig auktorisation.'
        },
        {
          title: '2. Tjänstens natur',
          desc: 'Vi sammanställer och söker externa marknadsplatslager i realtid. Repeak är INTE säljaren eller part i externa affärer. Vi friskriver oss från transaktionsrisker, skador under frakt, eller felaktiga skickbeskrivningar på externa sajter.'
        },
        {
          title: '3. Abonnemang & Uppgradering',
          desc: 'Basfunktioner är och förblir helt gratis. Den betalda PRO-prenumerationen förnyas månadsvis eller årligen. Du kan när som helst under "Mitt konto" (Inställningar) avsluta din Pro-bevakning med ett klick utan dröjsmål.'
        },
        {
          title: '4. Ansvarsbegränsning',
          desc: 'Våra AI-estimat och kapfaktor-bedömningar är rådgivande vägledningar. Repeak påtar sig inget finansiellt ansvar för eventuella personliga köpbeslut orsakade av våra index och benchmarks.'
        }
      ]
    },
    EN: {
      title: 'Terms of Service',
      subtitle: 'Terms, rules, and provisions for safe circular sourcing.',
      intro: 'By accessing or querying Repeak, you agree to be fully bound under the terms set out below. Please read these guidelines thoroughly before utilizing alert watchlists or completing Pro registration.',
      sections: [
        {
          title: '1. Acceptable Utilization',
          desc: 'Repeak is a comparative consumer search utility. System scraping, content harvesting, or crawling of our pricing statistics is strictly forbidden without our prior written consent.'
        },
        {
          title: '2. Scope of Service',
          desc: 'We map third-party marketplace data live. We are not a broker or direct vendor. We carry no responsibility for shipping delays, inaccurate descriptions, payment issues, or modifications made on partner checkout pages.'
        },
        {
          title: '3. Billing & Trial Provisions',
          desc: 'Standard fashion compares remain free of charge. Pro memberships refresh on a monthly or annual billing slate. You can pause or cancel your active alerts with a single click from the settings control panel.'
        },
        {
          title: '4. Absolute Disclaimer of Liability',
          desc: 'Our neural deal indicators are advisory calculations based on historic listings. Repeak does not assume transaction liability, financial risk, or legal responsibility for buying trades inspired by our catalog.'
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
            <FileText className="w-6 h-6 text-[#3cbd82]" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#3cbd82] uppercase bg-[#153a2a]/30 px-2 py-0.5 rounded font-bold">
              PLATFORM COMPACT
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
            <span className="text-white/40">{language === 'SV' ? 'Användandet av Repeak regleras under dessa villkor.' : 'Usage of the Repeak index constitutes automatic validation under these compacts.'}</span>
            <div className="flex items-center gap-1.5 text-[#3cbd82] font-mono text-[10px] uppercase font-bold bg-[#3cbd82]/10 border border-[#3cbd82]/30 px-2 py-1 rounded">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{language === 'SV' ? 'AKTIV' : 'ACTIVE'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
