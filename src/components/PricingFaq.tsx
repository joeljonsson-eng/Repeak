import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface FaqItem {
  question: string;
  answer: string;
}

export default function PricingFaq() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: t.faq.q1,
      answer: t.faq.a1
    },
    {
      question: t.faq.q2,
      answer: t.faq.a2
    },
    {
      question: t.faq.q3,
      answer: t.faq.a3
    },
    {
      question: t.faq.q4,
      answer: t.faq.a4
    },
    {
      question: t.faq.q5,
      answer: t.faq.a5
    }
  ];

  return (
    <section className="py-24 px-4 max-w-4xl mx-auto border-t border-white/5 scroll-mt-24" id="faq">
      <div className="text-center mb-16 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#3cbd82] uppercase block font-mono">
          {t.faq.badge}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display text-white">
          {t.faq.title}
        </h2>
        <p className="text-white/50 text-xs sm:text-sm font-light">
          {t.faq.description}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
            >
              <button
                id={`faq-btn-${index}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-white/[0.01] cursor-pointer"
              >
                <span className="text-sm font-bold text-white/95 pr-4">
                  {faq.question}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180 text-[#3cbd82]' : ''
                }`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-5 pt-1 border-t border-white/5 text-xs md:text-sm text-white/60 leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

