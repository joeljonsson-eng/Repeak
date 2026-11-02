import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Search as SearchIcon, 
  Check, 
  X, 
  Sparkles,
  Tag as TagIcon
} from 'lucide-react';
import { SearchFilterState, SearchFacets } from '../types';
import { COLOR_CONFIG } from '../data/searchListingsData';
import { useLanguage } from '../LanguageContext';

interface SearchSidebarFilterProps {
  filters: SearchFilterState;
  onFilterChange: (newFilters: SearchFilterState) => void;
  facets: SearchFacets;
  totalMatches: number;
  onResetFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export default function SearchSidebarFilter({
  filters,
  onFilterChange,
  facets,
  totalMatches,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile,
  className = ''
}: SearchSidebarFilterProps) {
  const { language } = useLanguage();

  // Accordion toggle states
  const [openSections, setOpenSections] = useState<{
    brand: boolean;
    size: boolean;
    color: boolean;
    condition: boolean;
    price: boolean;
    marketplace: boolean;
  }>({
    brand: true,
    size: true,
    color: true,
    condition: true,
    price: true,
    marketplace: false
  });

  // Local brand search filter
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Size category tab filter
  const [sizeCategoryTab, setSizeCategoryTab] = useState<'all' | 'clothing' | 'denim' | 'shoes' | 'onesize'>('all');

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate total active filter items count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    count += filters.brands.length;
    count += filters.sizes.length;
    count += filters.colors.length;
    count += filters.conditions.length;
    count += filters.marketplaces.length;
    count += filters.tags.length;
    if (filters.minPrice !== null || filters.maxPrice !== null) count += 1;
    return count;
  }, [filters]);

  // Brand handlers
  const handleToggleBrand = (brandName: string) => {
    const nextBrands = filters.brands.includes(brandName)
      ? filters.brands.filter(b => b !== brandName)
      : [...filters.brands, brandName];
    onFilterChange({ ...filters, brands: nextBrands });
  };

  // Size handlers
  const handleToggleSize = (sizeVal: string) => {
    const nextSizes = filters.sizes.includes(sizeVal)
      ? filters.sizes.filter(s => s !== sizeVal)
      : [...filters.sizes, sizeVal];
    onFilterChange({ ...filters, sizes: nextSizes });
  };

  // Color handlers
  const handleToggleColor = (colorName: string) => {
    const nextColors = filters.colors.includes(colorName)
      ? filters.colors.filter(c => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: nextColors });
  };

  // Condition handlers
  const handleToggleCondition = (condId: string) => {
    const nextConditions = filters.conditions.includes(condId)
      ? filters.conditions.filter(c => c !== condId)
      : [...filters.conditions, condId];
    onFilterChange({ ...filters, conditions: nextConditions });
  };

  // Marketplace handlers
  const handleToggleMarketplace = (marketName: string) => {
    const nextMarketplaces = filters.marketplaces.includes(marketName)
      ? filters.marketplaces.filter(m => m !== marketName)
      : [...filters.marketplaces, marketName];
    onFilterChange({ ...filters, marketplaces: nextMarketplaces });
  };

  // Price handlers
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
    onFilterChange({ ...filters, minPrice: val });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
    onFilterChange({ ...filters, maxPrice: val });
  };

  const applyPricePreset = (min: number | null, max: number | null) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  // Filtered brands list based on search input
  const displayedBrands = useMemo(() => {
    let list = facets.brands;
    if (brandSearch.trim()) {
      list = list.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase().trim()));
    }
    if (!showAllBrands && !brandSearch.trim()) {
      return list.slice(0, 8);
    }
    return list;
  }, [facets.brands, brandSearch, showAllBrands]);

  // Filtered sizes list based on size tab
  const displayedSizes = useMemo(() => {
    let list = facets.sizes;
    if (sizeCategoryTab !== 'all') {
      list = list.filter(s => s.category === sizeCategoryTab);
    }
    return list;
  }, [facets.sizes, sizeCategoryTab]);

  const filterContent = (
    <div className="space-y-5 text-sm text-zinc-300 font-sans select-none">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#3cbd82]/10 border border-[#3cbd82]/20 flex items-center justify-center text-[#3cbd82]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
              <span>{language === 'SV' ? 'Filter' : 'Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#3cbd82] text-neutral-950 font-black text-[10px] rounded-full font-mono">
                  {activeFiltersCount}
                </span>
              )}
            </h3>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onResetFilters}
            className="text-[11px] text-[#3cbd82] hover:text-[#4ade80] font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title={language === 'SV' ? 'Rensa alla filter' : 'Reset all filters'}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'SV' ? 'Rensa' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* 2. PRICE RANGE FILTER */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-white hover:text-[#3cbd82] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>{language === 'SV' ? 'Prisintervall (SEK)' : 'Price Range (SEK)'}</span>
            {(filters.minPrice !== null || filters.maxPrice !== null) && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#3cbd82]" />
            )}
          </span>
          {openSections.price ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3">
            {/* Min / Max Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 font-mono block mb-1">
                  {language === 'SV' ? 'Min' : 'Min'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    placeholder="0 kr"
                    value={filters.minPrice ?? ''}
                    onChange={handleMinPriceChange}
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#3cbd82]/60"
                  />
                  <span className="absolute right-2.5 top-1.5 text-[10px] text-zinc-500 font-mono pointer-events-none">
                    kr
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-mono block mb-1">
                  {language === 'SV' ? 'Max' : 'Max'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    placeholder="10 000 kr"
                    value={filters.maxPrice ?? ''}
                    onChange={handleMaxPriceChange}
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#3cbd82]/60"
                  />
                  <span className="absolute right-2.5 top-1.5 text-[10px] text-zinc-500 font-mono pointer-events-none">
                    kr
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '< 500 kr', min: null, max: 500 },
                { label: '500 – 1 500 kr', min: 500, max: 1500 },
                { label: '1 500 – 3 000 kr', min: 1500, max: 3000 },
                { label: '> 3 000 kr', min: 3000, max: null }
              ].map(preset => {
                const isActive = filters.minPrice === preset.min && filters.maxPrice === preset.max;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      if (isActive) {
                        applyPricePreset(null, null);
                      } else {
                        applyPricePreset(preset.min, preset.max);
                      }
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#3cbd82] text-neutral-950 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. BRAND FILTER */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-white hover:text-[#3cbd82] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>{language === 'SV' ? 'Märke / Brand' : 'Brand'}</span>
            {filters.brands.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#3cbd82]/20 text-[#3cbd82] border border-[#3cbd82]/30 text-[9px] rounded-full font-mono font-bold">
                {filters.brands.length}
              </span>
            )}
          </span>
          {openSections.brand ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
        </button>

        {openSections.brand && (
          <div className="mt-3 space-y-2.5">
            {/* Search Brand Input */}
            <div className="relative">
              <SearchIcon className="w-3 h-3 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder={language === 'SV' ? 'Filtrera märken...' : 'Filter brands...'}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#3cbd82]/60"
              />
              {brandSearch && (
                <button
                  onClick={() => setBrandSearch('')}
                  className="absolute right-2 top-2 text-zinc-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Brands Checkboxes List */}
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
              {displayedBrands.length === 0 ? (
                <p className="text-[11px] text-zinc-500 py-2 italic font-mono">
                  {language === 'SV' ? 'Inga märken matchar' : 'No matching brands'}
                </p>
              ) : (
                displayedBrands.map(b => {
                  const isChecked = filters.brands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      onClick={() => handleToggleBrand(b.name)}
                      className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked 
                          ? 'bg-[#3cbd82]/10 text-white font-semibold' 
                          : 'hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-[#3cbd82] text-neutral-950' 
                            : 'border border-zinc-700 bg-zinc-900'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{b.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        ({b.count})
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {facets.brands.length > 8 && !brandSearch && (
              <button
                onClick={() => setShowAllBrands(prev => !prev)}
                className="text-[11px] text-[#3cbd82] hover:text-[#4ade80] font-mono block pt-1 transition-colors cursor-pointer"
              >
                {showAllBrands 
                  ? (language === 'SV' ? '− Visa färre' : '− Show fewer') 
                  : (language === 'SV' ? `+ Visa fler (${facets.brands.length - 8})` : `+ Show more (${facets.brands.length - 8})`)}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. SIZE FILTER */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-white hover:text-[#3cbd82] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>{language === 'SV' ? 'Storlek' : 'Size'}</span>
            {filters.sizes.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#3cbd82]/20 text-[#3cbd82] border border-[#3cbd82]/30 text-[9px] rounded-full font-mono font-bold">
                {filters.sizes.length}
              </span>
            )}
          </span>
          {openSections.size ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
        </button>

        {openSections.size && (
          <div className="mt-3 space-y-2.5">
            {/* Category tabs for sizes */}
            <div className="flex bg-zinc-900/90 p-0.5 rounded-lg border border-white/5 text-[10px] font-mono">
              <button
                onClick={() => setSizeCategoryTab('all')}
                className={`flex-1 py-1 rounded transition-all ${
                  sizeCategoryTab === 'all' ? 'bg-[#3cbd82] text-neutral-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {language === 'SV' ? 'Alla' : 'All'}
              </button>
              <button
                onClick={() => setSizeCategoryTab('clothing')}
                className={`flex-1 py-1 rounded transition-all ${
                  sizeCategoryTab === 'clothing' ? 'bg-[#3cbd82] text-neutral-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {language === 'SV' ? 'Kläder' : 'Tops'}
              </button>
              <button
                onClick={() => setSizeCategoryTab('denim')}
                className={`flex-1 py-1 rounded transition-all ${
                  sizeCategoryTab === 'denim' ? 'bg-[#3cbd82] text-neutral-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {language === 'SV' ? 'Jeans' : 'Jeans'}
              </button>
              <button
                onClick={() => setSizeCategoryTab('shoes')}
                className={`flex-1 py-1 rounded transition-all ${
                  sizeCategoryTab === 'shoes' ? 'bg-[#3cbd82] text-neutral-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {language === 'SV' ? 'Skor' : 'Shoes'}
              </button>
            </div>

            {/* Size Chips Grid */}
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {displayedSizes.map(s => {
                const isSelected = filters.sizes.includes(s.size);
                return (
                  <button
                    key={s.size}
                    onClick={() => handleToggleSize(s.size)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#3cbd82] text-neutral-950 font-bold shadow-sm shadow-[#3cbd82]/30'
                        : 'bg-zinc-900/80 text-zinc-300 hover:text-white border border-white/5 hover:border-white/15'
                    }`}
                  >
                    <span>{s.size}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-neutral-900/70' : 'text-zinc-500'}`}>
                      {s.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. COLOR FILTER */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-white hover:text-[#3cbd82] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>{language === 'SV' ? 'Färg' : 'Color'}</span>
            {filters.colors.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#3cbd82]/20 text-[#3cbd82] border border-[#3cbd82]/30 text-[9px] rounded-full font-mono font-bold">
                {filters.colors.length}
              </span>
            )}
          </span>
          {openSections.color ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
        </button>

        {openSections.color && (
          <div className="mt-3">
            <div className="grid grid-cols-2 gap-1.5">
              {facets.colors.map(c => {
                const isSelected = filters.colors.includes(c.name);
                const colorMeta = COLOR_CONFIG[c.name];
                const displayName = language === 'SV' ? (colorMeta?.labelSv || c.name) : (colorMeta?.labelEn || c.name);
                const isWhite = c.name === 'Vit';

                return (
                  <button
                    key={c.name}
                    onClick={() => handleToggleColor(c.name)}
                    className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3cbd82]/15 border border-[#3cbd82]/30 text-white font-semibold'
                        : 'bg-zinc-900/60 border border-white/5 hover:border-white/10 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center ${
                          isWhite ? 'border border-zinc-500' : ''
                        }`}
                        style={{
                          background: c.hex.startsWith('linear') ? c.hex : c.hex
                        }}
                      >
                        {isSelected && (
                          <Check className={`w-2.5 h-2.5 ${isWhite ? 'text-black stroke-[3]' : 'text-white stroke-[3]'}`} />
                        )}
                      </span>
                      <span className="truncate text-[11px]">{displayName}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 6. CONDITION FILTER */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('condition')}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-white hover:text-[#3cbd82] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>{language === 'SV' ? 'Skick' : 'Condition'}</span>
            {filters.conditions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#3cbd82]/20 text-[#3cbd82] border border-[#3cbd82]/30 text-[9px] rounded-full font-mono font-bold">
                {filters.conditions.length}
              </span>
            )}
          </span>
          {openSections.condition ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
        </button>

        {openSections.condition && (
          <div className="mt-3 space-y-1.5">
            {facets.conditions.map(c => {
              const isChecked = filters.conditions.includes(c.id);
              return (
                <label
                  key={c.id}
                  onClick={() => handleToggleCondition(c.id)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-[#3cbd82]/10 text-white font-medium border border-[#3cbd82]/20'
                      : 'hover:bg-white/5 text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                      isChecked 
                        ? 'bg-[#3cbd82] text-neutral-950' 
                        : 'border border-zinc-700 bg-zinc-900'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="block text-xs text-white/90">{c.id}</span>
                      <span className="block text-[10px] text-zinc-500 font-mono">
                        {c.id === 'Nyskick' ? '⭐⭐⭐⭐⭐ Oanvänd / Lapp kvar' :
                         c.id === 'Mycket bra skick' ? '⭐⭐⭐⭐ Minimalt slitage' :
                         c.id === 'Bra skick' ? '⭐⭐⭐ Normal användning' :
                         '⭐⭐ Autentisk vintagepatina'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ({c.count})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. MARKETPLACE FILTER */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection('marketplace')}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-white hover:text-[#3cbd82] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>{language === 'SV' ? 'Marknadsplats' : 'Marketplace'}</span>
            {filters.marketplaces.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#3cbd82]/20 text-[#3cbd82] border border-[#3cbd82]/30 text-[9px] rounded-full font-mono font-bold">
                {filters.marketplaces.length}
              </span>
            )}
          </span>
          {openSections.marketplace ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
        </button>

        {openSections.marketplace && (
          <div className="mt-3 space-y-1">
            {facets.marketplaces.map(m => {
              const isChecked = filters.marketplaces.includes(m.name);
              const mLower = m.name.toLowerCase();
              return (
                <label
                  key={m.name}
                  onClick={() => handleToggleMarketplace(m.name)}
                  className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isChecked ? 'bg-white/10 text-white font-medium' : 'hover:bg-white/5 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                      isChecked ? 'bg-[#3cbd82] text-neutral-950' : 'border border-zinc-700 bg-zinc-900'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`text-[11px] font-mono font-bold ${
                      mLower === 'tradera' ? 'text-amber-400' :
                      mLower === 'vinted' ? 'text-[#09B1BA]' :
                      mLower === 'plick' ? 'text-rose-400' :
                      mLower === 'blocket' ? 'text-blue-400' :
                      'text-zinc-300'
                    }`}>
                      {m.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ({m.count})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Match Result Summary */}
      <div className="pt-2 border-t border-white/5">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-mono text-[11px]">
            {language === 'SV' ? 'Matchande annonser:' : 'Matching listings:'}
          </span>
          <span className="font-mono font-black text-[#3cbd82] text-sm">
            {totalMatches} {language === 'SV' ? 'st' : 'items'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:block w-72 xl:w-80 shrink-0 ${className}`}>
        <div className="sticky top-24 bg-[#0a0a0c]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
          {filterContent}
        </div>
      </aside>

      {/* MOBILE DRAWER MODAL */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-out panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-[#0a0a0c] border-l border-white/10 shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#3cbd82]" />
                <span className="font-bold text-white text-sm">
                  {language === 'SV' ? 'Avancerad filtrering' : 'Advanced Filters'}
                </span>
              </div>
              <button
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable filter body */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-zinc-800">
              {filterContent}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-white/10 bg-zinc-950 flex gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={onResetFilters}
                  className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono font-semibold text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  {language === 'SV' ? 'Rensa' : 'Reset'}
                </button>
              )}
              <button
                onClick={onCloseMobile}
                className="flex-1 py-3 px-4 rounded-xl bg-[#3cbd82] hover:bg-[#34a974] text-neutral-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#3cbd82]/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{language === 'SV' ? `Visa ${totalMatches} annonser` : `Show ${totalMatches} listings`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
