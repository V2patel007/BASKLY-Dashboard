/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, ArrowRight, ShieldAlert, Image, Globe } from 'lucide-react';
import { Category } from '../types.ts';

interface CategoriesTabProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  userRole: string; // for RBAC
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function CategoriesTab({
  categories,
  setCategories,
  userRole,
  onLogActivity
}: CategoriesTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Partial<Category>>({});

  const isReadOnly = userRole === 'Customer Support';

  const startEdit = (cat: Category) => {
    setForm({ ...cat });
    setEditingId(cat.id);
    setIsCreating(false);
  };

  const startCreate = () => {
    setForm({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      parentCategory: '',
      bannerUrl: 'https://images.unsplash.com/photo-1515488042361-404e92539b20?auto=format&fit=crop&q=80&w=400',
      seoTitle: '',
      seoDescription: '',
      productCount: 0
    });
    setEditingId('');
    setIsCreating(true);
  };

  const handleSave = () => {
    if (isReadOnly) return;
    const finalCat = form as Category;
    if (!finalCat.name || !finalCat.slug) {
      alert("Name and URL slug parameters are required.");
      return;
    }

    if (isCreating) {
      setCategories(prev => [...prev, finalCat]);
      onLogActivity(`Created new Category group "${finalCat.name}"`, 'Product', finalCat.id);
    } else {
      setCategories(prev => prev.map(c => c.id === finalCat.id ? finalCat : c));
      onLogActivity(`Modified Category group attributes of "${finalCat.name}"`, 'Product', finalCat.id);
    }
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (isReadOnly) return;
    if (window.confirm(`Are you sure you want to delete "${name}"? This will unlink it from its sub-level relations.`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
      onLogActivity(`Deleted Category group "${name}"`, 'Product', id);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans text-stone-800">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Categories</h2>
          <p className="text-xs text-stone-500 mt-1">Structure nested parent/child groups to manage deep filters and catalogs.</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#005c46] hover:bg-[#004b35] rounded-md transition-colors border border-[#005c46]"
          >
            <Plus className="h-4 w-4" />
            Create Category
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category structural listing */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Configured Nodes</p>
          
          <div className="space-y-2">
            {categories.map((cat) => {
              const isChild = !!cat.parentCategory;
              return (
                <div
                  key={cat.id}
                  className={`bg-white rounded-md border border-[#d2d2d2] p-4 flex items-center justify-between gap-4 transition-all hover:shadow-sm ${
                    isChild ? 'ml-8 border-l-4 border-l-[#2c6ecb] bg-stone-50/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-slate-50 text-stone-500 rounded-md border border-[#d2d2d2] shrink-0">
                      <Layers className="h-4 w-4 text-[#005c46]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 flex items-center gap-2">
                        {cat.name}
                        {cat.parentCategory && (
                          <span className="bg-[#ebebeb] text-[#303030] border border-[#d2d2d2] font-bold text-[8px] px-1.5 py-0.2 rounded-[3px] uppercase tracking-wide">
                            Sub of {cat.parentCategory}
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5 truncate max-w-[280px]">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-semibold text-stone-600">
                    <span className="text-xs bg-[#ebebeb] border border-[#d2d2d2] px-2 py-0.5 rounded-md font-bold text-stone-600">
                      {cat.productCount} items
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 bg-white hover:bg-[#ebebeb] text-stone-500 hover:text-stone-800 border border-[#d2d2d2] rounded-md"
                        title="Edit taxonomy parameters"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {!isReadOnly && (
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-[#d2d2d2] rounded-md"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories form controller editor */}
        <div className="md:col-span-1">
          {editingId !== null || isCreating ? (
            <div className="bg-white rounded-md border border-[#d2d2d2] p-5 space-y-4 shadow-sm">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-[#f1f1f1] pb-2 mb-2">
                {isCreating ? 'Creating Category Node' : 'Editing Category Node'}
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Category Name</label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Exotic Foods"
                    className="w-full text-xs font-semibold p-2 border border-[#d2d2d2] rounded-md focus:outline-none focus:border-black bg-[#f1f1f1]"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">SEO Slug Endpoint</label>
                  <input
                    type="text"
                    value={form.slug || ''}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="exotic-spices"
                    className="w-full text-xs font-semibold p-2 border border-[#d2d2d2] rounded-md focus:outline-none focus:border-black bg-[#f1f1f1]"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Parent level grouping (Optional)</label>
                  <select
                    value={form.parentCategory || ''}
                    onChange={(e) => setForm({ ...form, parentCategory: e.target.value })}
                    className="w-full text-xs font-semibold p-2 border border-[#d2d2d2] bg-white rounded-md focus:outline-none focus:border-black"
                    disabled={isReadOnly}
                  >
                    <option value="">None (Top-Level Primary)</option>
                    {categories
                      .filter(c => c.id !== form.id && !c.parentCategory)
                      .map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Short Description</label>
                  <textarea
                    rows={2}
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full text-xs font-semibold p-2 border border-[#d2d2d2] rounded-md focus:outline-none focus:border-black bg-[#f1f1f1]"
                    disabled={isReadOnly}
                  />
                </div>

                {/* Banner R2 link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide flex items-center gap-1">
                    <Image className="h-3.5 w-3.5 text-stone-400" />
                    Category Banner (R2 URL)
                  </label>
                  <input
                    type="text"
                    value={form.bannerUrl || ''}
                    onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                    className="w-full text-xs font-medium p-2 border border-[#d2d2d2] rounded-md font-mono bg-[#f1f1f1] truncate"
                    disabled={isReadOnly}
                  />
                </div>

                {/* SEO Fields nested */}
                <div className="border border-[#d2d2d2] bg-stone-50 p-3 rounded-md space-y-3">
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Classification tags (SEO Meta)
                  </span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title Meta tag"
                      value={form.seoTitle || ''}
                      onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                      className="w-full text-xs font-semibold p-1.5 bg-white border border-[#d2d2d2] rounded-md focus:outline-none focus:border-black"
                      disabled={isReadOnly}
                    />
                    <textarea
                      rows={2}
                      placeholder="SEO meta description snippet tags..."
                      value={form.seoDescription || ''}
                      onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                      className="w-full text-xs font-semibold p-1.5 bg-white border border-[#d2d2d2] rounded-md focus:outline-none focus:border-black"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                {!isReadOnly && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-[#005c46] hover:bg-[#004b35] text-white rounded-md text-xs font-bold py-2 shadow-xs transition-colors border border-[#005c46]"
                    >
                      Process Group
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setIsCreating(false);
                      }}
                      className="px-3 border border-[#d2d2d2] hover:bg-[#f7f7f7] bg-white text-stone-500 rounded-md text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#fcfcfc] p-4 border border-[#d2d2d2] border-dashed rounded-md text-center select-none py-12">
              <Layers className="h-8 w-8 mx-auto text-stone-300 mb-2" />
              <p className="text-xs font-bold text-stone-600">No category selected</p>
              <p className="text-[10px] text-stone-400 mt-1 max-w-[180px] mx-auto">
                Select any configure button or create new node to access visual controls.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
