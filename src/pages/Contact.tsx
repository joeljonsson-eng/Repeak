import React, { useState } from 'react';
import { Mail, Send, CheckCircle, HelpCircle, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { trackEvent } from '../lib/analytics';

export default function Contact() {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('support');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError(
        language === 'SV' 
          ? 'Vänligen fyll i samtliga fält innan du skickar.' 
          : 'Please complete all fields before sending your inquiry.'
      );
      return;
    }
    setError('');
    setIsSubmitted(true);
    trackEvent('user_contact_submit', { topic, name, email });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-12 relative font-sans">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />

      {/* Main Container */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Pitch Info & Cards Column */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#3cbd82] uppercase bg-[#153a2a]/30 border border-[#3cbd82]/20 px-3 py-1 rounded-full font-bold inline-block">
                {language === 'SV' ? 'KONTAKT' : 'GET IN TOUCH'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black font-sans text-white tracking-tight leading-none">
                {language === 'SV' ? 'Prata med oss' : 'Connect with our team'}
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-light font-sans max-w-sm leading-relaxed">
                {language === 'SV' 
                  ? 'Har du frågor, förslag på integrationer eller behöver du hjälp med ditt medlemskap? Skicka ett medelande så återkommer vi inom 24 timmar.' 
                  : 'Have questions, system feedback, or partnership suggestions? Dispatch a ticket direct and we will consult on your query within 24 hours.'}
              </p>
            </div>

            {/* Quick Contact Points */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#3cbd82]" />
                </div>
                <div>
                  <div className="text-white/40 font-mono text-[9px] uppercase">EMAIL</div>
                  <div className="text-white font-medium">support@repeak.se</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#3cbd82]" />
                </div>
                <div>
                  <div className="text-white/40 font-mono text-[9px] uppercase">PHONE</div>
                  <div className="text-white font-medium">+46 (0) 8 410 200 11</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#3cbd82]" />
                </div>
                <div>
                  <div className="text-white/40 font-mono text-[9px] uppercase">OFFICE</div>
                  <div className="text-white font-medium">Stockholm, Sweden</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Layout Card Form (Right) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0a0a0c]/80 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              {isSubmitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-[#3cbd82]/10 border border-[#3cbd82]/20 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-8 h-8 text-[#3cbd82]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">
                      {language === 'SV' ? 'Tack för ditt meddelande!' : 'Message Dispatched Successfully!'}
                    </h2>
                    <p className="text-xs text-white/50 mt-2 max-w-sm mx-auto leading-relaxed">
                      {language === 'SV' 
                        ? 'Vi har tagit emot din förfrågan. Våra handläggare underhåller listor dygnet runt och återkopplar inom kort till din angivna e-post.' 
                        : 'Your inquiry coordinates have been indexed. Our platform coordinators will review the request and get back shortly via email.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setName('');
                      setEmail('');
                      setMessage('');
                      setIsSubmitted(false);
                    }}
                    className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {language === 'SV' ? 'Skicka ett till' : 'Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5 text-left">
                  <h3 className="text-base font-bold text-white font-sans border-b border-white/5 pb-3 mb-2">
                    {language === 'SV' ? 'Skicka ett support-ärende' : 'Support Ticket Submission'}
                  </h3>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2.5 px-4 rounded-lg mb-4 text-center">
                      {error}
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-white/40 uppercase mb-1.5">
                      {language === 'SV' ? 'Ditt fullständiga namn' : 'Your full name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Joel Jonsson"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#3cbd82]/60 focus:bg-[#3cbd82]/5"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-white/40 uppercase mb-1.5">
                      {language === 'SV' ? 'E-postadress' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="joel.jonsson@student.ksgyf.se"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#3cbd82]/60 focus:bg-[#3cbd82]/5"
                    />
                  </div>

                  {/* Topic Select */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-white/40 uppercase mb-1.5">
                      {language === 'SV' ? 'Ämne / Kategori' : 'Topic Categories'}
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-[#0a0f0d] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#3cbd82]/60 focus:bg-[#3cbd82]/5 text-left"
                    >
                      <option value="support">{language === 'SV' ? 'Kundsupport & Hjälp' : 'Customer Support & Help'}</option>
                      <option value="billing">{language === 'SV' ? 'Abonnemang & Fakturering' : 'Subscriptions & Billing'}</option>
                      <option value="partnership">{language === 'SV' ? 'Partnerskap & Integrationer' : 'Partnerships & Integrations'}</option>
                      <option value="abuse">{language === 'SV' ? 'Rapportera fusk/missbruk' : 'Report Abuse/Counterfeit'}</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-white/40 uppercase mb-1.5">
                      {language === 'SV' ? 'Meddelande / ÄrendeBeskrivning' : 'Message Details'}
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={language === 'SV' ? 'Skriv ditt meddelande här...' : 'State your question or issue parameters...'}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#3cbd82]/60 focus:bg-[#3cbd82]/5 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#3cbd82] text-black text-xs font-bold transition-all shadow-[0_4px_12px_rgba(59,189,130,0.15)] cursor-pointer hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>{language === 'SV' ? 'Skicka förfrågan' : 'Send Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
