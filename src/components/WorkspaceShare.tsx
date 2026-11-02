import React, { useState, useEffect } from 'react';
import { Mail, Search, Send, X, Check, Users, Sparkles, AlertTriangle, AlertCircle } from 'lucide-react';
import { googleSignIn, getCachedToken } from '../lib/workspaceAuth.ts';
import { fetchGoogleContacts, sendGmailEmail, ContactInfo } from '../lib/workspace.ts';

interface ListingToShare {
  title: string;
  price: string | number;
  marketplace: string;
  link: string;
  condition?: string;
}

interface WorkspaceShareProps {
  listing: ListingToShare;
  onClose: () => void;
  language: 'SV' | 'EN';
}

export default function WorkspaceShare({ listing, onClose, language }: WorkspaceShareProps) {
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactInfo[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<ContactInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Email template states
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [showConfirmSend, setShowConfirmSend] = useState(false);

  // Initialize authorization token
  useEffect(() => {
    const cached = getCachedToken();
    if (cached) {
      setToken(cached);
      setAuthorized(true);
      loadContacts(cached);
    }
  }, []);

  // Update email template details based on listing
  useEffect(() => {
    if (language === 'SV') {
      setSubject(`Modetips: Kap-fynd på ${listing.marketplace}! 🌟`);
      setMessageBody(
        `Hej!\n\nJag hittade ett grymt secondhand-fynd på <b>Repeak</b> som du kanske gillar!\n\n` +
        `<b>Plagg:</b> ${listing.title}\n` +
        `<b>Pris:</b> ${listing.price} kr\n` +
        `<b>Sajt:</b> ${listing.marketplace}\n` +
        `${listing.condition ? `<b>Skick:</b> ${listing.condition}\n` : ''}` +
        `<b>Länk till annons:</b> <a href="${listing.link}" target="_blank" style="color: #3cbd82; font-weight: bold; text-decoration: underline;">Se Annons Här</a>\n\n` +
        `Hoppas detta kan passa din garderob!\n\nMed vänlig hälsning`
      );
    } else {
      setSubject(`Fashion Alert: Epic Secondhand Deal on ${listing.marketplace}! 🌟`);
      setMessageBody(
        `Hi there!\n\nI just found an awesome circular fashion deal via <b>Repeak</b> that I thought you might appreciate!\n\n` +
        `<b>Item:</b> ${listing.title}\n` +
        `<b>Price:</b> ${listing.price} SEK\n` +
        `<b>Platform:</b> ${listing.marketplace}\n` +
        `${listing.condition ? `<b>Condition:</b> ${listing.condition}\n` : ''}` +
        `<b>Listing Link:</b> <a href="${listing.link}" target="_blank" style="color: #3cbd82; font-weight: bold; text-decoration: underline;">View Listing Here</a>\n\n` +
        `Hope it matches your style!\n\nBest regards`
      );
    }
  }, [listing, language]);

  // Load Google Contacts using token
  const loadContacts = async (accessToken: string) => {
    setLoadingContacts(true);
    try {
      const fetched = await fetchGoogleContacts(accessToken);
      setContacts(fetched);
      setFilteredContacts(fetched);
    } catch (err: any) {
      console.error('Failed to load Google contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleAuthorize = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setToken(res.accessToken);
        setAuthorized(true);
        loadContacts(res.accessToken);
      }
    } catch (err: any) {
      console.error('Authorization failed:', err);
      // We still fall back to allowing custom input if authorization is refused or failed
    }
  };

  // Filter contacts by search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredContacts(
        contacts.filter(
          c =>
            c.name.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, contacts]);

  const toggleSelectContact = (contact: ContactInfo) => {
    setSelectedContacts(prev => {
      const exists = prev.some(c => c.id === contact.id);
      if (exists) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleAddCustomEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;
    
    const newContact: ContactInfo = {
      id: `custom_${Date.now()}`,
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim()
    };
    
    setSelectedContacts(prev => {
      const exists = prev.some(c => c.email.toLowerCase() === newContact.email.toLowerCase());
      if (exists) return prev;
      return [...prev, newContact];
    });
    
    setCustomEmail('');
    setCustomName('');
  };

  const triggerSendConfirm = () => {
    if (selectedContacts.length === 0) {
      setStatusMessage(language === 'SV' ? 'Välj minst en kontakt eller ange en e-postadress.' : 'Please select at least one contact.');
      setEmailStatus('error');
      return;
    }
    // Clean status
    setEmailStatus('idle');
    setShowConfirmSend(true);
  };

  const handleSendEmails = async () => {
    if (!token || selectedContacts.length === 0) return;
    setSendingEmail(true);
    setShowConfirmSend(false);
    
    let successCount = 0;
    let failedCount = 0;

    for (const contact of selectedContacts) {
      try {
        // Send email message
        await sendGmailEmail(token, contact.email, subject, messageBody.replace(/\n/g, '<br/>'));
        successCount++;
      } catch (err) {
        console.error(`Failed to send email to ${contact.email}:`, err);
        failedCount++;
      }
    }

    setSendingEmail(false);
    if (successCount > 0) {
      setEmailStatus('success');
      setStatusMessage(
        language === 'SV'
          ? `Sändning slutförd! Skickade meddelande till ${successCount} mottagare.`
          : `Deals sent! Successfully dispatched email alerts to ${successCount} recipient(s).`
      );
      setSelectedContacts([]); // clear selections
    } else {
      setEmailStatus('error');
      setStatusMessage(
        language === 'SV'
          ? 'Misslyckades att skicka e-post. Kontrollera dina Gmail-behörigheter.'
          : 'Failed to send emails. Please recheck your Gmail connection permissions.'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020202]/85 backdrop-blur-md z-[500] flex items-center justify-center p-4">
      <div className="bg-[#0b0f0d] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header rail */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#090d0b]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#3cbd82]/15 border border-[#3cbd82]/30 flex items-center justify-center text-[#3cbd82]">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                {language === 'SV' ? 'Mellanhands-delning / Smart Share' : 'Sourcing Share Workspace'}
              </h3>
              <p className="text-[10px] text-white/40 font-light mt-0.5">
                {language === 'SV' ? 'Skicka fynd via din personliga Gmail' : 'Dispatch secondhand deals using your unified Gmail account'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal content area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-left">
          
          {/* Authorization Check Block */}
          {!authorized ? (
            <div className="text-center py-10 space-y-5 bg-white/[0.01] border border-white/5 rounded-xl p-6">
              <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {language === 'SV' ? 'Anslut Google-konto för Gmail & Kontakter' : 'Connect Google Workspace Permissions'}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  {language === 'SV' 
                    ? 'För att kunna dela detta fynd direkt via dina Google-kontakter och din personliga Gmail behöver du ansluta ditt Google-konto säkert.'
                    : 'To access your Google contacts list and automatically dispatch circular deal briefs via Gmail, please securely connect your account.'}
                </p>
              </div>
              <button
                onClick={handleAuthorize}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3cbd82] text-black text-xs font-black uppercase tracking-wider transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{language === 'SV' ? 'Anslut med Google' : 'Connect with Google'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Target Contacts selection (contacts list) */}
              <div className="md:col-span- così md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold block">
                    {language === 'SV' ? 'Välj mottagare' : '1. Select Recipients'}
                  </span>
                  
                  <span className="text-[10px] text-[#3cbd82] bg-[#3cbd82]/10 border border-[#3cbd82]/20 px-2 py-0.5 rounded font-bold font-mono">
                    Gmail Connected
                  </span>
                </div>

                {/* Search contact field */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-white/35">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder={language === 'SV' ? 'Sök kontakter...' : 'Search contacts...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-white text-xs focus:outline-none focus:border-[#3cbd82]/40"
                  />
                </div>

                {/* Contacts roster list */}
                <div className="h-[200px] border border-white/5 bg-black/40 rounded-xl overflow-y-auto p-2 space-y-1">
                  {loadingContacts ? (
                    <div className="text-center py-10 text-xs text-white/40">
                      {language === 'SV' ? 'Hämtar dina Google-kontakter...' : 'Accessing Google contacts...'}
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <div className="text-center py-10 text-xs text-white/30 space-y-1">
                      <Users className="w-5 h-5 mx-auto mb-1 text-white/20" />
                      <div>{language === 'SV' ? 'Hittade inga kontakter.' : 'No connections detected.'}</div>
                      <div className="text-[10px] text-white/25">
                        {language === 'SV' ? 'Använd formuläret nedan för att ange valfri e-post.' : 'Use input below to specify a custom address.'}
                      </div>
                    </div>
                  ) : (
                    filteredContacts.map(c => {
                      const isSelected = selectedContacts.some(sc => sc.id === c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => toggleSelectContact(c)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                            isSelected 
                              ? 'bg-[#3cbd82]/10 border border-[#3cbd82]/20' 
                              : 'hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white/5 text-xs border border-white/10 flex items-center justify-center text-white font-bold uppercase shrink-0">
                              {c.photoUrl ? (
                                <img src={c.photoUrl} alt={c.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                c.name.slice(0, 1)
                              )}
                            </div>
                            <div className="truncate pr-2">
                              <div className="text-xs font-bold text-white truncate">{c.name}</div>
                              <div className="text-[10px] text-white/40 truncate">{c.email}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#3cbd82] flex items-center justify-center text-black">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Custom address add */}
                <form onSubmit={handleAddCustomEmail} className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/30 block">
                    {language === 'SV' ? 'Eller lägg till e-post manuellt' : 'Or add email manually:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder={language === 'SV' ? 'Mottagarens namn (valfritt)' : 'Name (optional)'}
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30"
                    />
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="kompis@mejl.se"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30"
                      />
                      <button
                        type="submit"
                        disabled={!customEmail.trim()}
                        className="px-3 bg-white/15 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        {language === 'SV' ? 'Lägg till' : 'Add'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Email parameters brief description preview */}
              <div className="md:col-span-5 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold block">
                  {language === 'SV' ? 'Förhandsgranska mejl' : '2. Email Composition Preview'}
                </span>
                
                <div className="p-4 bg-[#090c0b] border border-white/5 rounded-xl space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-white/30 uppercase block font-bold">Subject / Ämne</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-white/30 uppercase block font-bold">Body / Meddelande [HTML]</label>
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white/80 leading-relaxed font-sans focus:outline-none"
                    />
                  </div>
                </div>

                {/* Selected count widget box */}
                {selectedContacts.length > 0 && (
                  <div className="bg-white/5 border border-white/15 px-3 py-2 rounded-lg text-xs flex flex-wrap gap-1.5">
                    <span className="text-white/40 block w-full text-[9px] font-mono uppercase">Selected:</span>
                    {selectedContacts.map(sc => (
                      <span key={sc.id} className="inline-flex items-center gap-1 bg-[#3cbd82]/10 border border-[#3cbd82]/30 text-[#3cbd82] px-2 py-0.5 rounded text-[10px]">
                        {sc.name}
                        <button type="button" onClick={() => toggleSelectContact(sc)} className="hover:text-red-400">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Trigger action status messages */}
          {emailStatus !== 'idle' && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-xs border ${
              emailStatus === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {emailStatus === 'success' ? (
                <Check className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

        </div>

        {/* Action Button footer */}
        {authorized && (
          <div className="p-4 border-t border-white/10 bg-[#070b09] flex justify-between items-center">
            <span className="text-[10px] text-white/30 truncate pl-1 font-mono">
              {language === 'SV' 
                ? `Mottagare: ${selectedContacts.length} st` 
                : `Recipients selected: ${selectedContacts.length}`}
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
              >
                {language === 'SV' ? 'Avbryt' : 'Cancel'}
              </button>
              <button
                onClick={triggerSendConfirm}
                disabled={selectedContacts.length === 0 || sendingEmail}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#3cbd82] text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'SV' ? 'Dela till kompis' : 'Share to Contact'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safety Confirmation Dialog (Workspace Mutation Safeguard) */}
      {showConfirmSend && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
          <div className="bg-[#0c0e0d] border border-amber-500/30 rounded-xl max-w-sm p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                {language === 'SV' ? 'Bekräfta e-postsändning' : 'Confirm Mail Dispatch'}
              </h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                {language === 'SV' 
                  ? `Vill du skicka ${selectedContacts.length} st mejl via ditt anslutna Gmail-konto? \n\nDetta kommer att skicka meddelanden till valda kontakter med din avsändaradress.`
                  : `Are you sure you want to send ${selectedContacts.length} message(s) through your connected Gmail? This will dispatch emails to your selected contacts under your personal Gmail identity.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSend(false)}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
              >
                {language === 'SV' ? 'Nej, avbryt' : 'No, cancel'}
              </button>
              
              <button
                onClick={handleSendEmails}
                className="px-4 py-2 bg-amber-500 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer hover:bg-amber-400"
              >
                {language === 'SV' ? 'Ja, skicka mejl' : 'Yes, send mails'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
