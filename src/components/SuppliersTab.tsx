/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Truck, Plus, Trash2, ShieldAlert, CheckCircle2, User, Phone, MapPin, Inbox, AlertOctagon } from 'lucide-react';
import { Supplier } from '../types.ts';

interface SuppliersTabProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function SuppliersTab({
  suppliers,
  setSuppliers,
  onLogActivity
}: SuppliersTabProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [supName, setSupName] = useState('');
  const [conPerson, setConPerson] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supLead, setSupLead] = useState(5);

  const isReadOnly = false;

  const handleSaveSupplier = () => {
    if (isReadOnly) return;
    if (!supName || !conPerson) {
      alert("Name and primary contact person fields are required.");
      return;
    }

    const brandNew: Supplier = {
      id: `sup-${Date.now()}`,
      name: supName,
      contactPerson: conPerson,
      email: `${supName.toLowerCase().replace(/\s+/g, '')}@pamporeapiary.org`,
      phone: supPhone || '+91 94190 28312',
      address: 'Industrial Spice Arcades, Phase II, Pulwama, J&K',
      productsSupplied: ['Raw Kashmiri Saffron Threads', 'Pure Himalayan Honey'],
      leadTimeDays: supLead,
      status: 'Active',
      country: 'India',
      complianceDocuments: [],
      purchaseHistory: [],
      mappedProductIds: []
    };

    setSuppliers(prev => [brandNew, ...prev]);
    onLogActivity(`Registered new wholesale partner supplier "${supName}"`, 'Settings', brandNew.id);
    setIsCreating(false);

    // Reset Form
    setSupName('');
    setConPerson('');
    setSupPhone('');
    setSupLead(5);
  };

  const handleDelete = (id: string, name: string) => {
    if (isReadOnly) return;
    if (window.confirm(`Are you sure you want to deactivate and unlink wholesale supplier and farmer partner "${name}"?`)) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      onLogActivity(`Deregistered farmer supplier partner "${name}"`, 'Settings', id);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Farmer Suppliers & Cooperatives</h2>
          <p className="text-xs text-stone-500 mt-1">Manage wholesale procurement partners, track shipping lead times, and monitor organic certifications.</p>
        </div>
        {!isReadOnly && !isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#008060] hover:bg-[#006e52] rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            Add Wholesale Supplier
          </button>
        )}
      </div>

      {isCreating ? (
        /* Creator */
        <div className="bg-white border rounded-xl p-5 space-y-4 max-w-lg shadow-2xs font-semibold">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest border-b pb-2 mb-2 font-mono">Supplier Onboarding Form</p>
          
          <div className="space-y-4 text-xs font-semibold text-stone-705">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-3">Cooperative Cooperative Title (or Farmer group)</label>
              <input
                type="text"
                placeholder="e.g. Pampore Saffron Growers Coop"
                value={supName}
                onChange={(e) => setSupName(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-3">Primary Contact Representative</label>
                <input
                  type="text"
                  placeholder="e.g. Bashir Ahmad Bhat"
                  value={conPerson}
                  onChange={(e) => setConPerson(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-3">Telephone Node</label>
                <input
                  type="text"
                  placeholder="+91 94190 28312"
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-3 font-mono">Wholesale Lead Time (Days)</label>
              <input
                type="number"
                value={supLead}
                onChange={(e) => setSupLead(parseInt(e.target.value) || 5)}
                className="w-full p-2.5 bg-white border rounded-lg focus:outline-none max-w-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveSupplier}
                className="flex-1 p-2 bg-[#008060] hover:bg-[#006e52] text-white font-bold rounded-lg text-xs"
              >
                Register Wholesale Partner
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-3 border text-stone-500 text-xs font-bold rounded-lg"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Suppliers List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-white rounded-xl border border-stone-200 p-4.5 flex flex-col justify-between space-y-4 shadow-3xs hover:shadow-2xs transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">{sup.name}</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      Mean wholesale ETA: {sup.leadTimeDays ?? 5} days
                    </p>
                  </div>
                </div>

                <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {sup.status ?? 'Active'}
                </span>
              </div>

              {/* Sub Contact Grid details */}
              <div className="bg-stone-50 p-3 rounded-lg border text-[10px] font-semibold text-stone-500 space-y-1 z-10 select-none">
                <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-stone-400" /> Rep: <b>{sup.contactPerson}</b></p>
                <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 font-mono text-stone-400" /> Phone: {sup.phone}</p>
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-stone-400" /> Addr: {sup.address}</p>
              </div>

              {/* Mapped goods */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(sup.productsSupplied || []).map((prod, idx) => (
                  <span key={idx} className="bg-[#e2f1ec] text-[#004b35] text-[9px] font-bold px-2 py-0.5 rounded">
                    {prod}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-[10px] text-stone-400 font-semibold border-t pt-2.5">
                <span className="font-mono text-[9px]">ID: {sup.id}</span>
                {!isReadOnly && (
                  <button
                    onClick={() => handleDelete(sup.id, sup.name)}
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
