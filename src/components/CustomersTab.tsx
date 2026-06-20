/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Tag, 
  Navigation, 
  Wallet, 
  Phone, 
  Mail, 
  Award, 
  MessageSquare, 
  Plus, 
  ArrowLeft, 
  Download, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  X,
  CreditCard,
  MapPin
} from 'lucide-react';
import { Customer } from '../types.ts';

interface CustomersTabProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function CustomersTab({
  customers,
  setCustomers,
  onLogActivity
}: CustomersTabProps) {
  const [selectedCustId, setSelectedCustId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMemo, setNewMemo] = useState('');
  
  // Custom non-blocking inline toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // New Customer creation states
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustTagInput, setNewCustTagInput] = useState('VIP');
  const [newCustNotes, setNewCustNotes] = useState('');
  const [newCustStreet, setNewCustStreet] = useState('');
  const [newCustCity, setNewCustCity] = useState('');
  const [newCustState, setNewCustState] = useState('');
  const [newCustZip, setNewCustZip] = useState('');

  // Segment tag quick filters
  const [segmentFilter, setSegmentFilter] = useState<'All' | 'VIP' | 'Repeat' | 'New' | 'HighLTV'>('All');

  // Customer tagging dynamic state
  const [tagToAdd, setTagToAdd] = useState('');

  // Manual offline transaction state
  const [offlineSaleAmount, setOfflineSaleAmount] = useState('1500');

  // Delete profile custom prompt state
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const activeCustomer = customers.find(c => c.id === selectedCustId);

  // Helper function to show modern status toast
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter customers listing by search Query AND Segment Tab criteria
  const filteredCustomers = customers.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesQuery) return false;

    if (segmentFilter === 'VIP') {
      return c.tags.some(t => t.toLowerCase() === 'vip' || t.toLowerCase().includes('vip'));
    }
    if (segmentFilter === 'Repeat') {
      return c.ordersCount >= 2 || c.tags.some(t => t.toLowerCase().includes('repeat'));
    }
    if (segmentFilter === 'New') {
      return c.ordersCount <= 1 || c.tags.some(t => t.toLowerCase().includes('new'));
    }
    if (segmentFilter === 'HighLTV') {
      return c.lifetimeValue >= 500;
    }
    return true;
  });

  // Export filtered customers to CSV format
  const handleExportCSV = () => {
    const headers = ["ID", "Customer Name", "Email", "Phone", "Lifetime Value (LTV)", "Transactions Count", "Tags", "Joined Date"];
    const rows = filteredCustomers.map(c => [
      `"${c.id.replace(/"/g, '""')}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${c.phone.replace(/"/g, '""')}"`,
      c.lifetimeValue.toFixed(2),
      c.ordersCount,
      `"${c.tags.join(', ').replace(/"/g, '""')}"`,
      `"${c.joinedDate.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(",")].concat(rows.map(r => r.join(","))).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Baskly_Customers_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onLogActivity(`Exported ${filteredCustomers.length} filtered customers to CSV`, 'Customer', 'Batch');
    showToast(`Successfully exported spreadsheet of ${filteredCustomers.length} clients!`);
  };

  // Create new customer profile manually
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustEmail.trim() || !newCustPhone.trim()) {
      showToast("Primary metadata (Name, Email, Phone) are strictly required to register custom customer profile.", "error");
      return;
    }
    const newCustomerItem: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustName.trim(),
      email: newCustEmail.trim(),
      phone: newCustPhone.trim(),
      tags: [newCustTagInput, "Added via CRM"].filter(Boolean),
      notes: newCustNotes.trim() || 'No active notes written yet.',
      lifetimeValue: 0.00,
      joinedDate: new Date().toISOString().slice(0, 10),
      ordersCount: 0,
      savedAddresses: newCustStreet.trim() ? [
        {
          id: `add-${Date.now()}`,
          label: 'Default Shipping Address',
          street: newCustStreet.trim(),
          city: newCustCity.trim() || 'New Delhi',
          state: newCustState.trim() || 'Delhi',
          zip: newCustZip.trim() || '110001'
        }
      ] : [],
      couponsUsed: []
    };
    
    setCustomers(prev => [...prev, newCustomerItem]);
    onLogActivity(`Created new customer profile for "${newCustName.trim()}"`, 'Customer', newCustomerItem.id);
    
    // Clear inputs
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustTagInput('VIP');
    setNewCustNotes('');
    setNewCustStreet('');
    setNewCustCity('');
    setNewCustState('');
    setNewCustZip('');
    setIsCreatingCustomer(false);
    showToast(`Customer "${newCustName.trim()}" successfully registered!`);
  };

  // Add tag inline dynamically to customer
  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagToAdd.trim() || !selectedCustId) return;
    const cleanTag = tagToAdd.trim();
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustId) {
        if (c.tags.includes(cleanTag)) return c;
        return {
          ...c,
          tags: [...c.tags, cleanTag]
        };
      }
      return c;
    }));
    onLogActivity(`Added label tag "${cleanTag}" to customer "${activeCustomer?.name}"`, 'Customer', selectedCustId);
    showToast(`Added label tag "${cleanTag}" directly to client file.`);
    setTagToAdd('');
  };

  // Remove tag inline dynamically
  const handleRemoveExistingTag = (tagToRemove: string) => {
    if (!selectedCustId) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustId) {
        return {
          ...c,
          tags: c.tags.filter(t => t !== tagToRemove)
        };
      }
      return c;
    }));
    onLogActivity(`Removed tag "${tagToRemove}" from customer "${activeCustomer?.name}"`, 'Customer', selectedCustId);
    showToast(`Removed tag "${tagToRemove}" from metadata.`);
  };

  // Log manual physical offline deal on profiles
  const handleAddOfflineSale = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(offlineSaleAmount);
    if (isNaN(amountVal) || amountVal <= 0 || !selectedCustId) {
      showToast("Invalid sale pricing value entered.", "error");
      return;
    }
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustId) {
        return {
          ...c,
          ordersCount: c.ordersCount + 1,
          lifetimeValue: c.lifetimeValue + amountVal
        };
      }
      return c;
    }));
    onLogActivity(`Logged walk-in physical sale of ₹${amountVal.toFixed(2)} for customer "${activeCustomer?.name}"`, 'Customer', selectedCustId);
    showToast(`Credited offline transaction value of ₹${amountVal.toFixed(2)} directly to customer account.`);
    setOfflineSaleAmount('1500');
  };

  // Delete profile
  const handleConfirmedDelete = () => {
    if (!selectedCustId) return;
    const name = activeCustomer?.name || 'Customer';
    setCustomers(prev => prev.filter(c => c.id !== selectedCustId));
    onLogActivity(`Permanently deleted customer registry file for "${name}"`, 'Customer', selectedCustId);
    setSelectedCustId(null);
    setShowConfirmDelete(false);
    showToast(`Customer registration records for "${name}" permanently archived & deleted.`, 'info');
  };

  // Append memo note
  const handleSaveMemo = () => {
    if (!selectedCustId || !newMemo.trim()) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustId) {
        return {
          ...c,
          notes: newMemo.trim()
        };
      }
      return c;
    }));
    onLogActivity(`Updated contact note for customer "${activeCustomer?.name}"`, 'Customer', selectedCustId);
    setNewMemo('');
    showToast("Successfully updated client relation memo notes!");
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans text-stone-800">
      
      {/* Dynamic Toast Status system */}
      {toast && (
        <div className={`p-3.5 rounded-lg flex items-center justify-between text-xs font-semibold shadow-sm border animate-fade-in ${
          toast.type === 'success' ? 'bg-[#e6f4ea] text-[#137333] border-[#a3e2bc]' :
          toast.type === 'error' ? 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]' :
          'bg-[#e8f0fe] text-[#1a73e8] border-[#c2e7ff]'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <CheckCircle className="h-4 w-4 text-[#137333]" />}
            {toast.type === 'error' && <ShieldAlert className="h-4 w-4 text-[#c5221f]" />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="hover:opacity-60 text-stone-500">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {!selectedCustId ? (
        <>
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
            <div>
              <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Customer CRM Registry</h2>
              <p className="text-xs text-stone-500 mt-1">Audit customer tags segment, track user notes, and evaluate user lifetime value (LTV).</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsCreatingCustomer(!isCreatingCustomer)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer select-none ${
                  isCreatingCustomer 
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300' 
                    : 'bg-[#5c6ac4] hover:bg-[#4a58a9] text-white'
                }`}
              >
                {isCreatingCustomer ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>{isCreatingCustomer ? 'Dismiss registry form' : 'Register Customer'}</span>
              </button>
              
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 text-xs font-bold bg-[#008060] hover:bg-[#005c46] text-white flex items-center justify-center gap-1.5 rounded-lg transition-colors select-none shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Download className="h-4 w-4" /> Export CSV ({filteredCustomers.length})
              </button>
            </div>
          </div>

          {/* New Customer Form Panel Container */}
          {isCreatingCustomer && (
            <form onSubmit={handleAddCustomer} className="bg-white border-2 border-[#5c6ac4] rounded-lg p-5 space-y-4 shadow-md animate-fade-in font-medium text-xs">
              <p className="text-[10px] text-[#5c6ac4] font-bold uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Enter Loyal Client CRM Profile Credentials
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Malhotra"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-md focus:outline-none focus:border-[#5c6ac4] bg-stone-50 text-stone-800 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">Contact Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. malhotra@gmail.com"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-md focus:outline-none focus:border-[#5c6ac4] bg-stone-50 text-stone-800 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">Active Phone String *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 99991 23456"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-md focus:outline-none focus:border-[#5c6ac4] bg-stone-50 text-stone-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">Initial Categorization Tier Tag</label>
                  <select
                    value={newCustTagInput}
                    onChange={(e) => setNewCustTagInput(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-md focus:outline-none focus:border-[#5c6ac4] bg-stone-50 text-stone-800 font-semibold"
                  >
                    <option value="VIP">VIP Tier</option>
                    <option value="Repeat buyer">Repeat Client</option>
                    <option value="Wholesale">Wholesale Broker</option>
                    <option value="Frequently Warm">Frequently Warm</option>
                    <option value="New Customer">New Customer</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">Initial Relations Memo / Internal Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Prefers custom greeting inserts, high-frequency organic buyer..."
                    value={newCustNotes}
                    onChange={(e) => setNewCustNotes(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-md focus:outline-none focus:border-[#5c6ac4] bg-stone-50 text-stone-800 font-semibold"
                  />
                </div>
              </div>

              <div className="border-t pt-3 space-y-3">
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-stone-400" /> Default Shipping Address Details (Optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Street Address (e.g. Flat 102, Green Meadows Apts)"
                      value={newCustStreet}
                      onChange={(e) => setNewCustStreet(e.target.value)}
                      className="w-full p-2 text-xs border border-stone-300 rounded-md bg-stone-50 font-semibold"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="City (e.g. Mumbai)"
                      value={newCustCity}
                      onChange={(e) => setNewCustCity(e.target.value)}
                      className="w-full p-2 text-xs border border-stone-300 rounded-md bg-stone-50 font-semibold"
                    />
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="State"
                        value={newCustState}
                        onChange={(e) => setNewCustState(e.target.value)}
                        className="w-full p-2 text-xs border border-stone-300 rounded-md bg-stone-50 font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Zip"
                        value={newCustZip}
                        onChange={(e) => setNewCustZip(e.target.value)}
                        className="w-full p-2 text-xs border border-stone-300 rounded-md bg-stone-50 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustomer(false)}
                  className="px-4 py-2 border rounded-md text-stone-600 hover:bg-stone-50 cursor-pointer text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5c6ac4] hover:bg-[#4a58a9] text-white rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer shadow"
                >
                  <Plus className="h-4 w-4" /> Save Registration
                </button>
              </div>
            </form>
          )}

          {/* Search bar & Filter Pills */}
          <div className="bg-white border border-[#d2d2d2] rounded-md p-4 shadow-sm space-y-3.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search clients by name, email, or phone number in real-time..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold pl-9 pr-4 py-2 border border-[#d2d2d2] focus:outline-none focus:border-black rounded-md"
              />
            </div>

            {/* Segment Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Quick Filter Segments:
              </span>
              {[
                { id: 'All', label: 'All Registered' },
                { id: 'VIP', label: 'VIP Guests 👑' },
                { id: 'Repeat', label: 'Repeat Clients (2+ orders)' },
                { id: 'New', label: 'New / Prospects' },
                { id: 'HighLTV', label: 'Top Buyers (₹500+)' }
              ].map((pill) => {
                const isActive = segmentFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setSegmentFilter(pill.id as any)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-black border-black text-white shadow-xs' 
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop tabular view */}
          <div className="bg-white rounded-md border border-[#d2d2d2] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto text-xs">
                <thead>
                  <tr className="bg-[#f9f9f9] text-[10px] font-bold text-stone-500 uppercase tracking-tight border-b border-[#d2d2d2]">
                    <th className="py-2.5 px-4">Client Profile</th>
                    <th className="py-2.5 px-4 text-center font-normal">Checkout count</th>
                    <th className="py-2.5 px-4 text-right font-normal">Lifetime value (LTV)</th>
                    <th className="py-2.5 px-4">Segment tags</th>
                    <th className="py-2.5 px-4">Joined Date</th>
                    <th className="py-2.5 px-4 text-center font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f1f1]">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 font-medium">
                        No clients matching your search or segment query parameters. Try resetting your filter buttons above.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr 
                        key={c.id} 
                        className="hover:bg-gray-50/70 cursor-pointer font-medium" 
                        onClick={() => {
                          setSelectedCustId(c.id);
                          setShowConfirmDelete(false);
                        }}
                      >
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-800">{c.name}</p>
                          <p className="text-[10px] text-stone-400">{c.email}</p>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-stone-700">{c.ordersCount} transactions</td>
                        <td className="py-3 px-4 text-right font-bold text-stone-950">₹{c.lifetimeValue.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {c.tags.map((t, idx) => {
                              const isVip = t.toLowerCase() === 'vip' || t.toLowerCase() === 'vip guest' || t.toLowerCase() === 'vip tier';
                              return (
                                <span key={idx} className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                  isVip ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-[#ebebeb] text-[#303030] border border-[#d2d2d2]'
                                }`}>
                                  {t}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-500">{c.joinedDate}</td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => {
                              setSelectedCustId(c.id);
                              setShowConfirmDelete(false);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-[#ebebeb] text-[#303030] rounded-md text-[10px] border border-[#d2d2d2] font-bold cursor-pointer transition-colors"
                          >
                            Open Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Customer detailed profile CRM profile */
        activeCustomer && (
          <div className="bg-white border border-[#d2d2d2] rounded-md p-5 space-y-6">
            
            {/* Nav Header Row */}
            <div className="flex items-center justify-between border-b border-[#f1f1f1] pb-4">
              <button
                onClick={() => {
                  setSelectedCustId(null);
                  setShowConfirmDelete(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Registry list</span>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-400 font-mono">UID: {activeCustomer.id}</span>
                <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full"></span>
                <span className="text-[10px] text-stone-400 font-mono">Registered: {activeCustomer.joinedDate}</span>
              </div>
            </div>

            {/* Custom confirmation container for deleting profiles to respect iframe security limits */}
            {showConfirmDelete ? (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 space-y-3.5 animate-fadeIn font-medium text-xs">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-800 text-sm">Request permanent deletion of customer profile?</h4>
                    <p className="text-red-700 text-xs mt-1">
                      Are you sure you want to delete <strong>{activeCustomer.name}</strong> from the client registry system? This will clear all memos, physical ledger entries, and address databases. This action is irreversible.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs font-bold pt-1.5 border-t border-red-100">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmedDelete}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" /> Permanently Delete
                  </button>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold">
              
              {/* Left Column: profile, contact */}
              <div className="space-y-6">
                
                {/* Profile Card */}
                <div className="border border-[#d2d2d2] p-5 rounded-md space-y-4 shadow-sm bg-stone-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#ebebeb] border border-[#d2d2d2] text-stone-700 rounded-full font-bold text-sm w-11 h-11 flex items-center justify-center">
                      {activeCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-stone-900">{activeCustomer.name}</h3>
                      <span className="text-[10px] text-[#2c6ecb] font-bold">Primary tag: {activeCustomer.tags[0] || 'Member'}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-stone-605">
                    <p className="flex items-center gap-2 select-text"><Mail className="h-4 w-4 text-stone-400 shrink-0" /> {activeCustomer.email}</p>
                    <p className="flex items-center gap-2 select-text"><Phone className="h-4 w-4 text-stone-400 shrink-0" /> {activeCustomer.phone}</p>
                  </div>
                </div>

                {/* Financial overview LTV */}
                <div className="border border-[#d2d2d2] p-5 rounded-md space-y-4 shadow-sm bg-stone-50/30">
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-3">LTV Metrics Value</p>
                  
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-2xl font-black text-stone-950">₹{activeCustomer.lifetimeValue.toFixed(2)}</span>
                    <span className="text-[10px] text-stone-405">from {activeCustomer.ordersCount} transactions</span>
                  </div>

                  {/* Manual offline Sale Simulator */}
                  <form onSubmit={handleAddOfflineSale} className="border-t pt-3.5 space-y-2">
                    <p className="text-[9px] text-[#008060] font-bold uppercase tracking-widest flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5" /> Credit Physical Shop Sale
                    </p>
                    <p className="text-[9px] text-stone-400 font-normal">If this customer walked in and purchased physically, log and credit the amount below:</p>
                    <div className="flex gap-1.5 pt-0.5">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-2 text-stone-400 text-xs font-bold">₹</span>
                        <input
                          type="number"
                          value={offlineSaleAmount}
                          onChange={(e) => setOfflineSaleAmount(e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 border border-stone-300 rounded-md text-xs font-bold focus:outline-none focus:border-[#008060] bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 bg-[#008060] hover:bg-[#005c46] text-white text-xs font-bold rounded-md cursor-pointer transition-colors"
                      >
                        Credit LTV
                      </button>
                    </div>
                  </form>
                </div>

                {/* Profile deletion tool */}
                {!showConfirmDelete && (
                  <div className="pt-2">
                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
                    >
                      <Trash2 className="h-4 w-4" /> De-register Customer File
                    </button>
                  </div>
                )}

              </div>

              {/* Middle Column: memo pads editor, saved addresses */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Segment tagging section (interactive tag adder) */}
                <div className="border border-[#d2d2d2] p-5 rounded-md space-y-3.5 shadow-sm">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-[#f1f1f1] pb-1.5 flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-stone-400" /> Interactive metadata CRM segments
                  </p>
                  
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1.5">Profile Labels (Click tag to dismiss):</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {activeCustomer.tags.length === 0 ? (
                        <span className="text-xs text-stone-400 italic">No segment label tags. Add a tag below.</span>
                      ) : (
                        activeCustomer.tags.map((tg, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleRemoveExistingTag(tg)}
                            className="text-[10px] font-bold px-2 py-1 bg-[#ebebeb] hover:bg-red-100 hover:text-red-800 text-[#303030] border border-[#d2d2d2] rounded-md transition-colors flex items-center gap-1 group cursor-pointer"
                            title={`Click to remove tag ${tg}`}
                          >
                            <span>{tg}</span>
                            <span className="text-stone-400 group-hover:text-red-700 ml-0.5 text-[8px]">✕</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleAddNewTag} className="flex gap-2 text-xs pt-1">
                    <input
                      type="text"
                      placeholder="Add custom segment tag (e.g. Saffron Fan, Low Margin)..."
                      value={tagToAdd}
                      onChange={(e) => setTagToAdd(e.target.value)}
                      className="flex-1 p-2 border border-stone-300 rounded-md bg-stone-50 font-semibold focus:outline-none focus:border-stone-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-md cursor-pointer transition-colors"
                    >
                      Attach Tag
                    </button>
                  </form>
                </div>

                {/* Saved addresses lists */}
                <div className="border border-[#d2d2d2] p-5 rounded-md space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-[#f1f1f1] pb-1.5 flex items-center gap-1.5">
                    <Navigation className="h-4 w-4 text-stone-400" /> Saved checkout locations
                  </p>
                  {activeCustomer.savedAddresses.length === 0 ? (
                    <p className="text-xs text-stone-400 font-medium italic">No physical delivery addresses saved under this client.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {activeCustomer.savedAddresses.map((add) => (
                        <div key={add.id} className="bg-stone-50 p-3 border border-[#d2d2d2] rounded-md text-xs font-semibold leading-relaxed text-stone-605">
                          <span className="font-bold text-[#005c46] text-[10px] uppercase tracking-wider block mb-1">{add.label}</span>
                          <p className="text-stone-850 font-bold">{add.street}</p>
                          <p>{add.city}, {add.state} - <span className="font-mono">{add.zip}</span></p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* History of coupons used */}
                <div className="border border-[#d2d2d2] p-5 rounded-md space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-[#f1f1f1] pb-1.5 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-stone-400" /> Used coupons analytics
                  </p>
                  {activeCustomer.couponsUsed.length === 0 ? (
                    <p className="text-xs text-stone-400 font-medium italic">No coupons logged on this buyer's lifetime sessions.</p>
                  ) : (
                    <div className="flex gap-2 flex-wrap pt-1">
                      {activeCustomer.couponsUsed.map((cp, idx) => (
                        <div key={idx} className="bg-blue-50/60 border border-blue-100 p-2.5 rounded-md flex items-center gap-3">
                          <div>
                            <span className="font-bold text-blue-750 font-mono text-[11px] block leading-none">{cp.code}</span>
                            <span className="text-[8px] text-stone-405 mt-1 block">Used: {cp.date}</span>
                          </div>
                          <span className="bg-[#2c6ecb] text-white font-bold font-mono text-[9px] px-2 py-0.5 rounded-md shrink-0">
                            Saved ₹{cp.saving}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Internal operator memos pad */}
                <div className="border border-[#d2d2d2] p-5 rounded-md space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-[#f1f1f1] pb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-stone-400" /> Internal Relations Notes
                  </p>
                  <p className="text-xs text-stone-605 italic bg-[#fffbeb] border border-amber-200 p-3 rounded-md leading-relaxed font-semibold">
                    "{activeCustomer.notes || 'No active memos written yet. Log custom feedback notes below.'}"
                  </p>
                  
                  <div className="space-y-2 pt-2 text-xs">
                    <span className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">Write updated custom profile note</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. VIP client, requests express logistics dispatch call..."
                        value={newMemo}
                        onChange={(e) => setNewMemo(e.target.value)}
                        className="flex-1 p-2 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md text-xs font-semibold focus:outline-none focus:border-black"
                      />
                      <button
                        onClick={handleSaveMemo}
                        className="px-4 py-2 bg-[#005c46] hover:bg-[#004b35] text-white text-xs font-bold rounded-md border border-[#005c46] transition-colors cursor-pointer"
                      >
                        Log Memo
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )
      )}

    </div>
  );
}
