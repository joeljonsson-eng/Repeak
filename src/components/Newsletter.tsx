import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 px-4 bg-[#399a6f] relative overflow-hidden transition-all duration-300">
      {/* Background organic noise or patterns */}
      <div className="absolute inset-0 bg-[#358c65] opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        
        {/* Email Envelope icon from screenshot 3 */}
        <div className="flex justify-center flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#f2a11b] flex items-center justify-center text-neutral-950 shadow-2xl relative">
            <Mail className="w-7 h-7 text-neutral-950 stroke-[2.5px]" />
            <div className="absolute inset-0 bg-[#f2a11b]/25 rounded-2xl blur-lg animate-pulse" />
          </div>
        </div>

        {/* Text rows */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display text-white">
            {t.newsletter.title}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto font-medium">
            {t.newsletter.subtitle}
          </p>
        </div>

        {/* Input box + Yellow Subscribe button */}
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
               <motion.form
                key="subscribe-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 bg-black/15 p-2 rounded-2xl border border-white/10"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  required
                  className="flex-1 bg-black/60 text-white placeholder-white/40 text-sm py-3.5 px-5 rounded-xl outline-none focus:ring-1 focus:ring-[#3cd882] transition-all font-sans font-medium"
                />
                
                {/* Yellow-orange button from screenshot 3 */}
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#f2a11b] hover:bg-[#e0920d] text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 shrink-0 cursor-pointer"
                >
                  {t.newsletter.btn}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="subscribe-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/20 border border-white/20 p-6 rounded-2xl text-white font-sans text-sm space-y-2 flex flex-col items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-white mb-2" />
                <span className="font-bold text-base">{t.newsletter.successTitle}</span>
                <span className="text-white/80 font-light">{t.newsletter.successSubtitle}</span>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-bold text-white underline hover:opacity-80 font-sans"
                >
                  {t.newsletter.subscribeAnother}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
