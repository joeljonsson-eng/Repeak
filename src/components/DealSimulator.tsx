import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShieldAlert, Sparkles, AlertTriangle, TrendingUp, Check, RefreshCw, Layers, ExternalLink } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface MockItem {
  id: string;
  name: string;
  brand: string;
  avgRetail: string;
  marketRange: string;
  scannedMarkets: { market: string; price: string; condition: string; score: number; link: string }[];
  fakeIndicators: { name: string; status: 'clear' | 'warning' | 'critical' }[];
  priceTrend: { date: string; avg: number }[];
  savingsAmount: string;
}

const MOCK_ITEMS: MockItem[] = [
  {
    id: 'tabi',
    name: 'Tabi Boots (Leather)',
    brand: 'Maison Margiela',
    avgRetail: '11,200 kr',
    marketRange: '4,500 kr - 8,200 kr',
    savingsAmount: '3,100 kr',
    scannedMarkets: [
      { market: 'Vestiaire Collective', price: '4,900 kr', condition: 'Very Good', score: 96, link: '#' },
      { market: 'Grailed', price: '5,500 kr', condition: 'Good', score: 88, link: '#' },
      { market: 'Depop', price: '4,100 kr', condition: 'Fair', score: 62, link: '#' },
      { market: 'eBay Premium', price: '6,200 kr', condition: 'Excellent', score: 91, link: '#' },
    ],
    fakeIndicators: [
      { name: 'Leather Grain & Heel Alignment', status: 'clear' },
      { name: 'Numbered Sole Stamp Depth', status: 'clear' },
      { name: 'Heel Catch Hook Material', status: 'warning' },
    ],
    priceTrend: [
      { date: 'Dec 25', avg: 7200 },
      { date: 'Jan 26', avg: 7100 },
      { date: 'Feb 26', avg: 6800 },
      { date: 'Mar 26', avg: 6500 },
      { date: 'Apr 26', avg: 6100 },
      { date: 'May 26', avg: 5800 },
    ],
  },
  {
    id: 'stone-vintage',
    name: 'Vintage Tela Stella Jacket',
    brand: 'Stone Island',
    avgRetail: '14,500 kr',
    marketRange: '6,000 kr - 11,500 kr',
    savingsAmount: '4,200 kr',
    scannedMarkets: [
      { market: 'Grailed', price: '6,800 kr', condition: 'Fair (Faded)', score: 94, link: '#' },
      { market: 'eBay Vintage', price: '9,500 kr', condition: 'Excellent', score: 89, link: '#' },
      { market: 'Vestiaire Collective', price: '7,900 kr', condition: 'Good', score: 91, link: '#' },
      { market: 'Vinted Premium', price: '5,900 kr', condition: 'Good', score: 55, link: '#' },
    ],
    fakeIndicators: [
      { name: 'Compass Badge Embroidery (L/N spacing)', status: 'critical' },
      { name: 'Lampo Zipper Run & Pull Plate', status: 'warning' },
      { name: 'Art Number Code Verification', status: 'critical' },
    ],
    priceTrend: [
      { date: 'Dec 25', avg: 9200 },
      { date: 'Jan 26', avg: 9400 },
      { date: 'Feb 26', avg: 9800 },
      { date: 'Mar 26', avg: 10100 },
      { date: 'Apr 26', avg: 10500 },
      { date: 'May 26', avg: 11000 },
    ],
  },
  {
    id: 'acne-leather',
    name: 'Classic Biker Leather Jacket',
    brand: 'Acne Studios',
    avgRetail: '16,000 kr',
    marketRange: '5,500 kr - 9,800 kr',
    savingsAmount: '5,000 kr',
    scannedMarkets: [
      { market: 'Vinted Premium', price: '5,500 kr', condition: 'Very Good', score: 97, link: '#' },
      { market: 'Vestiaire Collective', price: '7,200 kr', condition: 'Excellent', score: 92, link: '#' },
      { market: 'Grailed', price: '6,900 kr', condition: 'Good', score: 85, link: '#' },
      { market: 'Depop', price: '4,800 kr', condition: 'Fair', score: 71, link: '#' },
    ],
    fakeIndicators: [
      { name: 'Neck Label Stitch Thread Thickness', status: 'clear' },
      { name: 'Hardware Grains & YKK Stamp', status: 'clear' },
      { name: 'Inner Wash Tag Font Alignment', status: 'clear' },
    ],
    priceTrend: [
      { date: 'Dec 25', avg: 8500 },
      { date: 'Jan 26', avg: 8300 },
      { date: 'Feb 26', avg: 8000 },
      { date: 'Mar 26', avg: 7800 },
      { date: 'Apr 26', avg: 7400 },
      { date: 'May 26', avg: 7100 },
    ],
  },
];

export default function DealSimulator() {
  const { language, t } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<MockItem>(MOCK_ITEMS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [activeAlert, setActiveAlert] = useState<boolean>(false);

  useEffect(() => {
    // Reset alert settings when switching item
    setActiveAlert(false);
  }, [selectedItem]);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanStep(0);
    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsScanning(false);
          return 3;
        }
        return prev + 1;
      });
    }, 900);
  };

  const translateCondition = (cond: string) => {
    if (language === 'SV') {
      const dict: Record<string, string> = {
        'Very Good': 'Mycket bra skick',
        'Good': 'Bra skick',
        'Fair': 'Brukat skick',
        'Excellent': 'Utmärkt skick',
        'Fair (Faded)': 'Slitet (Blek färg)'
      };
      return dict[cond] || cond;
    }
    return cond;
  };

  const translateFakeName = (name: string) => {
    if (language === 'SV') {
      const dict: Record<string, string> = {
        'Leather Grain & Heel Alignment': 'Läderstruktur & hälbaksida',
        'Numbered Sole Stamp Depth': 'Sifferstämpelns djup på sulan',
        'Heel Catch Hook Material': 'Material i hälkors-hakarna',
        'Compass Badge Embroidery (L/N spacing)': 'Brodyr på kompass-märket (L/N-avstånd)',
        'Lampo Zipper Run & Pull Plate': 'Lampo-dragkedjans löpare & dragskiva',
        'Art Number Code Verification': 'Verifiering av ART-nummerkoden',
        'Neck Label Stitch Thread Thickness': 'Sömtrådens tjocklek vid nack-etiketten',
        'Hardware Grains & YKK Stamp': 'YKK-stämplingsytor & metallkornighet',
        'Inner Wash Tag Font Alignment': 'Teckensnitt & passform på inre tvättlapp'
      };
      return dict[name] || name;
    }
    return name;
  };

  return (
    <section className="relative py-20 px-4 max-w-7xl mx-auto border-t border-white/5 overflow-hidden font-sans" id="simulator">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono mb-4">
          <Layers className="w-3.5 h-3.5 text-[#00FF80] animate-spin" style={{ animationDuration: '4s' }} />
          <span>{t.simulator.badge}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight font-display mb-4 text-white">
          {t.simulator.title}
        </h2>
        <p className="text-white/60 text-base md:text-lg font-light">
          {t.simulator.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step-by-Step Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-mono tracking-wider uppercase text-white/40 mb-4 font-semibold">
              {t.simulator.selectFashionArchive}
            </h3>
            <div className="space-y-2">
              {MOCK_ITEMS.map((item) => (
                <button
                  key={item.id}
                  id={`btn-sim-${item.id}`}
                  onClick={() => {
                    if (!isScanning) setSelectedItem(item);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex flex-col gap-1 cursor-pointer ${
                    selectedItem.id === item.id
                      ? 'bg-white/5 border-white/30 text-white shadow-xl'
                      : 'bg-transparent border-white/5 text-white/60 hover:border-white/10 hover:text-white'
                  }`}
                  disabled={isScanning}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-sans font-medium text-sm">{item.name}</span>
                    <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">
                      {item.brand}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white/40 mt-1">
                    <span>{t.simulator.sublabelRetail}: {item.avgRetail}</span>
                    <span className="text-[#00FF80] hover:underline font-semibold">{t.simulator.compareBtnText}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xs font-mono tracking-wider uppercase text-white/40 mb-4 font-semibold">
                {t.simulator.runDeepExtraction}
              </h3>
              <button
                id="btn-run-scan"
                onClick={handleRunScan}
                disabled={isScanning}
                className="w-full py-3 px-4 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 disabled:bg-white/5 disabled:text-white/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer font-semibold"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.simulator.btnScanningText}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t.simulator.btnNormalText}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Value Highlights and Bloomberg Feel Card */}
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 font-mono text-xs text-white/50 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold">
              <TrendingUp className="w-4 h-4 text-[#00FF80]" />
              <span>{t.simulator.scoutingTitle}</span>
            </div>
            <p className="text-white/60 leading-relaxed font-sans text-xs font-light">
              "{t.simulator.scoutTerminalText}"
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] border-t border-white/10">
              <div>
                <span className="text-white/40 block leading-tight mb-0.5">{t.simulator.savingsMetric}</span>
                <span className="text-white text-sm font-bold font-mono">{selectedItem.savingsAmount}</span>
              </div>
              <div>
                <span className="text-white/40 block leading-tight mb-0.5">{t.simulator.accuracyMetric}</span>
                <span className="text-[#00FF80] text-sm font-bold font-mono">99.4% (Tier-1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Console / Terminal Interface */}
        <div className="lg:col-span-8 bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.02] border-b border-white/10 font-mono text-[11px] text-white/40">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <span className="ml-2 font-bold text-white/75">{t.simulator.activeTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold text-[#00FF80] tracking-wider font-mono">
                {language === 'SV' ? 'PREVIEW DISCOVERY AKTIVERAD' : 'PREVIEW DISCOVERY ACTIVATED'}
              </span>
            </div>
          </div>

          <div className="p-6 font-mono text-xs space-y-6 min-h-[380px]">
            {isScanning ? (
              /* PROGRESS STREAM */
              <div className="space-y-4 text-white/80 py-6">
                <div className="flex items-start gap-3">
                  <span className="text-white/30">•</span>
                  <span className="text-white">
                    {language === 'SV' 
                      ? `Söker i arkiv efter "${selectedItem.name}"...` 
                      : `Scanning archives for "${selectedItem.name}"...`}
                  </span>
                </div>
                
                {scanStep >= 1 && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
                    <span className="text-white/30">•</span>
                    <span className="text-white/85">{t.simulator.scanningStatusText}</span>
                  </motion.div>
                )}

                {scanStep >= 2 && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                    <div className="flex items-start gap-3 text-white/85">
                      <span className="text-white/30">•</span>
                      <span>{t.simulator.calibratingDetailsText}</span>
                    </div>
                  </motion.div>
                )}

                {scanStep >= 3 && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 text-[#00FF80]">
                    <span className="text-white/30">•</span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Check className="w-3.5 h-3.5" /> {t.simulator.matchFoundAlertText}
                    </span>
                  </motion.div>
                )}

                <div className="pt-4 flex items-center justify-center">
                  <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-white h-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(scanStep / 3) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* RESULTS PANEL */
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Visual Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-white/10 bg-white/[0.01] p-4 rounded-xl">
                  <div>
                    <span className="text-[10px] text-white/40 block uppercase mb-1 font-bold">{t.simulator.scannedArchiveTitle}</span>
                    <span className="text-white text-sm font-semibold truncate block font-sans">{selectedItem.name}</span>
                    <span className="text-white/60 text-xs truncate block">{selectedItem.brand}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block uppercase mb-1 font-bold">{t.simulator.sublabelRetail}</span>
                    <span className="text-white/60 text-sm italic font-mono">{selectedItem.avgRetail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block uppercase mb-1 font-bold">{t.simulator.bestMarketDealTitle}</span>
                    <span className="text-[#00FF80] text-sm font-semibold flex items-center gap-1 font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      {selectedItem.scannedMarkets[0].price}
                    </span>
                    <span className="text-white/40 text-[10px] block font-sans">({selectedItem.scannedMarkets[0].market})</span>
                  </div>
                </div>

                {/* Left Side: Real-Time Listings Tab, Right Side: Fake Check */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  {/* Market comparison */}
                  <div className="space-y-3 font-sans">
                    <div className="flex justify-between items-center text-white/60 border-b border-white/10 pb-2 font-mono">
                      <span className="text-[10px] uppercase font-bold text-white/40">{t.simulator.unifiedHeading}</span>
                      <span className="text-[10px] text-[#00FF80]">4 Sources</span>
                    </div>
                    <div className="space-y-2">
                      {selectedItem.scannedMarkets.map((m) => (
                        <div 
                          key={m.market} 
                          className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-colors"
                        >
                          <div>
                            <span className="text-white text-xs font-semibold block">{m.market}</span>
                            <span className="text-[10px] text-white/40">{translateCondition(m.condition)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white text-xs block font-bold font-mono">{m.price}</span>
                            <span className={`text-[9px] font-mono px-1 rounded ${
                              m.score >= 90 ? 'text-[#00FF80] bg-[#00FF80]/5' : m.score >= 70 ? 'text-amber-400 bg-amber-500/5' : 'text-rose-400 bg-rose-500/5'
                            }`}>
                              {language === 'SV' ? 'Faktor:' : 'Deal Score:'} {m.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/search?q=${encodeURIComponent(selectedItem.name)}`}
                      className="mt-2.5 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 hover:bg-[#00FF80]/10 hover:border-[#00FF80]/30 border border-white/10 text-white hover:text-[#00FF80] text-xs font-semibold transition-all w-full cursor-pointer"
                    >
                      <span>{language === 'SV' ? `Hitta alla annonser för ${selectedItem.name}` : `Find all listings for ${selectedItem.name}`}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* AI Authenticator Analysis */}
                  <div className="space-y-3 font-sans">
                    <div className="flex justify-between items-center text-white/60 border-b border-white/10 pb-2 font-mono">
                      <span className="text-[10px] uppercase font-bold text-white/40">{t.simulator.authenticatorTitle}</span>
                      <span className="text-[10px] text-white/50 uppercase font-bold">PRO FEATURE</span>
                    </div>
                    <div className="space-y-2 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                      {selectedItem.fakeIndicators.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[11px] leading-tight py-1.5 border-b border-white/5 last:border-0">
                          {f.status === 'clear' && <Check className="w-3.5 h-3.5 text-[#00FF80] shrink-0 mt-0.5" />}
                          {f.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                          {f.status === 'critical' && <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <span className="text-white block font-semibold">{translateFakeName(f.name)}</span>
                            <span className="text-[9px] text-white/40 uppercase font-mono">
                              {f.status === 'clear' 
                                ? (language === 'SV' ? 'HÖG TILLFÖRLITLIGHET • ÄKTA' : 'Confidence High • Legitimate match') 
                                : f.status === 'warning' 
                                ? (language === 'SV' ? 'AVVIKELSE UPPTÄCKT • MANUELL KONTROLL' : 'Anomaly Detected • Manual check advised') 
                                : (language === 'SV' ? 'MÖNSTERSPIKAD INTE ÄKTA • HÖGRISK' : 'Counterfeit Signature • High Risk Tagged')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#00FF80]/5 border border-[#00FF80]/10 p-2.5 rounded-lg text-[10px] text-[#00FF80] leading-relaxed">
                      <span className="font-bold block mb-0.5">{t.simulator.proLockBadge}</span>
                      {t.simulator.proLockText}
                    </div>
                  </div>
                </div>

                {/* Interactive Deal Alert Setup block */}
                <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="p-2 rounded-lg bg-white/5 text-[#00FF80] border border-white/10">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-white font-semibold block text-xs">
                        {language === 'SV' ? 'Aktivera direktbevakning' : 'Set Real-Time Deal Alert'}
                      </span>
                      <p className="text-[10px] text-white/50 leading-normal font-light max-w-md">
                        {t.simulator.alertDetails}
                      </p>
                    </div>
                  </div>
                  <button 
                    id="btn-alert-setup"
                    onClick={() => setActiveAlert(!activeAlert)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-sans font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeAlert 
                        ? 'bg-[#00FF80]/10 text-[#00FF80] border border-[#00FF80]/30 shadow-[0_0_8px_rgba(0,FF,128,0.1)]' 
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    {activeAlert 
                      ? t.simulator.armedAlertState.replace('{val}', `(${selectedItem.name} < 5 000 kr)`)
                      : t.simulator.armAlertBtn}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Terminal Footer */}
          <div className="bg-white/[0.01] p-4 border-t border-white/5 font-mono text-[10px] text-white/40 flex flex-col md:flex-row justify-between items-center gap-2">
            <div>
              <span>{t.simulator.sourceIndexLabel}</span>
            </div>
            <div className="text-white/60 font-sans text-[10px]">
              {t.simulator.automationAlertSub}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
