/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tag, Plus, Trash2, Megaphone, Percent, Sparkles, BarChart2, DollarSign, RefreshCw } from 'lucide-react';
import { Coupon } from '../types.ts';

interface CouponsTabProps {
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function CouponsTab({
  coupons,
  setCoupons,
  onLogActivity
}: CouponsTabProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Partial<Coupon>>({
    id: `cp-${Date.now()}`,
    code: '',
    type: 'Percentage',
    value: 10,
    rules: { minOrderValue: 20, maxUsage: 100, currentUsage: 0, expiryDate: '2026-12-31' }
  });

  const isReadOnly = false;

  const handleSave = () => {
    if (isReadOnly) return;
    const finalCoupon = form as Coupon;
    if (!finalCoupon.code || finalCoupon.value < 0) {
      alert("Code and conversion values are required.");
      return;
    }
    finalCoupon.code = finalCoupon.code.toUpperCase();
    setCoupons(prev => [finalCoupon, ...prev]);
    onLogActivity(`Created new discount Coupon rule "${finalCoupon.code}"`, 'Coupon', finalCoupon.id);
    setIsCreating(false);
  };

  const handleDelete = (id: string, code: string) => {
    if (isReadOnly) return;
    if (window.confirm(`Are you sure you want to deactivate and remove code "${code}"?`)) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      onLogActivity(`Deactivated and deleted Coupon rule "${code}"`, 'Coupon', id);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans text-stone-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Discount Coupons & Promos</h2>
          <p className="text-xs text-stone-500 mt-1 font-normal">Generate checkout codes, percentages, cart thresholds, and review campaign metrics.</p>
        </div>
        {!isReadOnly && !isCreating && (
          <button
            onClick={() => {
              setForm({
                id: `cp-${Date.now()}`,
                code: '',
                type: 'Percentage',
                value: 10,
                rules: { minOrderValue: 20, maxUsage: 100, currentUsage: 0, expiryDate: '2026-12-31' }
              });
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#005c46] hover:bg-[#004b35] rounded-md border border-[#005c46] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Build Coupon
          </button>
        )}
      </div>

      {isCreating ? (
        /* Creator panel */
        <div className="bg-white border border-[#d2d2d2] rounded-md p-5 space-y-4 max-w-lg shadow-sm font-semibold">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-[#f1f1f1] pb-2 mb-2">Build New Coupon Promo Campaign</p>
          
          <div className="space-y-4 text-xs font-medium">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Promo Code (All CAPS)</label>
              <input
                type="text"
                placeholder="e.g. MONSOON20"
                value={form.code || ''}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full text-xs font-semibold p-2 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Discount Style</label>
                <select
                  value={form.type || 'Percentage'}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full text-xs font-semibold p-2 border border-[#d2d2d2] bg-white rounded-md focus:outline-none focus:border-black"
                >
                  <option value="Percentage">Percentage Discount (%)</option>
                  <option value="Flat">Flat Discount Amount (₹)</option>
                  <option value="Free Shipping">Free Shipping</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Conversion value</label>
                <input
                  type="number"
                  value={form.value || 0}
                  onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-2 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                  disabled={form.type === 'Free Shipping'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Min Basket Threshold (₹)</label>
                <input
                  type="number"
                  value={form.rules?.minOrderValue || 0}
                  onChange={(e) => setForm({
                    ...form,
                    rules: { ...(form.rules || { minOrderValue: 20, maxUsage: 100, currentUsage: 0, expiryDate: '2026-12-31' }), minOrderValue: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full text-xs p-2 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide font-mono">Simulated Maximum usage</label>
                <input
                  type="number"
                  value={form.rules?.maxUsage || 100}
                  onChange={(e) => setForm({
                    ...form,
                    rules: { ...(form.rules || { minOrderValue: 20, maxUsage: 100, currentUsage: 0, expiryDate: '2026-12-31' }), maxUsage: parseInt(e.target.value) || 100 }
                  })}
                  className="w-full text-xs p-2 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Campaign Expiration Details</label>
              <input
                type="date"
                value={form.rules?.expiryDate || '2026-12-31'}
                onChange={(e) => setForm({
                  ...form,
                  rules: { ...(form.rules || { minOrderValue: 20, maxUsage: 100, currentUsage: 0, expiryDate: '2026-12-31' }), expiryDate: e.target.value }
                })}
                className="w-full text-xs p-2 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 p-2 bg-[#005c46] hover:bg-[#004b35] text-white font-bold rounded-md border border-[#005c46] transition-colors"
              >
                Launch Coupon
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 border border-[#d2d2d2] hover:bg-[#f7f7f7] text-stone-500 text-xs font-bold rounded-md"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* List view coupons */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Active Promotions</p>
            
            <div className="space-y-2 font-medium">
              {coupons.map((cp) => (
                <div key={cp.id} className="bg-white border border-[#d2d2d2] rounded-md p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#ebebeb] text-[#005c46] border border-[#d2d2d2] rounded-md">
                      <Tag className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-mono text-[#2c6ecb] uppercase">{cp.code}</p>
                      <p className="text-[10px] text-stone-500 font-normal leading-normal mt-0.5">
                        {cp.type === 'Percentage' ? `${cp.value}% Off absolute order` : cp.type === 'Flat' ? `₹${cp.value} Off cart price` : 'Free shipping delivery'}
                        <span> – Min cart: ₹{cp.rules.minOrderValue}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 shrink-0">
                    <div>
                      <p className="text-[9px] text-stone-400 font-bold uppercase text-right">Usage score</p>
                      <span className="font-mono text-stone-850 font-bold block text-right mt-0.5">{cp.rules.currentUsage} / {cp.rules.maxUsage}</span>
                    </div>
                    {!isReadOnly && (
                      <button
                        onClick={() => handleDelete(cp.id, cp.code)}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-md border border-[#d2d2d2]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Analytics widget */}
          <div className="md:col-span-1 space-y-4 bg-stone-50 border border-[#d2d2d2] p-4 rounded-md">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#d2d2d2] pb-2">
              <BarChart2 className="h-3.5 w-3.5 text-stone-400" /> Promos Conversion Metrics
            </p>
            
            <div className="space-y-3 text-xs text-stone-600 font-semibold pt-1">
              <div className="bg-white p-3 border border-[#d2d2d2] rounded-md flex justify-between items-center shadow-sm">
                <span>Direct Revenue Generated</span>
                <span className="font-mono font-extrabold text-stone-900">₹10,480.00</span>
              </div>
              <div className="bg-white p-3 border border-[#d2d2d2] rounded-md flex justify-between items-center shadow-sm">
                <span>Unique customers checkout</span>
                <span className="font-mono font-extrabold text-stone-900">452</span>
              </div>
              <div className="bg-white p-3 border border-[#d2d2d2] rounded-md flex justify-between items-center shadow-sm">
                <span>Cart conversion bonus</span>
                <span className="font-mono font-extrabold text-green-700 font-semibold">+12.4%</span>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 leading-normal font-normal">
              Conversions are computed weekly by measuring unique cart interactions and checking promo parameters matches against standard users.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
