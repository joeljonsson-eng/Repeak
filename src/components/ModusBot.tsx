import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, User, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function ModusBot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  // Dynamic theme listener
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(document.documentElement.classList.contains('light-mode') ? 'light' : 'dark');
    };
    window.addEventListener('theme-change', handleThemeChange);

    // Also set up a MutationObserver on documentElement in case classes switch
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Suggested questions in SV and EN
  const suggestions = language === 'SV' 
    ? [
        "Hur fungerar Repeak?",
        "Vilka sajter söker ni på?",
        "Hur vet jag om ett pris är rimligt?",
        "Tips för Acne Studios & Ganni"
      ]
    : [
        "How does Repeak work?",
        "Which sites do you search?",
        "How do I know if a price is fair?",
        "Tips on Acne Studios & Ganni"
      ];

  // Set initial welcome message
  useEffect(() => {
    const welcomeText = language === 'SV'
      ? "Hej! Jag är Modus, din personliga AI-assistent på Repeak. 🌸 Jag hjälper dig gärna att hitta dolda retro-skatter, värdera dina plagg, förstå andrahandsmarknaden eller svara på alla frågor om hållbart mode. Vad funderar du på idag?"
      : "Hi! I'm Modus, your personal AI secondhand shopping assistant on Repeak. 🌸 I'm happy to help you find hidden vintage gems, calculate fashion values, navigate marketplaces, or chat about sustainable fashion. What are you looking for today?";
    
    setMessages([
      {
        id: 'initial',
        role: 'model',
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
  }, [language]);

  // Handle auto scrolling on new messages
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          language
        })
      });

      const data = await res.json();
      
      const botMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'model',
        text: data.reply || (language === 'SV' ? "Hoppsan! Något gick fel i min tankeprocess. Försök igen om en stund." : "Oops! Something went wrong in my logic tree. Please try again in a bit."),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("🔴 Modus assistance fetch error:", error);
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'model',
        text: language === 'SV' 
          ? "Det gick inte att ansluta ordentligt till min server-hjärna. Kontrollera internetförbindelsen och försök igen."
          : "Could not establish connection to my server backend. Verify your internet connection and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Pulse animation for helper notification
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  const isLight = theme === 'light';

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`w-[340px] sm:w-[380px] h-[500px] sm:h-[580px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border transition-all duration-300 ${
              isLight 
                ? 'bg-white border-slate-200/90 shadow-slate-200/50' 
                : 'bg-gradient-to-br from-[#0a0c0b] to-[#040404] border-[#3cbd82]/20'
            }`}
          >
            {/* Header Area */}
            <div className={`p-4 flex items-center justify-between border-b transition-all duration-300 ${
              isLight 
                ? 'bg-gradient-to-r from-slate-50 to-white border-slate-100' 
                : 'bg-gradient-to-r from-[#0c0f0d] to-[#060807] border-white/5'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center relative border transition-all duration-300 ${
                  isLight 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-[#15803d]' 
                    : 'bg-[#3cbd82]/10 border-[#3cbd82]/30 text-[#3cbd82]'
                }`}>
                  <Bot className="w-5 h-5" />
                  <span className={`absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border transition-all ${
                    isLight 
                      ? 'bg-[#15803d] border-white' 
                      : 'bg-[#3cbd82] border-[#050505]'
                  }`} />
                </div>
                <div>
                  <h3 className={`text-sm font-black tracking-wide uppercase flex items-center gap-1.5 transition-all ${
                    isLight ? 'text-slate-800' : 'text-white'
                  }`}>
                    Modus
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider transition-all ${
                      isLight 
                        ? 'text-[#15803d] bg-emerald-100/40 border-emerald-200' 
                        : 'text-[#3cbd82]/80 bg-[#3cbd82]/10 border-[#3cbd82]/25'
                    }`}>
                      Helper Bot
                    </span>
                  </h3>
                  <p className={`text-[10px] font-light transition-all ${
                    isLight ? 'text-slate-500' : 'text-white/40'
                  }`}>
                    {language === 'SV' ? 'Online och redo att fyndhjälpa' : 'Online & ready to guide you'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleChat}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200' 
                    : 'bg-white/[0.03] border-white/5 text-white/50 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin transition-all duration-300 ${
              isLight 
                ? 'scrollbar-thumb-slate-200 bg-slate-50/50' 
                : 'scrollbar-thumb-white/10'
            }`}>
              {messages.map((msg) => {
                const isBot = msg.role === 'model';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${!isBot ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border uppercase text-[10px] font-black ${
                      isBot 
                        ? (isLight 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-[#15803d]' 
                            : 'bg-[#3cbd82]/10 border-[#3cbd82]/20 text-[#3cbd82]')
                        : (isLight 
                            ? 'bg-slate-100 border-slate-200 text-slate-600' 
                            : 'bg-white/[0.05] border-white/10 text-white/70')
                    }`}>
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 max-w-[78%]">
                      <div className={`p-3 rounded-xl border leading-relaxed text-xs font-light select-text transition-all ${
                        isBot 
                          ? (isLight 
                              ? 'bg-white border-slate-150 text-slate-800 shadow-sm' 
                              : 'bg-white/[0.01] border-white/5 text-white/90') 
                          : (isLight 
                              ? 'bg-emerald-600 border-emerald-600 text-white font-medium shadow-sm' 
                              : 'bg-[#3cbd82]/90 border-[#3cbd82] text-[#091a11]')
                      }`}>
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      </div>
                      <span className={`text-[9px] font-mono block px-1 ${
                        isLight ? 'text-slate-400' : 'text-white/30'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] font-black shrink-0 ${
                    isLight 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-[#15803d]' 
                      : 'bg-[#3cbd82]/10 border-[#3cbd82]/20 text-[#3cbd82]'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className={`p-3 rounded-xl max-w-[78%] border ${
                    isLight ? 'bg-white border-slate-150 shadow-sm' : 'bg-white/[0.01] border-white/5'
                  }`}>
                    <div className="flex items-center gap-1.5 px-1 py-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? 'bg-[#15803d]' : 'bg-[#3cbd82]/80'}`} style={{ animationDelay: '0ms' }} />
                      <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? 'bg-[#15803d]' : 'bg-[#3cbd82]/80'}`} style={{ animationDelay: '150ms' }} />
                      <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? 'bg-[#15803d]' : 'bg-[#3cbd82]/80'}`} style={{ animationDelay: '300ms', animationPlayState: 'running' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestions (Visible when not loading) */}
            {!isLoading && (
              <div className={`px-4 py-2 border-t transition-all ${
                isLight ? 'border-slate-100 bg-slate-50/70' : 'border-white/5 bg-white/[0.01]'
              } space-y-1.5`}>
                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-white/40'
                }`}>
                  <HelpCircle className={`w-3.5 h-3.5 ${isLight ? 'text-[#15803d]' : 'text-[#3cbd82]'}`} />
                  <span>{language === 'SV' ? 'FÖRESLAGNA FRÅGOR' : 'SUGGESTED TOPICS'}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(suggestion)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-light transition-all flex items-center justify-between group cursor-pointer ${
                        isLight 
                          ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-emerald-500/5 hover:border-[#15803d]/30 hover:pl-3.5' 
                          : 'bg-white/[0.02] border-white/5 text-white/70 hover:text-white hover:bg-[#3cbd82]/5 hover:border-[#3cbd82]/20 hover:pl-3.5'
                      }`}
                    >
                      <span className="truncate">{suggestion}</span>
                      <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-all shrink-0 ${
                        isLight ? 'text-[#15803d]' : 'text-[#3cbd82]'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Footer */}
            <form
              onSubmit={handleFormSubmit}
              className={`p-3 border-t bg-gradient-to-t flex gap-2 transition-all ${
                isLight 
                  ? 'border-slate-100 from-white to-transparent' 
                  : 'border-white/5 from-[#060807] to-transparent'
              }`}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={language === 'SV' ? 'Fråga Modus...' : 'Ask Modus...'}
                disabled={isLoading}
                className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all disabled:opacity-50 border ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#15803d]/50 focus:bg-white' 
                    : 'bg-white/[0.03] border-white/10 text-white placeholder-white/30 focus:border-[#3cbd82]/50'
                }`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-lg ${
                  isLight 
                    ? 'bg-[#15803d] hover:bg-[#116630] text-white disabled:bg-slate-200 disabled:text-slate-400 shadow-emerald-500/10' 
                    : 'bg-[#3cbd82] hover:bg-[#32a36f] text-[#050505] disabled:bg-white/5 disabled:text-white/20 shadow-[#3cbd82]/5'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button Widget */}
      <button
        type="button"
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative group ${
          isLight 
            ? 'bg-white border-slate-200 text-[#15803d] hover:text-[#116630] hover:border-[#15803d] hover:shadow-emerald-500/10' 
            : 'bg-gradient-to-br from-[#121915] to-[#0a0f0d] border-[#3cbd82]/30 text-[#3cbd82] hover:text-white hover:border-[#3cbd82] hover:shadow-[#3cbd82]/15'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center relative"
            >
              <Sparkles className="w-6 h-6" />
              {hasNewMessage && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-[#050505] animate-ping" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Decorative dynamic notification banner hovering on load */}
        {!isOpen && (
          <div className={`absolute right-16 top-1/2 -translate-y-1/2 border py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg ${
            isLight 
              ? 'bg-white border-slate-200 text-[#15803d]' 
              : 'bg-gradient-to-r from-[#0d1210] to-[#060807] border-[#3cbd82]/30 text-[#3cbd82]'
          }`}>
            <span className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              Chatta med Modus AI <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
