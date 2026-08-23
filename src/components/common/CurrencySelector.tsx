import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '../../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface CurrencySelectorProps {
  variant?: 'navbar' | 'admin' | 'footer' | 'inline';
  showLabel?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'navbar',
  showLabel = true
}) => {
  const { currency, setCurrency, currencyConfig } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  const currencyList = Object.values(SUPPORTED_CURRENCIES);

  if (variant === 'footer') {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div className="flex items-center space-x-2">
          {showLabel && (
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center space-x-1">
              <Globe className="w-3 h-3 text-amber-400/80" />
              <span>Currency:</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/40 text-xs font-mono text-zinc-200 hover:text-amber-300 transition-all cursor-pointer shadow-sm"
            aria-label="Select Currency"
            title="Change Operating Currency"
          >
            <span className="font-bold text-amber-400">{currencyConfig.symbol}</span>
            <span className="font-semibold">{currencyConfig.code}</span>
            <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#0c0d12]/98 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-800/80 mb-1">
              Select Display Currency
            </div>
            <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
              {currencyList.map((item) => {
                const isSelected = item.code === currency;
                return (
                  <button
                    key={item.code}
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono text-left transition-all ${
                      isSelected
                        ? 'bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-5 text-center font-bold text-amber-400">{item.symbol}</span>
                      <span>{item.code}</span>
                      <span className="text-[10px] text-zinc-400 truncate max-w-[85px] font-sans">
                        {item.name.split('(')[0]}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'admin') {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/50 text-xs font-mono text-zinc-200 hover:text-white transition-all cursor-pointer shadow-inner group"
          title="Store Operating Currency"
        >
          <div className="w-4 h-4 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
            {currencyConfig.symbol}
          </div>
          <span className="font-bold tracking-wide">{currencyConfig.code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2 mb-1 flex items-center justify-between">
              <span>Admin Currency Switcher</span>
              <span className="text-amber-400 font-bold">{currencyConfig.code} Active</span>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1 py-1 custom-scrollbar">
              {currencyList.map((item) => {
                const isSelected = item.code === currency;
                return (
                  <button
                    key={item.code}
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-left transition-all ${
                      isSelected
                        ? 'bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 text-center font-bold text-amber-400 text-sm">{item.symbol}</span>
                      <div>
                        <div className="font-bold leading-tight">{item.code}</div>
                        <div className="text-[10px] text-zinc-400 font-sans leading-tight">
                          {item.name.replace(/\(.*?\)/g, '').trim()}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-zinc-900 px-2 text-[10px] text-zinc-400 leading-tight">
              Updates storefront catalog & checkout calculations in real-time.
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default 'navbar' Customer Header variant
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-zinc-800/80 bg-zinc-900/80 hover:bg-zinc-800/90 hover:border-amber-400/50 text-zinc-200 hover:text-amber-200 transition-all cursor-pointer shadow-sm group"
        title="Change Display Currency"
        aria-label="Currency Selector"
      >
        <span className="text-amber-400 font-mono font-bold text-xs">{currencyConfig.symbol}</span>
        <span className="text-xs font-mono font-semibold tracking-wider">{currencyConfig.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-60 bg-[#0c0d12]/98 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-2 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-800/80 mb-1 flex items-center justify-between">
            <span>Currency ({currencyConfig.code})</span>
            <span className="text-amber-400 font-bold">1 USD = {currencyConfig.rateAgainstUSD}</span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 py-1 custom-scrollbar">
            {currencyList.map((item) => {
              const isSelected = item.code === currency;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-mono text-left transition-all ${
                    isSelected
                      ? 'bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30'
                      : 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 text-center font-bold text-amber-400">{item.symbol}</span>
                    <div className="flex flex-col">
                      <span className="font-bold">{item.code}</span>
                      <span className="text-[10px] text-zinc-400 font-sans truncate max-w-[110px]">
                        {item.name.replace(/\(.*?\)/g, '').trim()}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
