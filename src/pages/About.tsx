import React from 'react';
import { Shirt, Cpu, Target, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function About() {
  const { language } = useLanguage();

  const values = [
    {
      icon: Compass,
      title: language === 'SV' ? 'Frictionless Sökning' : 'Frictionless Search',
      desc: language === 'SV' 
        ? 'Genom att sammanställa alla separata andrahandsapplikationer underlättar vi cirkulära sökflöden och sparar tid.' 
        : 'By normalizing multi-platform inventory structures, we reduce search fatigue, helping user routines thrive.'
    },
    {
      icon: Cpu,
      title: language === 'SV' ? 'Oberoende AI-analys' : 'Independent AI Diagnostics',
      desc: language === 'SV' 
        ? 'Vårt lojalitetsåtagande ligger hos konsumenten. Vi fastställer äkta oberoende marknadsgenomsnitt utan partiskhet.' 
        : 'We deliver objective benchmark figures and authenticity alerts constructed strictly to protect consumer interests.'
    },
    {
      icon: Target,
      title: language === 'SV' ? 'Hållbar Modekonsumtion' : 'Sustainable Fashion circularity',
      desc: language === 'SV' 
        ? 'Vi förlänger plaggs biologiska livscyklar genom att göra det så enkelt som möjligt att välja andrahandsmode i första hand.' 
        : 'We amplify green practices by making preloved designer and street fashion the first, natural choice.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-12 relative font-sans">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />

      {/* Hero Grid Block */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span- così lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#3cbd82] uppercase bg-[#153a2a]/30 border border-[#3cbd82]/20 px-3 py-1 rounded-full font-bold inline-block">
              {language === 'SV' ? 'VÅR HISTORIA' : 'OUR MOOD'}
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-sans text-white tracking-tight leading-[1.1]">
              {language === 'SV' ? 'Vi förenar den splittrade marknaden' : 'Unifying the preloved universe'}
            </h1>
            <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-light font-sans max-w-xl">
              {language === 'SV' 
                ? 'Andrahandsmarknaden är en fantastisk rörelse av miljövänlighet och vintagefynd, men den har blivit extremt fragmenterad. Med dussintals appar som tvingar konsumenter att genomföra samma sökningar om och om igen dog enkelheten.' 
                : 'Secondhand fashion is an amazing force for circular sustainability, yet the shopping experience has grown frustratingly fragmented. Relying on dozens of independent services forcing shoppers to repeat queries again and again ruined the magic.'}
            </p>
            <p className="text-white/60 text-xs sm:text-sm font-light font-sans max-w-xl">
              {language === 'SV' 
                ? 'Repeak föddes ur en vision att samla varenda skandinavisk andrahandsannons under ett och samma tak, förstärkt med intelligenta AI-drivna prissignaler så att användare alltid vet om de betalar ett rättvist pris.' 
                : 'Repeak was founded on a simple vision: combining all European secondhand inventories inside a beautiful unified layout integrated with autonomous AI valuations, guaranteeing people always discover what is fair.'}
            </p>
          </div>

          {/* Graphical Nordic Styling Card */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[300px]">
            <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-[#3cbd82]/5 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-[#3cbd82] flex items-center justify-center">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-[#3cbd82] uppercase border border-[#3cbd82]/20 px-1.5 py-0.5 rounded font-bold bg-[#153a2a]/40">
                NORDIC DESIGN
              </span>
            </div>

            <div className="space-y-2 mt-8 text-left">
              <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider">REPEAK METRICS</h3>
              <div className="grid grid-cols-2 gap-4 pt-1 font-mono">
                <div>
                  <div className="text-xl font-black text-white">200K+</div>
                  <div className="text-[10px] text-white/40 uppercase">{language === 'SV' ? 'Skannade objekt' : 'Indexed listings'}</div>
                </div>
                <div>
                  <div className="text-xl font-black text-white">1 min</div>
                  <div className="text-[10px] text-white/40 uppercase">{language === 'SV' ? 'Notishastighet' : 'Alert Latency'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 border-t border-white/5 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white font-sans">
            {language === 'SV' ? 'Våra ledstjärnor' : 'Our Foundations'}
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1 max-w-sm mx-auto">
            {language === 'SV' ? 'Omsorgsfullt utformade principer som vägleder vårt gränssnitt.' : 'Carefully drafted values shaping every search algorithm.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6.5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Icon className="w-4.5 h-4.5 text-[#3cbd82]" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 font-sans">{v.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-16 border-t border-white/5 relative z-10 text-center">
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white font-sans">
            {language === 'SV' ? 'Grundarna bakom Repeak' : 'Our Team'}
          </h2>
          <p className="text-xs text-white/50 mt-1">
            {language === 'SV' ? 'Ett nischat team med passion för hållbarhet och AI.' : 'Modest tech creators pushing the boundaries of circular fashion.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {/* Member 1 */}
          <div className="space-y-3">
            <div className="aspect-square bg-gradient-to-tr from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl flex items-center justify-center p-4">
              <span className="text-4xl">🧑‍💻</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Joel Jonsson</h4>
              <p className="text-[10px] text-[#3cbd82] font-mono tracking-widest uppercase">CEO & Tech Architect</p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="space-y-3">
            <div className="aspect-square bg-gradient-to-tr from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl flex items-center justify-center p-4">
              <span className="text-4xl">🎨</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Astrid Lind</h4>
              <p className="text-[10px] text-[#3cbd82] font-mono tracking-widest uppercase">Product Designer</p>
            </div>
          </div>

          {/* Member 3 */}
          <div className="space-y-3">
            <div className="aspect-square bg-gradient-to-tr from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl flex items-center justify-center p-4">
              <span className="text-4xl">📊</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nils Berg</h4>
              <p className="text-[10px] text-[#3cbd82] font-mono tracking-widest uppercase">AI Data Scientist</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
