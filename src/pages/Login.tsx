import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, Key, User, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { trackEvent } from '../lib/analytics';

export default function Login() {
  const { language, isLoggedIn, login, logout } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to /account automatically
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/account');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(language === 'SV' ? 'Vänligen ange din e-post eller användarnamn.' : 'Please enter your email or username.');
      return;
    }
    if (password.length < 4) {
      setError(language === 'SV' ? 'Lösenordet måste vara minst 4 tecken.' : 'Password must be at least 4 characters.');
      return;
    }

    login(email);
    trackEvent('user_login_success', { username: email, path: '/login' });
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] flex items-center justify-center py-20 px-4 relative font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-white/2 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="bg-[#090e0c]/90 border border-white/10 rounded-2xl w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#3cbd82] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/10">
            <Shirt className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white font-sans tracking-tight">
            {language === 'SV' ? 'Välkommen till Repeak' : 'Sign in to Repeak'}
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-[260px] mx-auto leading-relaxed">
            {language === 'SV' 
              ? 'Ange dina inloggningsuppgifter för att öppna ditt sourcing-valv.' 
              : 'Enter your credentials to unlock your circular scouting cockpit.'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-x-400 text-xs py-2.5 px-3 rounded-lg mb-4 text-center flex items-center justify-center gap-1.5 text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4.5 text-left">
          <div>
            <label className="block text-[10px] font-mono tracking-wider text-white/40 uppercase mb-1.5 font-bold">
              {language === 'SV' ? 'E-post eller Användarnamn' : 'Email or Username'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-white/30">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Joel.jonsson"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9.5 pr-3 text-white text-xs focus:outline-none focus:border-[#3cbd82]/60 focus:bg-[#3cbd82]/5 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-wider text-white/40 uppercase mb-1.5 font-bold">
              {language === 'SV' ? 'Lösenord' : 'Password'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-white/30">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9.5 pr-3 text-white text-xs focus:outline-none focus:border-[#3cbd82]/60 focus:bg-[#3cbd82]/5 font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#3cbd82] text-black text-xs font-black transition-all shadow-[0_4px_12px_rgba(59,189,130,0.15)] cursor-pointer hover:opacity-90 active:scale-[0.98] mt-2 font-sans tracking-wider uppercase"
          >
            {language === 'SV' ? 'Logga in' : 'Log In'}
          </button>
        </form>

        {/* Demo helpers */}
        <div className="mt-6 pt-5 border-t border-white/5 text-center">
          <div className="text-[10px] text-white/30 leading-relaxed font-light">
            <span className="text-[#3cbd82] font-semibold">{language === 'SV' ? 'Demo-konto: ' : 'Demo credentials: '}</span>
            <span>Joel.jonsson / admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
