/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Package, Plus, Trash2, Heart, Gift, Sparkles, MessageSquare } from 'lucide-react';
import { GiftHamper, Product } from '../types.ts';

interface HampersTabProps {
  hampers: GiftHamper[];
  setHampers: React.Dispatch<React.SetStateAction<GiftHamper[]>>;
  products: Product[];
  userRole: string; // RBAC
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function HampersTab({
  hampers,
  setHampers,
  products,
  userRole,
  onLogActivity
}: HampersTabProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [hamperName, setHamperName] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState<'Premium Box' | 'Eco Jute Bag' | 'Festive Basket'>('Premium Box');
  const [giftNote, setGiftNote] = useState('');
  const [bundleProducts, setBundleProducts] = useState<{ productId: string; quantity: number }[]>([]);

  // Selected item selector lists
  const [addpId, setAddpId] = useState('');
  const [addQty, setAddQty] = useState(1);

  const isReadOnly = userRole === 'Customer Support';

  // Math totals calculation
  const aggregatedBasePrice = bundleProducts.reduce((sum, bp) => {
    const matchedP = products.find(p => p.id === bp.productId);
    return sum + (matchedP ? matchedP.price * bp.quantity : 0);
  }, 0) + (selectedPackaging === 'Premium Box' ? 10.0 : selectedPackaging === 'Festive Basket' ? 15.0 : 5.0);

  const handleAppendBundleProduct = () => {
    if (!addpId) return;
    setBundleProducts(prev => {
      const exists = prev.find(p => p.productId === addpId);
      if (exists) {
        return prev.map(p => p.productId === addpId ? { ...p, quantity: p.quantity + addQty } : p);
      }
      return [...prev, { productId: addpId, quantity: addQty }];
    });
    setAddpId('');
    setAddQty(1);
  };

  const handleSaveHamper = () => {
    if (isReadOnly) return;
    if (!hamperName || bundleProducts.length === 0) {
      alert("Please fill name and add products to bundle.");
      return;
    }

    const brandNew: GiftHamper = {
      id: `hmp-${Date.now()}`,
      name: hamperName,
      price: aggregatedBasePrice,
      discountedPrice: aggregatedBasePrice * 0.9, // 10% auto bundle discount
      products: bundleProducts,
      packagingType: selectedPackaging,
      giftMessageTemplate: giftNote,
      inventory: 20,
      status: 'Active'
    };

    setHampers(prev => [brandNew, ...prev]);
    onLogActivity(`Assembled new Gourmet Gift Bundle "${hamperName}"`, 'Product', brandNew.id);
    setIsCreating(false);

    // Reset Form
    setHamperName('');
    setGiftNote('');
    setBundleProducts([]);
  };

  const handleDelete = (id: string, name: string) => {
    if (isReadOnly) return;
    if (window.confirm(`Are you sure you want to delete bundle "${name}"?`)) {
      setHampers(prev => prev.filter(h => h.id !== id));
      onLogActivity(`Deleted Gift Bundle "${name}"`, 'Product', id);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans text-stone-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Gift Hampers & Festive Bundles</h2>
          <p className="text-xs text-stone-500 mt-1 font-normal">Package single items together, configure wrapping, customize card greeting note slips.</p>
        </div>
        {!isReadOnly && !isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#005c46] hover:bg-[#004b35] rounded-md border border-[#005c46] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Assemble Bundle Pack
          </button>
        )}
      </div>

      {isCreating ? (
        /* Create ham bundle */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Form left */}
          <div className="md:col-span-2 bg-white rounded-md border border-[#d2d2d2] p-5 space-y-4 shadow-sm font-semibold">
            <p className="text-[10px] text-stone-550 font-bold uppercase tracking-widest border-b border-[#f1f1f1] pb-2 mb-2">Build custom Gift Hamper</p>
            
            <div className="space-y-4 text-xs font-semibold text-stone-705">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Hamper Bundle Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Harvest Wellness Chest"
                  value={hamperName}
                  onChange={(e) => setHamperName(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Packaging wrap style</label>
                  <select
                    value={selectedPackaging}
                    onChange={(e) => setSelectedPackaging(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2.5 border border-[#d2d2d2] bg-white rounded-md focus:outline-none focus:border-black"
                  >
                    <option value="Premium Box">Royal Pinewood Box (+₹10.0)</option>
                    <option value="Festive Basket">Festive Woven Basket (+₹15.0)</option>
                    <option value="Eco Jute Bag">Eco-Organic Jute Sack (+₹5.0)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Gift greeting notes template card</label>
                  <input
                    type="text"
                    placeholder="Wishing you health and ultimate luxury..."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Item picker list */}
              <div className="border border-[#d2d2d2] p-4 rounded-md space-y-3 bg-[#f7f7f7]">
                <p className="text-[10px] font-bold text-[#005c46] uppercase tracking-wider">Configure Mapped Items & quantities</p>
                
                <div className="flex gap-2">
                  <select
                    value={addpId}
                    onChange={(e) => setAddpId(e.target.value)}
                    className="flex-1 text-xs font-semibold p-2 border border-[#d2d2d2] bg-white rounded-md focus:outline-none focus:border-black"
                  >
                    <option value="">Select product item to append...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={addQty}
                    onChange={(e) => setAddQty(parseInt(e.target.value) || 1)}
                    className="w-16 p-2 border border-[#d2d2d2] bg-white rounded-md focus:outline-none focus:border-black font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAppendBundleProduct}
                    className="px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add to Pack
                  </button>
                </div>

                {/* Added items list preview */}
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Appended Goods:</span>
                  {bundleProducts.length === 0 ? (
                    <p className="text-[11px] text-stone-400 italic">No items assembled inside yet.</p>
                  ) : (
                    bundleProducts.map((bp) => {
                      const mp = products.find(p => p.id === bp.productId);
                      return (
                        <div key={bp.productId} className="flex justify-between items-center bg-white border p-2 rounded text-xs">
                          <span className="font-bold">{mp?.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">Qty: {bp.quantity}</span>
                            <button
                              onClick={() => setBundleProducts(prev => prev.filter(x => x.productId !== bp.productId))}
                              className="text-rose-650 hover:text-rose-800"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Aggregated Total previews */}
          <div className="md:col-span-1 border rounded-xl p-5 space-y-4 bg-[#f0f4f8]">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5 border-b pb-1">
              <Sparkles className="h-4 w-4 text-[#008060]" /> Real-time Bundle pricing math
            </p>

            <div className="space-y-2.5 text-xs text-stone-605 font-semibold">
              <div className="flex justify-between">
                <span>Sum item costs</span>
                <span className="font-mono text-stone-905 font-bold">
                  ₹{(aggregatedBasePrice - (selectedPackaging === 'Premium Box' ? 10.0 : selectedPackaging === 'Festive Basket' ? 15.0 : 5.0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Packaging ({selectedPackaging})</span>
                <span className="font-mono text-stone-905">
                  +₹{selectedPackaging === 'Premium Box' ? '10.00' : selectedPackaging === 'Festive Basket' ? '15.00' : '5.00'}
                </span>
              </div>
              <div className="flex justify-between border-t border-dashed pt-2 font-bold select-none text-stone-900">
                <span>Computed base bundle price</span>
                <span className="font-mono font-black">₹{aggregatedBasePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 bg-[#e2f1ec] px-2 py-1 rounded font-bold">
                <span>Smart Bundle Sale Price (10% Off)</span>
                <span className="font-mono font-extrabold">₹{(aggregatedBasePrice * 0.9).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSaveHamper}
                className="flex-1 bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold py-2 rounded-lg"
              >
                Launch Bundle
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-3 border bg-white hover:bg-stone-50  text-stone-500 text-xs font-bold rounded-lg"
              >
                Dismiss
              </button>
            </div>
          </div>
          
        </div>
      ) : (
        /* Bundles catalog view list */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hampers.map((ham) => (
            <div key={ham.id} className="bg-white rounded-xl border border-stone-200 p-4.5 flex flex-col justify-between space-y-4 shadow-3xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">{ham.name}</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Wrapping: {ham.packagingType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-405 font-mono text-xs font-semibold line-through">₹{ham.price.toFixed(2)}</span>
                  <span className="text-[#008060] font-mono text-xs font-extrabold">₹{ham.discountedPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Inside items list */}
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/50 space-y-1">
                <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block mb-1">MAPPED PRODUCTS</span>
                {ham.products.map((bp) => {
                  const mpx = products.find(p => p.id === bp.productId);
                  return (
                    <div key={bp.productId} className="text-[10px] text-stone-605 flex justify-between font-semibold">
                      <span>• {mpx?.name || 'Linked Item'}</span>
                      <span className="font-bold text-stone-850 font-mono">Qty: {bp.quantity}</span>
                    </div>
                  );
                })}
              </div>

              {/* Gift Message preview */}
              <div className="text-[10px] text-stone-500 flex gap-2 font-medium bg-indigo-50/20 p-2.5 rounded border border-indigo-100">
                <MessageSquare className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                <p className="italic">"{ham.giftMessageTemplate || 'No message greeting written.'}"</p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-stone-400 font-semibold border-t pt-2.5">
                <span>Active Stock: <b>{ham.inventory} bundles</b></span>
                {!isReadOnly && (
                  <button
                    onClick={() => handleDelete(ham.id, ham.name)}
                    className="p-1.5 hover:bg-rose-50 text-rose-500 border rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
