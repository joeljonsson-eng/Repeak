import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, HelpCircle, Layers, HelpCircle as Help } from 'lucide-react';

interface ComparisonFeature {
  name: string;
  tooltip?: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

interface GroupedFeature {
  category: string;
  items: ComparisonFeature[];
}

export default function FeatureComparison() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const featureGroups: GroupedFeature[] = [
    {
      category: 'Unified Catalog Index',
      items: [
        { name: 'Unified marketplace indexing', tooltip: 'Aggregate listing sheets from 8 major international marketplaces', free: true, pro: true, enterprise: true },
        { name: 'Index refresh cycle', tooltip: 'How frequently indices refresh active list sheets', free: '24 Hours', pro: '1 Minute', enterprise: 'Real-time pipeline' },
        { name: 'Advanced collection filters', tooltip: 'Exclude custom tags, non-reputable sellers, or specific materials', free: 'Basic filters', pro: 'Complete modifier suite', enterprise: 'Programmable filters' },
        { name: 'High-density metrics scoring', tooltip: 'Measures index differences against historical price models', free: 'Basic score', pro: 'Optimal valuation index', enterprise: 'Custom business parameters' }
      ]
    },
    {
      category: 'Alerts & Automation',
      items: [
        { name: 'Max active alerts', tooltip: 'Total active scan targets saved to your notification feed', free: '3 active', pro: 'Unlimited', enterprise: 'Unlimited + Bulk import' },
        { name: 'Notification channels', tooltip: 'Where alerts are directed when deal targets match parameters', free: 'Email only', pro: 'Telegram, Discord, SMS', enterprise: 'Custom HTTP Webhooks' },
        { name: 'Sellers whitelist / blacklist', tooltip: 'Select specific sellers to monitor automatically or exclude completely', free: '✕', pro: true, enterprise: true }
      ]
    },
    {
      category: 'Trust & Verification',
      items: [
        { name: 'Verification checklist', tooltip: 'Tag checking, stamping, and sewing alignment reviews', free: '✕', pro: '12-point check', enterprise: 'Priority check + desk review' },
        { name: 'Irregular indicators flagging', tooltip: 'Automatic notifications detailing atypical manufacturing indicators', free: '✕', pro: true, enterprise: true },
        { name: 'Seller credibility analytics', tooltip: 'Historical listing trust, review tracking, and community standing metrics', free: 'Basic stars', pro: 'Full credibility history', enterprise: 'Direct fraud API feed' }
      ]
    },
    {
      category: 'Archiving & Analytics',
      items: [
        { name: 'Historical price databases', tooltip: 'View price ranges, trends, and buy volumes for clothing models dating 5 years back', free: '✕', pro: true, enterprise: true },
        { name: 'CSV data exports', tooltip: 'Export specific trends for archival or taxation filing preparation', free: '✕', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Developer integration routes', tooltip: 'Exportable JSON endpoints to compile into local workflows or sheets', free: '✕', pro: '✕', enterprise: 'Uncapped feeds' },
        { name: 'Dedicated Collection Advisor', tooltip: 'Consultant-led support for bulk wardrobe curation or webhook setups', free: 'Community forum', pro: 'Priority assistance', enterprise: '1-on-1 private desk' }
      ]
    }
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <Check className="w-5 h-5 text-[#00FF80] mx-auto shrink-0" />
      ) : (
        <span className="text-white/20 font-mono text-[11px]">✕</span>
      );
    }
    return <span className="text-white/80 font-sans text-xs font-semibold">{val}</span>;
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto border-t border-white/5 scroll-mt-24" id="comparison">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight font-display text-white mb-4">
          Granular Capabilities Model
        </h2>
        <p className="text-white/60 text-sm md:text-base font-light">
          A side-by-side technical specification breakdown of the three tiers. Choose the precision grade your secondhand scouting requires.
        </p>
      </div>

      {/* Desktop Feature comparison table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-6 pr-4 text-xs font-mono tracking-wider uppercase text-white/40 w-[35%]">Capability</th>
              <th className="py-6 px-4 text-center text-sm font-semibold text-white/80 w-[20%] bg-white/[0.01] rounded-t-2xl">
                Free
                <span className="block text-[10px] font-mono text-white/30 font-normal mt-0.5">0 kr/month</span>
              </th>
              <th className="py-6 px-4 text-center text-sm font-semibold text-white w-[25%] bg-white/[0.04] border-x border-t border-white/15 rounded-t-2xl relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/5 text-[#00FF80] text-[9px] font-mono font-semibold border border-white/10 shadow-[0_0_8px_rgba(0,FF,128,0.1)]">
                  RECOMMENDED SELECTION
                </span>
                Pro
                <span className="block text-[10px] font-mono text-[#00FF80] font-medium mt-0.5 pointer-events-none">79 kr/month</span>
              </th>
              <th className="py-6 px-4 text-center text-sm font-semibold text-white/80 w-[20%] bg-white/[0.01] rounded-t-2xl">
                Enterprise
                <span className="block text-[10px] font-mono text-white/30 font-normal mt-0.5">Custom layout</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {featureGroups.map((group) => (
              <React.Fragment key={group.category}>
                {/* Category Header Row */}
                <tr>
                  <td colSpan={4} className="py-5 font-mono text-[10px] uppercase tracking-widest text-[#00FF80] font-semibold pt-10">
                    {group.category}
                  </td>
                </tr>
                {group.items.map((item) => (
                  <tr 
                    key={item.name}
                    onMouseEnter={() => setHoveredRow(item.name)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition-colors duration-200 ${
                      hoveredRow === item.name ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="py-4 pr-4 border-b border-white/5">
                      <div className="flex items-center gap-1.5 group">
                        <span className="text-white/80 text-xs font-light cursor-help" title={item.tooltip}>
                          {item.name}
                        </span>
                        <Help className="w-3.5 h-3.5 text-white/30 opacity-60 group-hover:opacity-100 transition-opacity" title={item.tooltip} />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center border-b border-white/5 bg-white/[0.01]">
                      {renderValue(item.free)}
                    </td>
                    <td className="py-4 px-4 text-center border-b border-white/5 border-x border-white/10 bg-white/[0.03] font-medium">
                      {renderValue(item.pro)}
                    </td>
                    <td className="py-4 px-4 text-center border-b border-white/5 bg-white/[0.01]">
                      {renderValue(item.enterprise)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Accordion-like View */}
      <div className="block md:hidden space-y-6">
        {featureGroups.map((group) => (
          <div key={group.category} className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
            <h3 className="font-mono text-[10px] tracking-wider uppercase text-[#00FF80] mb-3 border-b border-white/10 pb-2">
              {group.category}
            </h3>
            <div className="space-y-4 divide-y divide-white/5">
              {group.items.map((item, id) => (
                <div key={id} className={`pt-3 ${id === 0 ? 'pt-0' : ''}`}>
                  <div className="text-white/90 text-xs font-semibold mb-2">
                    {item.name}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                    <div className="bg-white/[0.01] p-2 rounded border border-white/5">
                      <span className="text-white/30 block text-[9px] uppercase mb-1">Free</span>
                      <span className="truncate block text-white/70">{item.free === true ? '✓' : item.free === false ? '✕' : item.free}</span>
                    </div>
                    <div className="bg-[#00FF80]/5 p-2 rounded border border-[#00FF80]/15">
                      <span className="text-[#00FF80] block text-[9px] uppercase mb-1">Pro</span>
                      <span className="font-semibold block text-[#00FF80]">{item.pro === true ? '✓' : item.pro === false ? '✕' : item.pro}</span>
                    </div>
                    <div className="bg-white/[0.01] p-2 rounded border border-white/5">
                      <span className="text-white/30 block text-[9px] uppercase mb-1">Enterprise</span>
                      <span className="truncate block text-white/70">{item.enterprise === true ? '✓' : item.enterprise === false ? '✕' : item.enterprise}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}