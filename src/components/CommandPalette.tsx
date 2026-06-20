/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, ShoppingCart, FileText, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { Product, Order, CMSPage } from '../types.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  cmsPages: CMSPage[];
  onNavigate: (tabId: string, param?: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  products,
  orders,
  cmsPages,
  onNavigate
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter lists based on query
  const filteredProducts = query === '' 
    ? products.slice(0, 3) 
    : products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()));

  const filteredOrders = query === '' 
    ? orders.slice(0, 2) 
    : orders.filter(o => o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.name.toLowerCase().includes(query.toLowerCase()));

  const filteredPages = query === '' 
    ? cmsPages.slice(0, 2) 
    : cmsPages.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

  // Flattened results for keyboard navigation
  const results = [
    ...filteredProducts.map(p => ({ id: p.id, type: 'product', title: p.name, desc: p.sku, tab: 'products', param: p.id })),
    ...filteredOrders.map(o => ({ id: o.id, type: 'order', title: o.id, desc: `Customer: ${o.customer.name} - ${o.fulfillmentStatus}`, tab: 'orders', param: o.id })),
    ...filteredPages.map(p => ({ id: p.id, type: 'page', title: p.title, desc: `/${p.slug} - ${p.status}`, tab: 'cms', param: p.id }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) {
        const item = results[activeIndex];
        onNavigate(item.tab, item.param);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Palette Body */}
      <div
        className="relative bg-white rounded-xl border border-stone-200 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[420px] animate-fade-in"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-stone-100 px-4 py-3 flex items-center gap-3">
          <Search className="h-4.5 w-4.5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type search queries (e.g. #ORD, Saffron, Honey)..."
            className="w-full text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-[10px] bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-500 rounded px-1.5 py-0.5"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-stone-400">
              <Sparkles className="h-6.5 w-6.5 mx-auto mb-2 text-stone-300" />
              <p className="text-xs font-semibold">No direct results match your query...</p>
              <p className="text-[10px] text-stone-400 mt-1">Try querying different e-commerce fields or variant SKUs.</p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onNavigate(item.tab, item.param);
                    onClose();
                  }}
                  className={`flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className={`p-1.5 rounded-md shrink-0 ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {item.type === 'product' && <Package className="h-3.5 w-3.5" />}
                    {item.type === 'order' && <ShoppingCart className="h-3.5 w-3.5" />}
                    {item.type === 'page' && <FileText className="h-3.5 w-3.5" />}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{item.title}</p>
                    <p className={`text-[10px] mt-0.5 font-medium truncate ${isActive ? 'text-indigo-600' : 'text-stone-400'}`}>
                      {item.desc}
                    </p>
                  </div>

                  {isActive ? (
                    <span className="text-[10px] flex items-center gap-1 font-semibold text-indigo-600 animate-pulse shrink-0">
                      <span>Jump</span>
                      <CornerDownLeft className="h-3 w-3" />
                    </span>
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-stone-300 group-hover:text-stone-400 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="bg-stone-50 border-t border-stone-200 px-4 py-2 flex items-center justify-between text-[9px] text-stone-400 font-semibold select-none shrink-0">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigation</span>
            <span>•</span>
            <span>↵ Enter to select</span>
          </div>
          <div>
            <span>Press <b>⌘K</b> anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
