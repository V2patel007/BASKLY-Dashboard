/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { BarChart3, TrendingUp, RefreshCw, Globe, Calendar, Download, AlertCircle } from 'lucide-react';

export default function AnalyticsTab() {
  const [reportPeriod, setReportPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [isExporting, setIsExporting] = useState(false);

  // Recharts high fidelity datasets
  const revenueTrendData = [
    { date: 'Jun 10', SaffronSales: 2400, HoneySales: 4000, Total: 6400 },
    { date: 'Jun 11', SaffronSales: 1398, HoneySales: 3000, Total: 4398 },
    { date: 'Jun 12', SaffronSales: 9800, HoneySales: 2000, Total: 11800 },
    { date: 'Jun 13', SaffronSales: 3908, HoneySales: 2780, Total: 6688 },
    { date: 'Jun 14', SaffronSales: 4800, HoneySales: 1890, Total: 6690 },
    { date: 'Jun 15', SaffronSales: 3800, HoneySales: 2390, Total: 6190 },
    { date: 'Jun 16', SaffronSales: 4300, HoneySales: 3490, Total: 7790 }
  ];

  const acquisitionSourceData = [
    { source: 'Direct/Bookmark', count: 480, conversionRate: 4.8 },
    { source: 'Instagram / Influencer VIP', count: 320, conversionRate: 6.2 },
    { source: 'Organic Google SEO', count: 290, conversionRate: 3.1 },
    { source: 'Newsletter Campaign', count: 180, conversionRate: 8.5 }
  ];

  const triggerPDFExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("High-Fidelity PDF Sales Audit sheet compiled and saved! Check your simulated local storage downloads spool.");
    }, 1500);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans text-stone-800">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Business Intelligence & Reports</h2>
          <p className="text-xs text-stone-500 mt-1">Cross-reference channels, evaluate organic conversion ratios, and inspect visual revenue projections.</p>
        </div>

        <div className="flex bg-[#f1f1f1] p-1 rounded-md border border-[#d2d2d2] shrink-0 select-none">
          {['7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setReportPeriod(period as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md uppercase tracking-wide transition-all ${
                reportPeriod === period ? 'bg-white text-stone-950 border border-[#d2d2d2] shadow-sm font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Main Charts grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-medium">
        
        {/* Revenue Area Chart */}
        <div className="md:col-span-2 bg-white rounded-md border border-[#d2d2d2] p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-[#f1f1f1]">
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Interactive Revenue Split Trend</h3>
              <p className="text-[10px] text-stone-400 mt-1">Dynamic saffron vs honey inventory turnover rates.</p>
            </div>
            
            <button
              onClick={triggerPDFExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#005c46] hover:bg-[#004b35] text-white text-[10px] font-semibold rounded-md border border-[#005c46] transition-colors"
              disabled={isExporting}
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? 'Compiling PDF...' : 'Audit Export PDF'}
            </button>
          </div>

          <div className="h-64 pt-3 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="saffronGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="honeyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005c46" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#005c46" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebebeb" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, border: '1px solid #d2d2d2', fontSize: 11 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Area type="monotone" dataKey="SaffronSales" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#saffronGrad)" name="Pampore Saffron (₹)" />
                <Area type="monotone" dataKey="HoneySales" stroke="#005c46" strokeWidth={2} fillOpacity={1} fill="url(#honeyGrad)" name="Unfiltered Honey (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Channels conversion bar chart */}
        <div className="md:col-span-1 bg-white rounded-md border border-[#d2d2d2] p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Traffic & Conversions</h3>
            <p className="text-[10px] text-stone-400 mt-1">Acquisition splits by premium sales funnel paths.</p>
          </div>

          <div className="h-64 pt-3 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={acquisitionSourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ebebeb" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="source" type="category" stroke="#94a3b8" fontSize={9} width={90} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, border: '1px solid #d2d2d2', borderRadius: 6 }} />
                <Bar dataKey="count" fill="#2c6ecb" radius={[0, 3, 3, 0]} name="Unique Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid of bottom KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 z-10 font-medium text-stone-605">
        <div className="bg-[#fffbeb] border border-amber-200 rounded-md p-4 flex gap-3 text-xs items-start">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-stone-900 font-display">Weekly Harvest Alert Ratio</p>
            <p className="text-[11px] text-amber-900 leading-normal mt-1">
              Pure raw organic honey sales increased by <b>22%</b> this weekend. Restock alarms have triggered automatic wholesale purchase order (PO) drafts on Jammu Beekeepers Co.
            </p>
          </div>
        </div>

        <div className="bg-stone-50 border border-[#d2d2d2] rounded-md p-4 flex gap-3 text-xs items-start">
          <TrendingUp className="h-5 w-5 text-[#005c46] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-stone-950 font-display">Mean conversion coefficient (SLA)</p>
            <p className="text-[11px] text-stone-600 leading-normal mt-1">
              Overall shop conversion metrics is currently holding steady at <b>4.82%</b>, exceeding global gourmet e-commerce baseline standard indices by 1.2%. Very healthy!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
