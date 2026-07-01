/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  User,
  Phone,
  Calendar,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  ClipboardList,
  Flame,
  ArrowRight
} from 'lucide-react';
import { NDRCase } from '../types.ts';

interface ShippingTabProps {
  ndrCases: NDRCase[];
  setNdrCases: React.Dispatch<React.SetStateAction<NDRCase[]>>;
  userRole: string;
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function ShippingTab({
  ndrCases,
  setNdrCases,
  userRole,
  onLogActivity
}: ShippingTabProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [retryRemark, setRetryRemark] = useState('');
  const [logisticsView, setLogisticsView] = useState<'kpi' | 'ndr'>('kpi');

  // Filter Active Case
  const activeCase = ndrCases.find(c => c.id === selectedCaseId);

  // Update customer feedback inline
  const handleUpdateFeedback = (feedback: string) => {
    if (!selectedCaseId) return;
    setNdrCases(prev => prev.map(c => {
      if (c.id === selectedCaseId) {
        return {
          ...c,
          lastCustomerResponse: feedback,
          status: 'Action Taken',
          history: [
            ...c.history,
            { date: 'Just now', action: 'Customer Response logged', remark: feedback }
          ]
        };
      }
      return c;
    }));
    onLogActivity(`Updated NDR response notes for Order "${activeCase?.orderNumber}"`, 'Order', selectedCaseId);
  };

  // Re-attempt Delivery dispatcher
  const handleTriggerRetry = () => {
    if (!selectedCaseId || !retryRemark) return;
    setNdrCases(prev => prev.map(c => {
      if (c.id === selectedCaseId) {
        return {
          ...c,
          attempts: c.attempts + 1,
          status: 'Retrying',
          history: [
            ...c.history,
            { date: 'Just now', action: 'Scheduled Re-attempt', remark: retryRemark }
          ]
        };
      }
      return c;
    }));
    onLogActivity(`Dispatched carrier delivery retry attempt for "${activeCase?.orderNumber}"`, 'Order', selectedCaseId);
    setRetryRemark('');
  };

  // Escalate NDR
  const handleEscalate = () => {
    if (!selectedCaseId) return;
    setNdrCases(prev => prev.map(c => {
      if (c.id === selectedCaseId) {
        return {
          ...c,
          status: 'Open',
          history: [
            ...c.history,
            { date: 'Just now', action: 'Escalation raised', remark: 'NDR flagged as high-priority, routed to VIP Relationship Desk.' }
          ]
        };
      }
      return c;
    }));
    onLogActivity(`Escalated NDR case for order "${activeCase?.orderNumber}"`, 'Order', selectedCaseId);
    alert("Case Escalated! Notified central carrier sorting hub.");
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans">
      
      {/* Title block with submenu toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Shipping Hub & NDR Desk</h2>
          <p className="text-xs text-stone-500 mt-1">
            Dispatch bulk orders, monitor courier service speeds, and resolve Non-Delivery Report (NDR) failures.
          </p>
        </div>
        
        <div className="flex bg-stone-100 p-1.2 rounded-lg border border-stone-200 shrink-0">
          <button
            onClick={() => setLogisticsView('kpi')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              logisticsView === 'kpi' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Logistics Reports
          </button>
          <button
            onClick={() => setLogisticsView('ndr')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              logisticsView === 'ndr' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-[#008060]'
            }`}
          >
            NDR Action Panel
            {ndrCases.filter(n => n.status === 'Open').length > 0 && (
              <span className="bg-rose-500 text-white w-2 h-2 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>

      {logisticsView === 'kpi' ? (
        /* SUB-TAB 1: LOGISTICS GLOBAL ANALYSIS */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Courier 1 metrics */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-3xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-50">
                <span className="font-bold text-stone-850">Delhivery Air Express</span>
                <span className="text-[10px] bg-emerald-55 text-emerald-800 border border-emerald-100 font-bold px-1.5 rounded">Primary</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Success SLA</p>
                  <p className="text-sm font-black mt-0.5 text-stone-900">94.8%</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Transit ETA</p>
                  <p className="text-sm font-black mt-0.5 text-stone-900">1.8 Days</p>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 leading-normal bg-stone-50 p-2 rounded border">
                Ideal for tier-1 metropolitan circles. Active API webhook status tracking.
              </div>
            </div>

            {/* Courier 2 metrics */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-3xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-50">
                <span className="font-bold text-stone-850">Blue Dart Premium</span>
                <span className="text-[10px] bg-slate-100 text-stone-600 font-bold px-1.5 rounded">Secondary</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Success SLA</p>
                  <p className="text-sm font-black mt-0.5 text-stone-900">92.1%</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Transit ETA</p>
                  <p className="text-sm font-black mt-0.5 text-stone-900">2.1 Days</p>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 leading-normal bg-stone-50 p-2 rounded border">
                Premium air freight forwarding. Direct signature checks verified on receipt.
              </div>
            </div>

            {/* General metrics */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-3xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-50">
                <span className="font-bold text-stone-850">Central KPI Performance</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 rounded border border-indigo-150">Global</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] text-stone-400 font-bold">RTO Rate</p>
                  <p className="text-sm font-black mt-0.5 text-stone-900">2.4%</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold">Failed Delivery</p>
                  <p className="text-sm font-black mt-0.5 text-stone-900">1 Case Active</p>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 leading-normal bg-[#fffbeb] border border-amber-250 p-2 rounded font-medium">
                Slight delay registered in NCR clusters due to heavy rain. Logistics adjusted.
              </div>
            </div>
          </div>

          {/* Delivery list of recent tracking updates */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-stone-900 tracking-tight">Active Freight Movements</h3>
                <p className="text-[10px] text-stone-400 mt-0.5">Monitoring live Shiprocket API dispatch requests.</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Transit Gateway Steady
              </span>
            </div>

            <div className="p-5 text-xs text-stone-500 space-y-3 select-none">
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">#ORD-1103</span>
                    <p className="text-[10px] text-stone-400 mt-0.5">Mumbai Hub Hub-Sorting • Delhivery Air</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-800 text-[10px]">IN TRANSIT</span>
                  <p className="text-[9px] text-stone-400 font-mono mt-0.5">ETA: 17 Jun 2026</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded">
                    <AlertOctagon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">#ORD-1102</span>
                    <p className="text-[10px] text-[#b45309] mt-0.5">South Delhi Sorting Office • Blue Dart</p>
                  </div>
                </div>
                <div className="text-right font-semibold">
                  <span className="font-bold text-rose-700 text-[10px] block uppercase">NDR Failed Attempt</span>
                  <p className="text-[9px] text-rose-500 font-mono mt-0.5">Locked Door Address</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SUB-TAB 2: ACTIVE NDR RESOLUTION CONSOLE */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* NDR case list */}
          <div className="md:col-span-1 space-y-3">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Open NDR Disputes</p>
            {ndrCases.map((ndr) => (
              <div
                key={ndr.id}
                onClick={() => setSelectedCaseId(ndr.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCaseId === ndr.id
                    ? 'bg-rose-50/20 border-rose-300 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-indigo-700">{ndr.orderNumber}</span>
                  <span className={`text-[8px] font-bold px-1.5 rounded-sm uppercase tracking-wider ${
                    ndr.status === 'Open' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ndr.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-stone-900 mt-2">{ndr.customerName}</p>
                <p className="text-[10px] text-stone-500 mt-1 italic font-medium leading-relaxed">Reason: {ndr.reason}</p>
                <div className="flex justify-between items-center mt-3 text-[9px] text-stone-400 border-t border-stone-100 pt-2 font-semibold">
                  <span>Attempts: <b>{ndr.attempts}</b></span>
                  <span>Logged: {ndr.dateRaised}</span>
                </div>
              </div>
            ))}
          </div>

          {/* NDR resolution details console */}
          <div className="md:col-span-2">
            {activeCase ? (
              <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-5 shadow-2xs">
                {/* Header Case Details */}
                <div className="flex justify-between items-start border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">NDR File details: {activeCase.orderNumber}</h3>
                    <p className="text-[9px] text-stone-400 mt-1">Dispatched tracking parcel code and history below.</p>
                  </div>
                  <button
                    onClick={handleEscalate}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded"
                  >
                    <Flame className="h-3.5 w-3.5" />
                    Escalate Case
                  </button>
                </div>

                {/* Client Contact Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-3.5 rounded-lg border">
                  <div className="text-xs space-y-1 font-semibold text-stone-600">
                    <span className="text-[9px] text-stone-400 uppercase tracking-widest block leading-3">Consignee Profile</span>
                    <p className="font-bold text-stone-900 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {activeCase.customerName}</p>
                    <p className="text-stone-500 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 font-mono" /> {activeCase.customerPhone}</p>
                  </div>
                  <div className="text-xs space-y-1 font-semibold text-stone-600">
                    <span className="text-[9px] text-stone-400 uppercase tracking-widest block leading-3">Simulated CRM Note feedback</span>
                    <p className="italic text-stone-500 leading-relaxed font-medium">"{activeCase.lastCustomerResponse || 'No active client chat received. Click below to append feedback.'}"</p>
                  </div>
                </div>

                {/* Simulated CRM updates trigger */}
                <div className="space-y-2">
                  <p className="text-[9px] text-stone-500 uppercase font-bold tracking-wider">Fast-track Response template</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateFeedback("Spoke with buyer: Placed phone on DND by mistake. Requests delivery tomorrow morning.")}
                      className="px-2.5 py-1.5 text-[10px] font-bold border border-stone-200 hover:bg-stone-50 rounded"
                    >
                      Res scheduled tomorrow
                    </button>
                    <button
                      onClick={() => handleUpdateFeedback("Spoke with client: Address pin typo discovered. Rectified and pushed updated street markers.")}
                      className="px-2.5 py-1.5 text-[10px] font-bold border border-stone-200 hover:bg-stone-50 rounded"
                    >
                      Rectified pin address typo
                    </button>
                  </div>
                </div>

                {/* Re-attempt Scheduler workflow input */}
                <div className="bg-slate-50/50 p-4 border border-stone-200 rounded-lg space-y-3 text-xs">
                  <p className="font-bold text-stone-900">Dispatch Freight Re-attempt Delivery Instructions</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Leave under porch or hand to security guard..."
                      value={retryRemark}
                      onChange={(e) => setRetryRemark(e.target.value)}
                      className="flex-1 text-xs font-semibold p-2 border rounded bg-white focus:outline-none"
                    />
                    <button
                      onClick={handleTriggerRetry}
                      className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded text-xs shadow-3xs"
                    >
                      Dispatch Retry
                    </button>
                  </div>
                </div>

                {/* NDR File History Audit */}
                <div className="space-y-2.5 pt-2 border-t text-xs">
                  <p className="text-[9px] text-stone-400 uppercase tracking-wider font-bold">Audit History logs</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {activeCase.history.map((hist, index) => (
                      <div key={index} className="bg-stone-50 p-2.5 rounded border border-stone-200/50 text-stone-605">
                        <div className="flex justify-between font-bold text-[#008060] text-[10px]">
                          <span>{hist.action}</span>
                          <span className="text-stone-400 font-mono">{hist.date}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-medium mt-0.5">{hist.remark}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-stone-50 border border-dashed rounded-xl py-12 text-center select-none">
                <ClipboardList className="h-7 w-7 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-stone-600">Select active NDR case</p>
                <p className="text-[9px] text-stone-400 mt-1 max-w-[170px] mx-auto">Click on any outstanding delivery item on the left to resolve failures.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
