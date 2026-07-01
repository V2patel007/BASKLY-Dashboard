/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Plus, Trash2, Calendar, FileText, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { LabCertificateMapping, Product } from '../types.ts';

interface CertificatesTabProps {
  labCertificates: LabCertificateMapping[];
  setLabCertificates: React.Dispatch<React.SetStateAction<LabCertificateMapping[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  userRole: string; // RBAC
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function CertificatesTab({
  labCertificates,
  setLabCertificates,
  products,
  setProducts,
  userRole,
  onLogActivity
}: CertificatesTabProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [certName, setCertName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [linkedpId, setLinkedpId] = useState('');

  const isReadOnly = userRole === 'Customer Support';

  const handleSaveCert = () => {
    if (isReadOnly) return;
    if (!certName || !expiry) {
      alert("Please fill out certificate name and expiry values.");
      return;
    }

    const brandNew: LabCertificateMapping = {
      id: `cert-${Date.now()}`,
      name: certName,
      uploadDate: new Date().toISOString().slice(0, 10),
      expiryDate: expiry,
      status: new Date(expiry) < new Date() ? 'Expired' : 'Active',
      url: '#',
      version: 1
    };

    setLabCertificates(prev => [...prev, brandNew]);
    
    // Auto-map if requested
    if (linkedpId) {
      setProducts(prev => prev.map(p => {
        if (p.id === linkedpId) {
          return {
            ...p,
            certificates: [...(p.certificates || []), brandNew]
          };
        }
        return p;
      }));
    }

    onLogActivity(`Uploaded lab certificate "${certName}"`, 'Product', brandNew.id);
    setIsCreating(false);
    setCertName('');
    setExpiry('');
    setLinkedpId('');
  };

  const handleDelete = (id: string, name: string) => {
    if (isReadOnly) return;
    if (window.confirm(`Are you sure you want to delete and wipe "${name}"?`)) {
      setLabCertificates(prev => prev.filter(c => c.id !== id));
      // Unlink from all products
      setProducts(prev => prev.map(p => ({
        ...p,
        certificates: (p.certificates || []).filter(c => c.id !== id)
      })));
      onLogActivity(`Deleted and unmapped lab certificate "${name}"`, 'Product', id);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans text-stone-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Lab Certifications</h2>
          <p className="text-xs text-stone-500 mt-1 font-normal">Version control regulatory reports, track expiration warnings, and attach lab sheets to retail SKUs.</p>
        </div>
        {!isReadOnly && !isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#005c46] hover:bg-[#004b35] rounded-md border border-[#005c46] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Upload PDF Certificate
          </button>
        )}
      </div>

      {isCreating ? (
        /* Creator */
        <div className="bg-white border border-[#d2d2d2] rounded-md p-5 space-y-4 max-w-lg shadow-sm font-semibold">
          <p className="text-[10px] text-stone-550 font-bold uppercase tracking-widest border-b border-[#f1f1f1] pb-2 mb-2">Upload Certificate & Map</p>
          
          <div className="space-y-4 text-xs font-semibold text-stone-705">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase">Certificate Name (e.g. ISO-3632 Saffron Assay)</label>
              <input
                type="text"
                placeholder="e.g. FSSAI Pesticide Residue Free"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Expiry Date</label>
                <input
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#d2d2d2] bg-[#f1f1f1] rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Link directly to product</label>
                <select
                  value={linkedpId}
                  onChange={(e) => setLinkedpId(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border border-[#d2d2d2] bg-white rounded-md focus:outline-none focus:border-black"
                >
                  <option value="">Do not map yet...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveCert}
                className="flex-1 p-2 bg-[#005c46] hover:bg-[#004b35] text-white font-bold rounded-md border border-[#005c46] transition-colors text-xs"
              >
                Upload & Process Certificate
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-3 border border-[#d2d2d2] hover:bg-[#ebebeb] text-stone-500 text-xs font-bold rounded-md"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Listing certificates */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labCertificates.map((cert) => {
            const isNearExpiry = new Date(cert.expiryDate) < new Date(Date.now() + 30*24*60*60*1000);
            const isExpired = new Date(cert.expiryDate) < new Date();

            return (
              <div key={cert.id} className="bg-white rounded-md border border-[#d2d2d2] p-4 flex flex-col justify-between space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`p-2.5 border border-stone-100 rounded-md shrink-0 ${
                      isExpired ? 'bg-rose-50 text-rose-600' : isNearExpiry ? 'bg-[#fffbeb] text-amber-700' : 'bg-stone-50 text-[#005c46]'
                    }`}>
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 shrink-0 font-display">{cert.name}</h4>
                      <div className="flex items-center gap-1.5 text-[9px] text-stone-400 font-bold mt-1 uppercase tracking-wide">
                        <span>Ver. <b>{cert.version}</b></span>
                        <span>•</span>
                        <span>Uploaded: {cert.uploadDate}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    isExpired ? 'bg-rose-100 text-rose-800 border-transparent' : isNearExpiry ? 'bg-amber-100 text-amber-800 border-transparent' : 'bg-green-105 text-green-700 border-transparent'
                  }`}>
                    {isExpired ? 'Expired' : isNearExpiry ? 'Expiring Soon' : 'Active'}
                  </span>
                </div>

                {isNearExpiry && (
                  <div className="bg-[#fffbeb] border border-amber-200 p-2.5 rounded-md flex items-start gap-1.5 text-[10px] text-amber-800 leading-normal font-semibold">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <p>This certificate expires on <b>{cert.expiryDate}</b>. Consider arranging updated harvesting lab assays immediately.</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] text-stone-400 font-bold border-t border-[#f1f1f1] pt-2.5">
                  <span className="font-mono text-[9px]">ID: {cert.id}</span>
                  {!isReadOnly && (
                    <button
                      onClick={() => handleDelete(cert.id, cert.name)}
                      className="p-1.5 hover:bg-[#ebebeb] text-rose-500 rounded-md border border-[#d2d2d2]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
