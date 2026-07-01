/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  ListFilter,
  Edit2,
  Globe,
  Upload,
  Layers,
  Award,
  Truck,
  FileSpreadsheet,
  AlertCircle,
  Tag,
  ArrowLeft,
  Settings,
  Clock,
  Images,
  History,
  Calculator,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Product, Variant, LabCertificateMapping } from '../types.ts';
import { formatPrice } from '../utils.ts';

interface ProductsTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  labCertificates: LabCertificateMapping[];
  userRole: string; // for RBAC controls
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
  currency: string;
}

export default function ProductsTab({
  products,
  setProducts,
  labCertificates,
  userRole,
  onLogActivity,
  currency
}: ProductsTabProps) {
  // Navigation & Listing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');
  const [inventoryFilter, setInventoryFilter] = useState<'All' | 'Low Stock' | 'OutOfStock'>('All');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // RBAC checks
  const isReadOnly = userRole === 'Customer Support';

  // Editor states (binds to active product)
  const [editorTab, setEditorTab] = useState<'general' | 'media' | 'variants' | 'inventory' | 'seo' | 'shipping' | 'certificates' | 'bulk-pricing'>('general');
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [newVarSize, setNewVarSize] = useState('');
  const [newVarPrice, setNewVarPrice] = useState(0);
  const [newVarInv, setNewVarInv] = useState(1);
  const [dragActive, setDragActive] = useState(false);

  // Interactive Wholesale / Bulk Pricing Calculator States
  const [wholesaleTargetVolume, setWholesaleTargetVolume] = useState<number>(500); // units
  const [wholesaleTier1Discount, setWholesaleTier1Discount] = useState<number>(10); // %
  const [wholesaleTier2Discount, setWholesaleTier2Discount] = useState<number>(20); // %
  const [wholesaleTier3Discount, setWholesaleTier3Discount] = useState<number>(35); // %
  const [wholesaleTier1Moq, setWholesaleTier1Moq] = useState<number>(10); // MOQ
  const [wholesaleTier2Moq, setWholesaleTier2Moq] = useState<number>(50); // MOQ
  const [wholesaleTier3Moq, setWholesaleTier3Moq] = useState<number>(200); // MOQ

  // Filter list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    
    let matchesInventory = true;
    if (inventoryFilter === 'Low Stock') {
      matchesInventory = p.inventory <= p.lowStockThreshold;
    } else if (inventoryFilter === 'OutOfStock') {
      matchesInventory = p.inventory === 0;
    }

    return matchesSearch && matchesStatus && matchesInventory;
  });

  // Bulk Actions
  const handleBulkStatusChange = (status: 'Active' | 'Draft' | 'Archived') => {
    if (isReadOnly) return;
    setProducts(prev => prev.map(p => selectedProductIds.includes(p.id) ? { ...p, status } : p));
    onLogActivity(`Bulk updated status of ${selectedProductIds.length} items to ${status}`, 'Product', selectedProductIds.join(', '));
    setSelectedProductIds([]);
  };

  const handleBulkDelete = () => {
    if (isReadOnly) return;
    if (window.confirm(`Are you sure you want to delete ${selectedProductIds.length} products?`)) {
      setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.id)));
      onLogActivity(`Bulk deleted ${selectedProductIds.length} items`, 'Product', selectedProductIds.join(', '));
      setSelectedProductIds([]);
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Product Name,SKU,Category,Price,Inventory,Status"].join(",") + "\n"
      + filteredProducts.map(p => `"${p.name}","${p.sku}","${p.category}",${p.price},${p.inventory},"${p.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Baskly_Products_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Select Item for editing
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setIsCreatingNew(false);
    setEditForm({ ...p });
    setEditorTab('general');
  };

  const startCreate = () => {
    const prodId = `prod-${Date.now()}`;
    const randSuffix = Math.floor(100 + Math.random() * 900);
    const initialSku = `KAS-PROD-${randSuffix}`;
    setEditingId('');
    setIsCreatingNew(true);
    setEditForm({
      id: prodId,
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: 'kashmiri-saffron',
      price: 0,
      inventory: 0,
      lowStockThreshold: 10,
      sku: initialSku,
      status: 'Draft',
      images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400'],
      variants: [],
      seoTitle: '',
      seoDescription: '',
      shippingWeight: 0.1,
      shippingDimensions: { length: 10, width: 10, height: 10 },
      hsnCode: '',
      certificates: [],
      updatedAt: new Date().toISOString()
    });
    setEditorTab('general');
  };

  // Save changes
  const saveProduct = () => {
    if (isReadOnly) return;
    const finalProduct = editForm as Product;
    if (!finalProduct.name || !finalProduct.sku) {
      alert("Name and SKU are required fields.");
      return;
    }

    if (isCreatingNew) {
      setProducts(prev => [finalProduct, ...prev]);
      onLogActivity(`Created new catalog product "${finalProduct.name}"`, 'Product', finalProduct.id);
    } else {
      setProducts(prev => prev.map(p => p.id === finalProduct.id ? finalProduct : p));
      onLogActivity(`Modified product parameters of "${finalProduct.name}"`, 'Product', finalProduct.id);
    }

    setEditingId(null);
    setIsCreatingNew(false);
  };

  // Drag-and-drop simulated file upload logic
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Simulate adding to Cloudflare R2
      const fakeUrl = "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400";
      setEditForm(prev => ({
        ...prev,
        images: [...(prev.images || []), fakeUrl]
      }));
    }
  };

  // Variants builder helper
  const addVariant = () => {
    if (!newVarSize || newVarPrice <= 0) return;
    const newV: Variant = {
      id: `v-${Date.now()}`,
      size: newVarSize,
      sku: `${editForm.sku || 'VARI'}-${newVarSize.toUpperCase()}`,
      price: newVarPrice,
      inventory: newVarInv,
      lowStockThreshold: 5
    };
    setEditForm(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newV],
      // Total inventory aggregation
      inventory: (prev.inventory || 0) + newVarInv
    }));
    setNewVarSize('');
    setNewVarPrice(0);
    setNewVarInv(1);
  };

  return (
    <div className="space-y-6 select-none font-sans text-stone-800">
      
      {!editingId && !isCreatingNew ? (
        <>
          {/* Top Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
            <div>
              <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Products</h2>
              <p className="text-xs text-stone-500 mt-1">Configure catalogs, dynamic variants, pricing layers, and lab certifications.</p>
            </div>
            {!isReadOnly && (
              <button
                onClick={startCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#005c46] hover:bg-[#004b35] rounded-md transition-colors border border-[#005c46]"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            )}
          </div>

          {/* Search, Filter Toolbar & Export */}
          <div className="bg-white border border-[#d2d2d2] rounded-md p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter products by name, variant SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-4 py-2 border border-[#d2d2d2] focus:outline-none focus:border-black rounded-md"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-nowrap shrink-0">
                
                {/* Status Dropdowns */}
                <span className="text-[11px] font-bold text-stone-500 uppercase shrink-0">Status:</span>
                {(['All', 'Active', 'Draft', 'Archived'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors shrink-0 ${
                      statusFilter === st
                        ? 'bg-[#ebebeb] text-[#303030] border-[#d2d2d2]'
                        : 'bg-white text-stone-600 border-[#d2d2d2] hover:bg-[#f7f7f7]'
                    }`}
                  >
                    {st}
                  </button>
                ))}

                <div className="h-5 w-px bg-[#d2d2d2] mx-2" />

                {/* Stock dropdown */}
                <span className="text-[11px] font-bold text-stone-500 uppercase shrink-0">Stock:</span>
                {(['All', 'Low Stock', 'OutOfStock'] as const).map((inv) => (
                  <button
                    key={inv}
                    onClick={() => setInventoryFilter(inv)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors shrink-0 ${
                      inventoryFilter === inv
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-white text-stone-600 border-[#d2d2d2] hover:bg-[#f7f7f7]'
                    }`}
                  >
                    {inv}
                  </button>
                ))}
              </div>

              {/* CSV Exporter */}
              <button
                onClick={exportCSV}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-[#d2d2d2] bg-white hover:bg-[#f7f7f7] rounded-md text-stone-700 md:ml-auto"
                title="Export catalog list values"
              >
                <FileSpreadsheet className="h-4 w-4 text-[#005c46]" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Bulk Selection actions row */}
            {selectedProductIds.length > 0 && !isReadOnly && (
              <div className="bg-[#ebebeb] border border-[#d2d2d2] rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
                <span className="text-xs font-bold text-stone-800">
                  {selectedProductIds.length} product(s) selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkStatusChange('Active')}
                    className="px-3 py-1 bg-white hover:bg-stone-50 border border-[#d2d2d2] rounded text-xs font-bold text-stone-700"
                  >
                    Publish (Active)
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('Draft')}
                    className="px-3 py-1 bg-white hover:bg-stone-50 border border-[#d2d2d2] rounded text-xs font-bold text-stone-700"
                  >
                    Demote to Draft
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-white hover:bg-rose-50 border border-rose-200 rounded text-xs font-bold text-rose-600 flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky responsive Data Table */}
          <div className="bg-white rounded-md border border-[#d2d2d2] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead className="bg-[#f9f9f9]">
                  <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-tight border-b border-[#d2d2d2] select-none">
                    <th className="py-2.5 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(filteredProducts.map(p => p.id));
                          } else {
                            setSelectedProductIds([]);
                          }
                        }}
                        className="rounded text-[#005c46] focus:ring-[#005c46]"
                      />
                    </th>
                    <th className="py-2.5 px-4 font-normal">Image</th>
                    <th className="py-2.5 px-4">Product details</th>
                    <th className="py-2.5 px-4 font-normal">SKU Code</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-center">Shelf Life</th>
                    <th className="py-2.5 px-4 text-center">Inventory</th>
                    <th className="py-2.5 px-4 text-right">Selling Price</th>
                    <th className="py-2.5 px-4 text-right">Marginal Rate</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f1f1] text-xs">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-stone-400 font-medium">
                        <AlertCircle className="h-8 w-8 mx-auto text-stone-300 mb-2" />
                        No matching e-commerce products for this search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isSelected = selectedProductIds.includes(p.id);
                      const totalInv = p.variants.length > 0 ? p.variants.reduce((sum, v) => sum + v.inventory, 0) : p.inventory;
                      const hasLowStock = totalInv <= p.lowStockThreshold;

                      return (
                        <tr key={p.id} className={`hover:bg-gray-50/70 ${isSelected ? 'bg-gray-100/40' : ''}`}>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIds(prev => [...prev, p.id]);
                                } else {
                                  setSelectedProductIds(prev => prev.filter(id => id !== p.id));
                                }
                              }}
                              className="rounded text-[#005c46] focus:ring-[#005c46]"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="h-10 w-10 rounded-md border border-[#d2d2d2] overflow-hidden shrink-0 bg-stone-50">
                              <img
                                src={p.images[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=40'}
                                alt={p.name}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 min-w-[200px]">
                            <p className="font-bold text-stone-900 hover:text-[#005c46] cursor-pointer hover:underline" onClick={() => startEdit(p)}>
                              {p.name}
                            </p>
                            <p className="text-[10px] text-stone-400 mt-0.5 font-medium truncate max-w-[250px]">
                              {p.shortDescription}
                            </p>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-stone-500">{p.sku}</td>
                          <td className="py-3 px-4">
                            <span className="inline-block bg-[#ebebeb] text-stone-700 font-bold px-2 py-0.5 rounded text-[10px] border border-[#d2d2d2]">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-stone-600 font-medium">
                            {p.shelfLife || '12 Months'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block font-bold font-mono px-2 py-0.5 rounded text-[10px] ${
                              totalInv === 0
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : hasLowStock
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'text-stone-700 bg-stone-100 border border-[#d2d2d2]'
                            }`}>
                              {totalInv} units
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-stone-900">
                            {formatPrice(p.price, currency)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {(() => {
                              const cost = p.costPrice || (p.price * 0.4);
                              const rate = ((p.price - cost) / p.price) * 100;
                              return (
                                <span className="inline-block font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                                  {rate.toFixed(1)}%
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'Active'
                                ? 'bg-green-105 text-green-700'
                                : p.status === 'Draft'
                                ? 'bg-stone-50 text-stone-605'
                                : 'bg-red-105 text-red-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => startEdit(p)}
                              className="inline-flex p-1.5 bg-white hover:bg-[#ebebeb] text-[#303030] rounded-md border border-[#d2d2d2] transition-colors"
                              title="Edit complete product details"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Dynamic 7-Tab Product Editor panel view */
        <div className="bg-white rounded-xl border border-stone-200 shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <button
              onClick={() => {
                setEditingId(null);
                setIsCreatingNew(false);
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Catalogs</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-400 font-mono">ID: {editForm.id}</span>
              {!isReadOnly && (
                <button
                  onClick={saveProduct}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#008060] hover:bg-[#006e52] rounded-lg shadow-sm font-semibold transition-colors"
                >
                  Save Entity
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* left column tab buttons navigator */}
            <div className="md:col-span-1 space-y-1">
              <p className="px-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Sections Editor</p>
              {[
                { id: 'general', label: 'General info', icon: Tag },
                { id: 'media', label: 'Media upload', icon: Images },
                { id: 'variants', label: 'Variants list', icon: Layers },
                { id: 'inventory', label: 'Stock balance', icon: Clock },
                { id: 'seo', label: 'SEO tags', icon: Globe },
                { id: 'shipping', label: 'Carrier shipping', icon: Truck },
                { id: 'certificates', label: 'Lab mappings', icon: Award },
                { id: 'bulk-pricing', label: 'Wholesale pricing', icon: Calculator }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setEditorTab(tab.id as any)}
                    className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                      editorTab === tab.id
                        ? 'bg-stone-950 text-white shadow-xs font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* active tab form containers */}
            <div className="md:col-span-3 border border-stone-100 rounded-xl p-5 space-y-5 bg-stone-50/50">

              {/* TAB 1: GENERAL INFO */}
              {editorTab === 'general' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">General Information</h3>
                    <span className="text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono text-indigo-700">Meta Fields</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Product Title</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setEditForm(prev => {
                            const catPrefix = (prev.category || 'GEN').substring(0, 3).toUpperCase();
                            const nameClean = newName
                              .replace(/[^a-zA-Z0-9]/g, '')
                              .substring(0, 6)
                              .toUpperCase();
                            const suffix = prev.id ? prev.id.substring(prev.id.length - 3).toUpperCase() : '101';
                            
                            // If the SKU matches standard default templates, auto-update it with the clean title
                            const isDefaultOrEmpty = !prev.sku || 
                              prev.sku === '' || 
                              prev.sku.startsWith('KAS-PROD-') || 
                              prev.sku.startsWith(`${catPrefix}-PROD-`) ||
                              prev.sku === `${catPrefix}-PROD-${suffix}`;

                            const updatedSku = isDefaultOrEmpty && nameClean
                              ? `${catPrefix}-${nameClean}-${suffix}`
                              : (prev.sku || `${catPrefix}-PROD-${suffix}`);

                            return {
                              ...prev,
                              name: newName,
                              sku: updatedSku,
                              slug: !prev.slug || prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                ? newName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                : prev.slug
                            };
                          });
                        }}
                        placeholder="e.g. Kashmir Lacha Saffron"
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008060]"
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide font-mono">Internal SKU</label>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              const catPrefix = (editForm.category || 'GEN').substring(0, 3).toUpperCase();
                              const nameClean = (editForm.name || 'PROD')
                                .replace(/[^a-zA-Z0-9]/g, '')
                                .substring(0, 6)
                                .toUpperCase();
                              const randomSuffix = Math.floor(100 + Math.random() * 900);
                              setEditForm(prev => ({ ...prev, sku: `${catPrefix}-${nameClean}-${randomSuffix}` }));
                            }}
                            className="text-[9px] font-bold text-[#008060] bg-[#e2f1ec] px-1.5 py-0.5 rounded hover:bg-[#c9e7dd] transition-colors"
                          >
                            Auto Gen SKU
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editForm.sku || ''}
                        onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                        placeholder="SKU-GEN-01"
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008060]"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Short Excerpt (Sellers Card description)</label>
                    <input
                      type="text"
                      value={editForm.shortDescription || ''}
                      onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                      placeholder="Brief overview of properties..."
                      className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008060]"
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Detailed Shopify Body (Rich HTML text editor preview)</label>
                    <textarea
                      rows={5}
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Specify harvesting dates, culinary recommendations..."
                      className="w-full text-xs font-medium px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008060] font-mono leading-relaxed"
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Status Setting</label>
                      <select
                        value={editForm.status || 'Draft'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        className="w-full text-xs font-semibold px-2 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      >
                        <option value="Active">Active (Publish live)</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Base Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price || 0}
                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Promotional discounted price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.promoPrice || ''}
                        onChange={(e) => setEditForm({ ...editForm, promoPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  {/* SHELF LIFE AND COST PRICE BREAKDOWN SECTION */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dashed border-stone-200">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Cost Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.costPrice || ''}
                        onChange={(e) => setEditForm({ ...editForm, costPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="Merchant cost"
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Shelf Life</label>
                      <input
                        type="text"
                        value={editForm.shelfLife || ''}
                        onChange={(e) => setEditForm({ ...editForm, shelfLife: e.target.value })}
                        placeholder="e.g. 18 Months"
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="bg-[#fcfdfc] p-2.5 rounded-lg border border-emerald-100 flex flex-col justify-between">
                      <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide">Calculated Margin</p>
                      {(() => {
                        const price = editForm.price || 0;
                        const cost = editForm.costPrice || 0;
                        if (price > 0 && cost > 0) {
                          const marginAmt = price - cost;
                          const marginPct = (marginAmt / price) * 100;
                          return (
                            <div>
                              <p className="text-sm font-bold text-emerald-950 font-mono">₹{marginAmt.toFixed(2)}</p>
                              <p className="text-[9px] text-emerald-600 font-bold">{marginPct.toFixed(1)}% Marginal Rate</p>
                            </div>
                          );
                        }
                        return <p className="text-[10px] text-stone-400 italic">Enter price & cost to calculate margin</p>;
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA UPLOAD SIMULATOR (CLOUDFLARE R2 INTEGRATION) */}
              {editorTab === 'media' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">Cloudflare R2 Storage Upload manager</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Drag multiple high-resolution photos below. Assets are automatically sorted and compressed natively in real-time.</p>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive
                        ? 'bg-indigo-50 border-indigo-500'
                        : 'bg-white border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    <Upload className="h-8 w-8 mx-auto text-stone-400 mb-2.5 animate-bounce" />
                    <p className="text-xs font-bold text-stone-700">Drag & Drop visual file assets</p>
                    <p className="text-[10px] text-stone-400 mt-1">Accepts high-quality JPED, PNG, WEBP files up to 5MB</p>
                    <input
                      type="file"
                      id="sim-file"
                      className="hidden"
                      onChange={() => {
                        const fakeUrl = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400";
                        setEditForm(prev => ({
                          ...prev,
                          images: [...(prev.images || []), fakeUrl]
                        }));
                      }}
                    />
                    <label htmlFor="sim-file" className="inline-block mt-4 text-[10px] font-bold text-[#008060] bg-[#f1fcf9] select-none border border-[#008060] rounded px-3 py-1.5 cursor-pointer hover:bg-[#e2f1ec]">
                      Pick File manually
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Active Assets (SIMULATED ON CLOUDFLARE R2 BUCKET)</p>
                    <div className="grid grid-cols-4 gap-3">
                      {(editForm.images || []).map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg border border-stone-200 overflow-hidden bg-stone-100 aspect-square">
                          <img src={img} alt="Product media slide" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => {
                                setEditForm(prev => ({
                                  ...prev,
                                  images: (prev.images || []).filter((_, i) => i !== idx)
                                }));
                              }}
                              className="p-1 bg-white hover:bg-rose-100 text-rose-600 rounded"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-[#008060] text-white font-bold px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wide">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VARIANTS LIST BUILDER */}
              {editorTab === 'variants' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">Multi Variant Dimensions Configurator</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Define multi-packs, varying sizes, weight measurements, or premium packaging boxes.</p>
                  </div>

                  {/* Add variant row */}
                  {!isReadOnly && (
                    <div className="bg-white p-4.5 rounded-lg border border-stone-200 space-y-3">
                      <p className="text-[10px] font-bold text-[#008060] uppercase tracking-wider">Create Custom Variant Option</p>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <input
                          type="text"
                          placeholder="Size (e.g. 100g, 1L, Case)"
                          value={newVarSize}
                          onChange={(e) => setNewVarSize(e.target.value)}
                          className="text-xs font-semibold p-2 border border-stone-200 rounded-lg focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Price (₹)"
                          step="0.01"
                          value={newVarPrice || ''}
                          onChange={(e) => setNewVarPrice(parseFloat(e.target.value) || 0)}
                          className="text-xs font-semibold p-2 border border-stone-200 rounded-lg focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Initial Stock"
                          value={newVarInv || ''}
                          onChange={(e) => setNewVarInv(parseInt(e.target.value) || 0)}
                          className="text-xs font-semibold p-2 border border-stone-200 rounded-lg focus:outline-none"
                        />
                        <button
                          onClick={addVariant}
                          className="bg-stone-900 border border-stone-950 text-white rounded-lg text-xs font-bold py-2 hover:bg-stone-850"
                        >
                          Append Variant
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Render list of existing variants */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Configured Variants Matrix</p>
                    {(editForm.variants || []).length === 0 ? (
                      <p className="text-xs text-stone-400 py-3 text-center border bg-white rounded-lg">Single default standard variant active.</p>
                    ) : (
                      (editForm.variants || []).map((v) => (
                        <div key={v.id} className="bg-white p-3.5 border border-stone-200 rounded-lg flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-stone-950">Option: {v.size || 'Standard'}</p>
                            <span className="font-mono text-[9px] text-stone-400 font-bold uppercase shrink-0">SKU: {v.sku}</span>
                          </div>
                          <div className="flex gap-4 items-center">
                            <span className="text-xs font-semibold text-stone-600">Price: <b>₹{v.price}</b></span>
                            <span className="text-xs font-semibold text-stone-600">Qty: <b>{v.inventory}</b></span>
                            {!isReadOnly && (
                              <button
                                onClick={() => {
                                  setEditForm(prev => ({
                                    ...prev,
                                    variants: (prev.variants || []).filter((vr) => vr.id !== v.id)
                                  }));
                                }}
                                className="p-1 hover:bg-rose-50 text-rose-500 rounded"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: STOCK BALANCE (INVENTORY MANAGEMENT) */}
              {editorTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">Inventory Levels & Smart Threshold Alert</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Primary Stock Units</label>
                      <input
                        type="number"
                        value={editForm.inventory || 0}
                        onChange={(e) => setEditForm({ ...editForm, inventory: parseInt(e.target.value) || 0 })}
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly || (editForm.variants || []).length > 0}
                      />
                      {(editForm.variants || []).length > 0 && (
                        <p className="text-[10px] text-indigo-600 font-medium">Stock is automatically aggregated from variants.</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Low Stock Alert Threshold</label>
                      <input
                        type="number"
                        value={editForm.lowStockThreshold || 0}
                        onChange={(e) => setEditForm({ ...editForm, lowStockThreshold: parseInt(e.target.value) || 0 })}
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-[10px] text-amber-800 space-y-1">
                    <span className="font-bold block">Automatic low-stock threshold rule active</span>
                    <span>When total stock matches or falls below threshold, the Shopify dashboard marks it as a Critical Task, appending notifications in both internal and logistics departments instantly.</span>
                  </div>
                </div>
              )}

              {/* TAB 5: SEO SETTINGS */}
              {editorTab === 'seo' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">Search Engine Optimization (SEO Meta-tags)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Custom Meta Title</label>
                      <input
                        type="text"
                        value={editForm.seoTitle || ''}
                        onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                        placeholder="Premium Spices | Baskly"
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">SEO Slug URL</label>
                      <input
                        type="text"
                        value={editForm.slug || ''}
                        onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                        placeholder="imported-honey-box"
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Search Meta Description (Google snippet text limit)</label>
                    <textarea
                      rows={3}
                      value={editForm.seoDescription || ''}
                      onChange={(e) => setEditForm({ ...editForm, seoDescription: e.target.value })}
                      placeholder="Enter details displayed to index bots..."
                      className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                      disabled={isReadOnly}
                    />
                  </div>

                  {/* Real-time Google Card preview snippet */}
                  <div className="bg-white p-4.5 rounded-lg border border-stone-200 space-y-1 shadow-3xs select-none">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Google SERP Snippet Preview</p>
                    <p className="text-[#1a0dab] text-xs font-semibold break-all truncate leading-relaxed">
                      {editForm.seoTitle || editForm.name || 'Title Placeholder'}
                    </p>
                    <p className="text-[#006621] text-[10px] break-all">
                      https://baskly.com/products/{editForm.slug || 'slug-placeholder'}
                    </p>
                    <p className="text-stone-600 text-[11px] leading-snug">
                      {editForm.seoDescription || editForm.shortDescription || 'Search snippets will show here. Configure details above.'}
                    </p>
                  </div>

                  {/* OG Image / Social Cover section */}
                  <div className="space-y-3 pt-3 border-t border-dashed border-stone-200">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Social Sharing OG Cover Image (OpenGraph)</label>
                      <label className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#008060] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!editForm.ogImage || editForm.ogImage === (editForm.images && editForm.images[0])}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditForm(prev => ({ ...prev, ogImage: prev.images && prev.images[0] }));
                            } else {
                              setEditForm(prev => ({ ...prev, ogImage: (prev.images && prev.images[0]) || '' }));
                            }
                          }}
                          className="rounded text-[#008060] focus:ring-[#008060]"
                        />
                        Same image as cover image
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <div className="grow">
                        <input
                          type="text"
                          value={editForm.ogImage || ''}
                          onChange={(e) => setEditForm({ ...editForm, ogImage: e.target.value })}
                          placeholder="https://example.com/social-cover.jpg"
                          className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none disabled:bg-stone-100 disabled:text-stone-400"
                          disabled={isReadOnly || (!editForm.ogImage || editForm.ogImage === (editForm.images && editForm.images[0]))}
                        />
                      </div>
                      <div className="h-9 w-12 border border-stone-200 bg-stone-50 rounded overflow-hidden shrink-0">
                        <img
                          src={editForm.ogImage || (editForm.images && editForm.images[0]) || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=40'}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CARRIER SHIPPING CONFIG */}
              {editorTab === 'shipping' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">Shiprocket Dimensions & Customs Codes</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Parameters are parsed directly, establishing automated shipping rate calculations on Shiprocket.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Customs HSN Tariff Code</label>
                      <input
                        type="text"
                        value={editForm.hsnCode || ''}
                        onChange={(e) => setEditForm({ ...editForm, hsnCode: e.target.value })}
                        placeholder="HSN 04090000"
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Gross Box Weight (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.shippingWeight || 0.1}
                        onChange={(e) => setEditForm({ ...editForm, shippingWeight: parseFloat(e.target.value) || 0.1 })}
                        className="w-full text-xs font-semibold px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Box Dimensions (L x W x H in cm)</p>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        placeholder="Length"
                        value={editForm.shippingDimensions?.length || 10}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          shippingDimensions: { ...(editForm.shippingDimensions || { length: 10, width: 10, height: 10 }), length: parseInt(e.target.value) || 10 }
                        })}
                        className="text-xs font-semibold p-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                      <input
                        type="number"
                        placeholder="Width"
                        value={editForm.shippingDimensions?.width || 10}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          shippingDimensions: { ...(editForm.shippingDimensions || { length: 10, width: 10, height: 10 }), width: parseInt(e.target.value) || 10 }
                        })}
                        className="text-xs font-semibold p-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                      <input
                        type="number"
                        placeholder="Height"
                        value={editForm.shippingDimensions?.height || 10}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          shippingDimensions: { ...(editForm.shippingDimensions || { length: 10, width: 10, height: 10 }), height: parseInt(e.target.value) || 10 }
                        })}
                        className="text-xs font-semibold p-2 border border-stone-200 bg-white rounded-lg focus:outline-none"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: LAB CERTIFICATE RELATIONSHIPS */}
              {editorTab === 'certificates' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">Lab Certificates Association Matrix</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Link tested regional reports which will displays directly on the public storefront.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Toggle Active Mappings</p>
                    {labCertificates.length === 0 ? (
                      <p className="text-xs text-stone-400">Initialize lab certificate records first.</p>
                    ) : (
                      labCertificates.map((cert) => {
                        const isMapped = (editForm.certificates || []).some((c) => c.id === cert.id);
                        return (
                          <div key={cert.id} className="flex items-center justify-between p-3.5 bg-white border border-stone-200 rounded-lg shadow-3xs hover:bg-stone-50 transition-colors">
                            <div>
                              <p className="text-xs font-bold text-stone-900">{cert.name}</p>
                              <p className="text-[9px] text-[#008060] mt-0.5">Expires: {cert.expiryDate}</p>
                            </div>
                            <button
                              onClick={() => {
                                if (isMapped) {
                                  setEditForm({
                                    ...editForm,
                                    certificates: (editForm.certificates || []).filter((c) => c.id !== cert.id)
                                  });
                                } else {
                                  setEditForm({
                                    ...editForm,
                                    certificates: [...(editForm.certificates || []), cert]
                                  });
                                }
                              }}
                              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-colors ${
                                isMapped
                                  ? 'bg-[#008060] text-white border-[#008160]'
                                  : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                              }`}
                              disabled={isReadOnly}
                            >
                              {isMapped ? 'Mapped' : 'Click to Link'}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8: BULK PRICING & WHOLESALE TIER CALCULATOR */}
              {editorTab === 'bulk-pricing' && (() => {
                const regularPrice = editForm.price || 0;
                const unitCost = editForm.costPrice || (regularPrice * 0.45);
                const isDerivedCost = !editForm.costPrice || editForm.costPrice === 0;

                const currentUnitProfit = Math.max(0, regularPrice - unitCost);
                const currentMarginPct = regularPrice > 0 ? (currentUnitProfit / regularPrice) * 100 : 0;

                // Tier 1 calculation
                const tier1Price = regularPrice * (1 - wholesaleTier1Discount / 100);
                const tier1Profit = Math.max(0, tier1Price - unitCost);
                const tier1MarginPct = tier1Price > 0 ? (tier1Profit / tier1Price) * 100 : 0;
                const tier1ProjectedProfit = tier1Profit * wholesaleTargetVolume;
                const tier1ProjectedRevenue = tier1Price * wholesaleTargetVolume;

                // Tier 2 calculation
                const tier2Price = regularPrice * (1 - wholesaleTier2Discount / 100);
                const tier2Profit = Math.max(0, tier2Price - unitCost);
                const tier2MarginPct = tier2Price > 0 ? (tier2Profit / tier2Price) * 100 : 0;
                const tier2ProjectedProfit = tier2Profit * wholesaleTargetVolume;
                const tier2ProjectedRevenue = tier2Price * wholesaleTargetVolume;

                // Tier 3 calculation
                const tier3Price = regularPrice * (1 - wholesaleTier3Discount / 100);
                const tier3Profit = Math.max(0, tier3Price - unitCost);
                const tier3MarginPct = tier3Price > 0 ? (tier3Profit / tier3Price) * 100 : 0;
                const tier3ProjectedProfit = tier3Profit * wholesaleTargetVolume;
                const tier3ProjectedRevenue = tier3Price * wholesaleTargetVolume;

                const hasSavedTiers = editForm.wholesaleTiers && editForm.wholesaleTiers.length > 0;

                return (
                  <div className="space-y-5 animate-fade-in text-stone-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-3">
                      <div>
                        <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider flex items-center gap-1.5">
                          Bulk Pricing & Wholesale Tier Optimizer
                        </h3>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          Configure sliding-scale bulk order tiers. Simulates profits and recommends wholesale discounts based on raw cost structure.
                        </p>
                      </div>
                      <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider self-start sm:self-center">
                        Active Simulation
                      </span>
                    </div>

                    {/* Current Economics Summary banner */}
                    <div className="bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-200 p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Regular Retail Price</span>
                        <p className="text-sm font-black text-stone-900 font-mono mt-0.5">₹{regularPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      </div>

                      <div>
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">
                          Unit Cost Price {isDerivedCost && ' (Derived)'}
                        </span>
                        <p className="text-sm font-black text-stone-700 font-mono mt-0.5">₹{unitCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        {isDerivedCost && <p className="text-[8px] text-amber-600 font-medium">45% cost fallback estimate</p>}
                      </div>

                      <div>
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Current Unit Profit</span>
                        <p className="text-sm font-black text-stone-950 font-mono mt-0.5">₹{currentUnitProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      </div>

                      <div>
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Current Retail Margin</span>
                        <span className="inline-block px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-stone-950 text-white mt-1">
                          {currentMarginPct.toFixed(1)}% Margin
                        </span>
                      </div>
                    </div>

                    {/* Simulation Parameters section */}
                    <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
                      <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Simulator Controls & Assumptions</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        {/* Target Sales Volume Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center font-bold text-stone-600 uppercase text-[10px]">
                            <span>Projected Campaign Volume</span>
                            <span className="font-mono text-stone-900 font-extrabold">{wholesaleTargetVolume.toLocaleString()} units</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="5000"
                            step="50"
                            value={wholesaleTargetVolume}
                            onChange={(e) => setWholesaleTargetVolume(parseInt(e.target.value))}
                            className="w-full accent-[#005c46] h-1 bg-stone-200 rounded-lg cursor-pointer"
                          />
                          <p className="text-[9px] text-stone-400">Projected target units sold to simulate revenue and gross margins.</p>
                        </div>

                        {/* Cost Price override field */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Adjust Cost Price for Simulation (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={editForm.costPrice || 0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setEditForm(prev => ({ ...prev, costPrice: val }));
                            }}
                            placeholder="Enter custom cost"
                            className="w-full text-xs font-semibold p-2 border border-stone-200 bg-stone-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#008060]"
                          />
                          <p className="text-[9px] text-stone-400">Override the raw product cost to audit profit impact dynamically.</p>
                        </div>
                      </div>

                      {/* Tier Discount Controls */}
                      <div className="pt-2 border-t border-stone-100">
                        <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block mb-3">Sliding Tier Settings</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          
                          {/* Tier 1 */}
                          <div className="bg-stone-50/50 p-3 rounded-lg border border-stone-200 space-y-2">
                            <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider block">Tier 1: Small Bulk</span>
                            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                              <div>
                                <label className="text-[8px] text-stone-400 uppercase font-bold block mb-0.5">MOQ Limit</label>
                                <input
                                  type="number"
                                  min="2"
                                  value={wholesaleTier1Moq}
                                  onChange={(e) => setWholesaleTier1Moq(parseInt(e.target.value) || 2)}
                                  className="w-full font-bold p-1 bg-white border border-stone-200 rounded focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-stone-400 uppercase font-bold block mb-0.5">Discount %</label>
                                <input
                                  type="number"
                                  min="1"
                               max="90"
                                  value={wholesaleTier1Discount}
                                  onChange={(e) => setWholesaleTier1Discount(parseInt(e.target.value) || 0)}
                                  className="w-full font-bold p-1 bg-white border border-stone-200 rounded focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Tier 2 */}
                          <div className="bg-stone-50/50 p-3 rounded-lg border border-stone-200 space-y-2">
                            <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider block">Tier 2: Medium Bulk</span>
                            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                              <div>
                                <label className="text-[8px] text-stone-400 uppercase font-bold block mb-0.5">MOQ Limit</label>
                                <input
                                  type="number"
                                  min="2"
                                  value={wholesaleTier2Moq}
                                  onChange={(e) => setWholesaleTier2Moq(parseInt(e.target.value) || 2)}
                                  className="w-full font-bold p-1 bg-white border border-stone-200 rounded focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-stone-400 uppercase font-bold block mb-0.5">Discount %</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="90"
                                  value={wholesaleTier2Discount}
                                  onChange={(e) => setWholesaleTier2Discount(parseInt(e.target.value) || 0)}
                                  className="w-full font-bold p-1 bg-white border border-stone-200 rounded focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Tier 3 */}
                          <div className="bg-stone-50/50 p-3 rounded-lg border border-stone-200 space-y-2">
                            <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Tier 3: Distributor VIP</span>
                            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                              <div>
                                <label className="text-[8px] text-stone-400 uppercase font-bold block mb-0.5">MOQ Limit</label>
                                <input
                                  type="number"
                                  min="2"
                                  value={wholesaleTier3Moq}
                                  onChange={(e) => setWholesaleTier3Moq(parseInt(e.target.value) || 2)}
                                  className="w-full font-bold p-1 bg-white border border-stone-200 rounded focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-stone-400 uppercase font-bold block mb-0.5">Discount %</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="90"
                                  value={wholesaleTier3Discount}
                                  onChange={(e) => setWholesaleTier3Discount(parseInt(e.target.value) || 0)}
                                  className="w-full font-bold p-1 bg-white border border-stone-200 rounded focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Calculated Suggested Tiers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* T1 Display */}
                      <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-3.5 shadow-3xs flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b border-stone-100 pb-1.5">
                            <span className="text-[9px] text-purple-700 font-extrabold uppercase font-bold">Tier 1 (MOQ {wholesaleTier1Moq}+)</span>
                            <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded font-mono">-{wholesaleTier1Discount}% Off</span>
                          </div>
                          
                          <div className="py-2 space-y-1">
                            <p className="text-[9px] text-stone-400 uppercase font-bold">Suggested Wholesale Price</p>
                            <p className="text-xl font-black text-stone-900 font-mono font-bold">₹{tier1Price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                            <p className="text-[9px] text-stone-500 font-medium">Saves ₹{(regularPrice - tier1Price).toFixed(2)} per unit</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-stone-100 text-[10px]">
                          <div className="flex justify-between text-stone-500 font-medium">
                            <span>Unit Net Profit:</span>
                            <span className="font-mono font-bold text-stone-900">₹{tier1Profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-stone-500 font-medium">
                            <span>Wholesale Margin %:</span>
                            <span className={`inline-block px-1 rounded font-mono text-[9px] font-bold ${
                              tier1MarginPct > 35 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tier1MarginPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="bg-stone-50 p-1.5 rounded text-[9px] mt-1 space-y-0.5">
                            <div className="flex justify-between font-bold text-stone-500">
                              <span>REV @ {wholesaleTargetVolume} UNITS:</span>
                              <span className="font-mono text-stone-900">₹{tier1ProjectedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between font-extrabold text-stone-700">
                              <span>PROFIT GAIN:</span>
                              <span className="font-mono text-emerald-700">₹{tier1ProjectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* T2 Display */}
                      <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-3.5 shadow-3xs flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b border-stone-100 pb-1.5">
                            <span className="text-[9px] text-blue-700 font-extrabold uppercase font-bold">Tier 2 (MOQ {wholesaleTier2Moq}+)</span>
                            <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded font-mono">-{wholesaleTier2Discount}% Off</span>
                          </div>
                          
                          <div className="py-2 space-y-1">
                            <p className="text-[9px] text-stone-400 uppercase font-bold">Suggested Wholesale Price</p>
                            <p className="text-xl font-black text-stone-900 font-mono font-bold">₹{tier2Price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                            <p className="text-[9px] text-stone-500 font-medium">Saves ₹{(regularPrice - tier2Price).toFixed(2)} per unit</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-stone-100 text-[10px]">
                          <div className="flex justify-between text-stone-500 font-medium">
                            <span>Unit Net Profit:</span>
                            <span className="font-mono font-bold text-stone-900">₹{tier2Profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-stone-500 font-medium">
                            <span>Wholesale Margin %:</span>
                            <span className={`inline-block px-1 rounded font-mono text-[9px] font-bold ${
                              tier2MarginPct > 35 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tier2MarginPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="bg-stone-50 p-1.5 rounded text-[9px] mt-1 space-y-0.5">
                            <div className="flex justify-between font-bold text-stone-500">
                              <span>REV @ {wholesaleTargetVolume} UNITS:</span>
                              <span className="font-mono text-stone-900">₹{tier2ProjectedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between font-extrabold text-stone-700">
                              <span>PROFIT GAIN:</span>
                              <span className="font-mono text-emerald-700">₹{tier2ProjectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* T3 Display */}
                      <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-3.5 shadow-3xs flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b border-stone-100 pb-1.5">
                            <span className="text-[9px] text-emerald-800 font-extrabold uppercase font-bold">Tier 3 (MOQ {wholesaleTier3Moq}+)</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono">-{wholesaleTier3Discount}% Off</span>
                          </div>
                          
                          <div className="py-2 space-y-1">
                            <p className="text-[9px] text-stone-400 uppercase font-bold">Suggested Wholesale Price</p>
                            <p className="text-xl font-black text-stone-900 font-mono font-bold">₹{tier3Price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                            <p className="text-[9px] text-stone-500 font-medium">Saves ₹{(regularPrice - tier3Price).toFixed(2)} per unit</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-stone-100 text-[10px]">
                          <div className="flex justify-between text-stone-500 font-medium">
                            <span>Unit Net Profit:</span>
                            <span className="font-mono font-bold text-stone-900">₹{tier3Profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-stone-500 font-medium">
                            <span>Wholesale Margin %:</span>
                            <span className={`inline-block px-1 rounded font-mono text-[9px] font-bold ${
                              tier3MarginPct > 20 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {tier3MarginPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="bg-stone-50 p-1.5 rounded text-[9px] mt-1 space-y-0.5">
                            <div className="flex justify-between font-bold text-stone-500">
                              <span>REV @ {wholesaleTargetVolume} UNITS:</span>
                              <span className="font-mono text-stone-900">₹{tier3ProjectedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between font-extrabold text-stone-700">
                              <span>PROFIT GAIN:</span>
                              <span className="font-mono text-emerald-700">₹{tier3ProjectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Footer Apply Rules Panel */}
                    <div className="bg-stone-900 text-white p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-stone-800">
                      <div>
                        <h4 className="text-xs font-bold text-amber-400 uppercase">Save Wholesale Structure Metadata</h4>
                        <p className="text-[10px] text-stone-300 mt-0.5 leading-relaxed font-medium">
                          Commit these simulated price points to the current item's custom database schema.
                        </p>
                        {hasSavedTiers && (
                          <span className="inline-block mt-2 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                            ✓ Currently active wholesale configuration applied
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const tiersList = [
                            { moq: wholesaleTier1Moq, discount: wholesaleTier1Discount, suggestedPrice: parseFloat(tier1Price.toFixed(2)) },
                            { moq: wholesaleTier2Moq, discount: wholesaleTier2Discount, suggestedPrice: parseFloat(tier2Price.toFixed(2)) },
                            { moq: wholesaleTier3Moq, discount: wholesaleTier3Discount, suggestedPrice: parseFloat(tier3Price.toFixed(2)) }
                          ];
                          setEditForm(prev => ({
                            ...prev,
                            wholesaleTiers: tiersList
                          }));
                          onLogActivity(`Applied wholesale bulk price configurations to ${editForm.name}`, 'Product', editForm.name || 'Catalog Item');
                          alert(`Applied ${tiersList.length} wholesale tier structures successfully! Save the product entity to persist completely.`);
                        }}
                        disabled={isReadOnly || regularPrice === 0}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold rounded-lg shadow transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                      >
                        Apply Suggested Wholesale Tiers
                      </button>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
