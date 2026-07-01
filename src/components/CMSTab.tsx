/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Globe, LayoutTemplate, ArrowUp, ArrowDown, Check, Save } from 'lucide-react';
import { CMSPage, HomeBanner } from '../types.ts';

interface CMSTabProps {
  cmsPages: CMSPage[];
  setCmsPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  userRole: string; // for RBAC
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function CMSTab({
  cmsPages,
  setCmsPages,
  userRole,
  onLogActivity
}: CMSTabProps) {
  // Section Navigation
  const [activeSubView, setActiveSubView] = useState<'pages' | 'builder'>('pages');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [pageForm, setPageForm] = useState<Partial<CMSPage>>({});

  const isReadOnly = userRole === 'Customer Support' || userRole === 'Inventory Manager';

  // Simulated Homepage sections order state
  const [homeBanners, setHomeBanners] = useState<HomeBanner[]>([
    { id: 'b-1', title: 'The Royal Autumn Saffron Harvest', subtitle: 'Grade A++ Pampore Mongrathreads vacuum packed.', ctaText: 'Shop Saffron', ctaLink: '/products/kashmiri-mongra-saffron', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', isActive: true },
    { id: 'b-2', title: 'Himalayan Cedar Active Forest Nectar', subtitle: 'Unfiltered unpasteurized wild harvest hives.', ctaText: 'Discover Honey', ctaLink: '/products/wild-himalayan-cedar-honey', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', isActive: true }
  ]);

  const startEditPage = (page: CMSPage) => {
    setPageForm({ ...page });
    setEditingPageId(page.id);
    setIsCreatingPage(false);
  };

  const startCreatePage = () => {
    setPageForm({
      id: `cms-${Date.now()}`,
      title: '',
      slug: '',
      content: '',
      status: 'Draft',
      seoTitle: '',
      seoDescription: '',
      updatedAt: new Date().toISOString(),
      version: 1
    });
    setEditingPageId('');
    setIsCreatingPage(true);
  };

  const handleSavePage = () => {
    if (isReadOnly) return;
    const finalPage = pageForm as CMSPage;
    if (!finalPage.title || !finalPage.slug) {
      alert("Page Name and slug parameters must be configured.");
      return;
    }

    if (isCreatingPage) {
      setCmsPages(prev => [finalPage, ...prev]);
      onLogActivity(`Created custom CMS page "${finalPage.title}"`, 'CMS', finalPage.id);
    } else {
      setCmsPages(prev => prev.map(p => p.id === finalPage.id ? { ...finalPage, version: finalPage.version + 1, updatedAt: new Date().toISOString() } : p));
      onLogActivity(`Updated CMS page "${finalPage.title}"`, 'CMS', finalPage.id);
    }
    setEditingPageId(null);
    setIsCreatingPage(false);
  };

  const handleDeletePage = (id: string, title: string) => {
    if (isReadOnly) return;
    if (window.confirm(`Are you sure you want to delete and wipe "${title}" page?`)) {
      setCmsPages(prev => prev.filter(p => p.id !== id));
      onLogActivity(`Deleted CMS page "${title}"`, 'CMS', id);
    }
  };

  // Re-ordering banners
  const moveBanner = (index: number, direction: 'up' | 'down') => {
    if (isReadOnly) return;
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= homeBanners.length) return;
    
    const nextList = [...homeBanners];
    const temp = nextList[index];
    nextList[index] = nextList[nextIndex];
    nextList[nextIndex] = temp;
    setHomeBanners(nextList);
    onLogActivity("Re-ordered visual banners grid on Home Page", 'CMS', 'Banners_Order');
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans text-stone-800">
      
      {/* Tab toggle headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Content Management & CMS</h2>
          <p className="text-xs text-stone-500 mt-1">Design checkout landing copy, control homepage banners, and configure public SEO pages.</p>
        </div>

        <div className="flex bg-[#f1f1f1] p-1 rounded-md border border-[#d2d2d2] shrink-0">
          <button
            onClick={() => {
              setEditingPageId(null);
              setIsCreatingPage(false);
              setActiveSubView('pages');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSubView === 'pages' ? 'bg-white text-stone-900 border border-[#d2d2d2] shadow-sm font-bold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Custom Pages List
          </button>
          <button
            onClick={() => setActiveSubView('builder')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeSubView === 'builder' ? 'bg-white text-stone-900 border border-[#d2d2d2] shadow-sm font-bold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            Homepage Builder
          </button>
        </div>
      </div>

      {activeSubView === 'pages' ? (
        editingPageId !== null || isCreatingPage ? (
          /* PAGE SPECIFIC TEXT EDITOR FORM */
          <div className="bg-white border border-[#d2d2d2] rounded-md p-5 space-y-5 shadow-sm font-semibold">
            <div className="flex justify-between items-center border-b border-[#f1f1f1] pb-2">
              <span className="text-xs font-bold text-stone-550 uppercase font-display tracking-wider">CMS Page configuration workspace</span>
              {isReadOnly ? (
                <span className="text-rose-600 text-xs text-normal">Read Only view mode</span>
              ) : (
                <button
                  onClick={handleSavePage}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#005c46] hover:bg-[#004b35] rounded-md border border-[#005c46] transition-colors shadow-sm"
                >
                  Save CMS File
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs font-medium text-stone-705">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Page Header Title</label>
                  <input
                    type="text"
                    value={pageForm.title || ''}
                    onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                    placeholder="About our apiary coop..."
                    className="w-full text-xs font-semibold p-2.5 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Public Slug Route</label>
                  <input
                    type="text"
                    value={pageForm.slug || ''}
                    onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                    placeholder="about-natural-oils"
                    className="w-full text-xs font-semibold p-2.5 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black font-mono"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Html Body (Simulated Raw Markdown Editor)</label>
                <textarea
                  rows={8}
                  value={pageForm.content || ''}
                  onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                  placeholder="<h1>Title section</h1><p>About our legacy of Pampore farms...</p>"
                  className="w-full text-xs font-medium p-3 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black font-mono leading-relaxed"
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Status</label>
                  <select
                    value={pageForm.status || 'Draft'}
                    onChange={(e) => setPageForm({ ...pageForm, status: e.target.value as any })}
                    className="w-full text-xs font-semibold p-2 border border-[#d2d2d2] bg-white rounded-md focus:outline-none focus:border-black"
                    disabled={isReadOnly}
                  >
                    <option value="Published">Published Live</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">SEO Title override</label>
                  <input
                    type="text"
                    value={pageForm.seoTitle || ''}
                    onChange={(e) => setPageForm({ ...pageForm, seoTitle: e.target.value })}
                    className="w-full text-xs font-semibold p-2 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase">SEO Meta description</label>
                <textarea
                  rows={2}
                  value={pageForm.seoDescription || ''}
                  onChange={(e) => setPageForm({ ...pageForm, seoDescription: e.target.value })}
                  className="w-full text-xs p-2 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>
        ) : (
          /* PAGES LIST */
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-[#d2d2d2] pb-1.5">
              <span>Public static site pages</span>
              {!isReadOnly && (
                <button onClick={startCreatePage} className="text-[#005c46] hover:text-[#004b35] hover:underline cursor-pointer">
                  + Add Custom Site Page
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cmsPages.map((page) => (
                <div key={page.id} className="bg-white border border-[#d2d2d2] rounded-md p-4 flex flex-col justify-between space-y-3.5 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900">{page.title}</span>
                      <span className={`text-[8px] font-bold px-2 py-0.2 rounded-full border ${
                        page.status === 'Published' ? 'bg-green-105 text-green-700 border-transparent' : 'bg-stone-50 border-[#d2d2d2] text-stone-500'
                      }`}>
                        {page.status}
                      </span>
                    </div>
                    <p className="font-mono text-[9px] text-[#2c6ecb] mt-1 font-bold">/{page.slug}</p>
                    <p className="text-[10px] text-stone-400 mt-2 font-normal leading-normal truncate max-w-[300px]">
                      {page.seoDescription || 'No custom meta descriptions initialized.'}
                    </p>
                  </div>

                  <div className="border-t border-[#f1f1f1] pt-2.5 flex items-center justify-between text-[10px] text-stone-500 font-semibold">
                    <span>Ver. <b>{page.version}</b> • Edited: {new Date(page.updatedAt).toLocaleDateString()}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditPage(page)}
                        className="px-2 py-1 border border-[#d2d2d2] hover:bg-[#ebebeb] rounded-md text-stone-605"
                      >
                        Edit Layout
                      </button>
                      {!isReadOnly && (
                        <button
                          onClick={() => handleDeletePage(page.id, page.title)}
                          className="px-2 py-1 border border-[#d2d2d2] hover:bg-rose-50 text-rose-500 rounded-md"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* HOMEPAGE VISUAL builder DRAG-AND-DROP SIMULATED GRID layout */
        <div className="space-y-4 font-semibold">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">DRAG-AND-DROP Homepage featured banners order</p>
          
          <div className="space-y-3 max-w-xl">
            {homeBanners.map((banner, index) => (
              <div key={banner.id} className="bg-white rounded-md border border-[#d2d2d2] p-4 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={banner.imageUrl} className="w-10 h-10 object-cover rounded-md border border-[#d2d2d2]" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-stone-400 font-bold block font-mono">BANNER SLIDE AT INDEX {index + 1}</span>
                    <p className="text-xs font-bold text-stone-900 truncate">{banner.title}</p>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => moveBanner(index, 'up')}
                    className="p-1.5 border border-[#d2d2d2] hover:bg-[#ebebeb] rounded-md disabled:opacity-30"
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveBanner(index, 'down')}
                    className="p-1.5 border border-[#d2d2d2] hover:bg-[#ebebeb] rounded-md disabled:opacity-30"
                    disabled={index === homeBanners.length - 1}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-stone-50 border border-[#d2d2d2] p-4 rounded-md max-w-xl text-[10px] leading-relaxed text-stone-605">
            <b>Live synchronization rule active:</b> Drag-and-drop actions compute new visual weight values, pushing updates directly to our simulated frontend layout frame in real-time.
          </div>
        </div>
      )}

    </div>
  );
}
