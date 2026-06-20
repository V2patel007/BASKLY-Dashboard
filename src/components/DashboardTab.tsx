/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Percent,
  Users2,
  PackageX,
  AlertTriangle,
  ArrowRight,
  Package,
  CalendarDays,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Product, Order, NDRCase, Customer } from '../types.ts';

interface DashboardTabProps {
  products: Product[];
  orders: Order[];
  ndrCases: NDRCase[];
  customers: Customer[];
  onNavigate: (tabId: string, param?: string) => void;
}

export default function DashboardTab({
  products,
  orders,
  ndrCases,
  customers,
  onNavigate
}: DashboardTabProps) {
  // Analytical Calculations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = 3.42; // Simulated Conversion of visitor sessions

  const lowStockThresholdProducts = products.filter(p => {
    const totalInv = p.variants.length > 0
      ? p.variants.reduce((sum, v) => sum + v.inventory, 0)
      : p.inventory;
    return totalInv <= p.lowStockThreshold;
  });

  const pendingShipmentsCount = orders.filter(o => o.fulfillmentStatus === 'Unfulfilled').length;
  const activeNdrCases = ndrCases.filter(n => n.status === 'Open').length;

  // Chart Data Preparation (last 6 months simulated)
  const salesChartData = [
    { name: 'Jan', revenue: 4200, orders: 48 },
    { name: 'Feb', revenue: 4900, orders: 62 },
    { name: 'Mar', revenue: 6400, orders: 75 },
    { name: 'Apr', revenue: 7800, orders: 88 },
    { name: 'May', revenue: 8900, orders: 110 },
    { name: 'Jun', revenue: 10450, orders: 132 }
  ];

  const categoryShareData = [
    { name: 'Saffron', value: 45, color: '#4f46e5' },
    { name: 'Pure Honey', value: 30, color: '#f59e0b' },
    { name: 'Cold Oils', value: 15, color: '#10b981' },
    { name: 'Gift Hampers', value: 10, color: '#ec4899' }
  ];

  return (
    <div className="space-y-6 select-none">
      
      {/* Header welcome badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time business logs and inventory metrics for <b>Baskly Premium</b>.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white hover:bg-[#f7f7f7] px-3 py-1.5 rounded-md border border-[#d2d2d2] self-start text-xs font-semibold text-stone-700 transition-colors cursor-pointer">
          <CalendarDays className="h-4 w-4 text-stone-500" />
          <span>Last 24 Hours Metrics</span>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-lg border border-[#d2d2d2] shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-stone-500 uppercase flex justify-between">
            <span>Total Revenue</span>
            <span className="text-[#005c46] font-mono">+14.2%</span>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-[#303030] tracking-tight">₹{totalRevenue.toFixed(2)}</h3>
            <div className="mt-3 h-1 bg-[#f1f1f1] rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-[#005c46]"></div>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">from paid customer logs</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-lg border border-[#d2d2d2] shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-stone-500 uppercase flex justify-between">
            <span>Total Orders</span>
            <span className="text-[#2c6ecb] font-mono">+8.1%</span>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-[#303030] tracking-tight">{totalOrders}</h3>
            <div className="mt-3 h-1 bg-[#f1f1f1] rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-[#2c6ecb]"></div>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">incoming store orders</p>
          </div>
        </div>

        {/* AOV */}
        <div className="bg-white p-4 rounded-lg border border-[#d2d2d2] shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-stone-500 uppercase flex justify-between">
            <span>Average Value</span>
            <span className="text-[#005c46] font-mono">Stable</span>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-[#303030] tracking-tight">₹{averageOrderValue.toFixed(2)}</h3>
            <div className="mt-3 h-1 bg-[#f1f1f1] rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-orange-400"></div>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">average value per ticket</p>
          </div>
        </div>

         {/* Conversion Rate */}
        <div className="bg-white p-4 rounded-lg border border-[#d2d2d2] shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-stone-500 uppercase flex justify-between">
            <span>Conversion Rate</span>
            <span className="text-red-600 font-mono">-0.4%</span>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-[#303030] tracking-tight">{conversionRate}%</h3>
            <div className="mt-3 h-1 bg-[#f1f1f1] rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-purple-500"></div>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">visitor to sales ratio</p>
          </div>
        </div>

      </div>

      {/* Live Operational Alerts Tray */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg border border-[#d2d2d2] shadow-sm">
        
        {/* Low stock alert */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded shrink-0">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-800 leading-tight">Inventory Warnings</h4>
            <p className="text-[10px] text-stone-500 mt-0.5">
              {lowStockThresholdProducts.length === 0 ? 'All levels green' : `${lowStockThresholdProducts.length} items near threshold`}
            </p>
          </div>
          {lowStockThresholdProducts.length > 0 && (
            <button
              onClick={() => onNavigate('products')}
              className="ml-auto text-[10px] font-bold text-[#005c46] hover:underline"
            >
              Examine
            </button>
          )}
        </div>

        {/* Pending fulfillment */}
        <div className="flex items-center gap-3 md:border-x md:border-[#f1f1f1] md:px-5">
          <div className="p-2 bg-blue-105 text-[#2c6ecb] rounded shrink-0">
            <Package className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-800 leading-tight">Unfulfilled Shipments</h4>
            <p className="text-[10px] text-stone-500 mt-0.5">{pendingShipmentsCount} logs ready to verify</p>
          </div>
          {pendingShipmentsCount > 0 && (
            <button
              onClick={() => onNavigate('orders')}
              className="ml-auto text-[10px] font-bold text-[#2c6ecb] hover:underline"
            >
              Fulfill
            </button>
          )}
        </div>

        {/* Active NDR Warning */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-700 rounded shrink-0">
            <PackageX className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-800 leading-tight">Delivery Exceptions</h4>
            <p className="text-[10px] text-stone-500 mt-0.5">{activeNdrCases} active NDR cases pending</p>
          </div>
          {activeNdrCases > 0 && (
            <button
              onClick={() => onNavigate('shipping')}
              className="ml-auto text-[10px] font-bold text-red-700 hover:underline"
            >
              Review
            </button>
          )}
        </div>

      </div>

      {/* Main Charts Hub and category split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sales trend chart */}
        <div className="bg-white p-5 rounded-lg border border-[#d2d2d2] shadow-sm md:col-span-2">
          <div className="flex items-center justify-between pb-4 mb-2">
            <div>
              <h3 className="text-xs font-bold text-stone-900 tracking-tight">Monthly Revenue Stream</h3>
              <p className="text-[10px] text-stone-400 mt-0.5">Consolidated INR values over previous quarters.</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-stone-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#005c46] rounded-full" /> Revenue (₹)</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005c46" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#005c46" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a8a29e" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a8a29e" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px', border: '1px solid #d2d2d2' }} />
                <Area type="monotone" dataKey="revenue" stroke="#005c46" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown bar charts */}
        <div className="bg-white p-5 rounded-lg border border-[#d2d2d2] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-stone-900 tracking-tight">Product Sales Split</h3>
            <p className="text-[10px] text-stone-400 mt-0.5">Contribution percentages across top catalogs.</p>
          </div>

          <div className="mt-4 space-y-4">
            {categoryShareData.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-700 text-[11px]">{cat.name}</span>
                  <span className="font-mono font-bold text-stone-500 text-[11px]">{cat.value}%</span>
                </div>
                <div className="h-2 w-full bg-stone-150 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color === '#4f46e5' ? '#005c46' : cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#2c6ecb] text-white border border-[#2358a3] rounded-lg p-4 mt-6">
            <span className="text-xs font-bold mb-1 block">Pro Tip: Optimization</span>
            <p className="text-[11px] opacity-90 leading-normal">
              Your conversion rate is 15% higher on mobile devices than desktop this month. Consider focusing your ads on mobile traffic.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Table: Recent Orders for instant lookup */}
      <div className="bg-white rounded-lg border border-[#d2d2d2] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#f1f1f1] font-bold text-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#303030] tracking-tight">Recent Orders</h3>
            <p className="text-[10px] text-gray-500 mt-0.5 font-normal">Most recent incoming customer transaction blocks.</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs inline-flex items-center gap-1 text-[#2c6ecb] hover:underline font-medium"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#f9f9f9] border-b border-[#f1f1f1]">
              <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4 font-normal">Date Placed</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4">Payment</th>
                <th className="py-2.5 px-4">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f1]">
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/70 font-medium">
                  <td className="py-3 px-4 font-bold text-[#2c6ecb]">{order.id}</td>
                  <td className="py-3 px-4">{order.customer.name}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-stone-900">₹{order.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-green-105 text-green-700'
                        : 'bg-yellow-105 text-yellow-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.fulfillmentStatus === 'Delivered'
                        ? 'bg-green-105 text-green-700'
                        : order.fulfillmentStatus === 'Shipped'
                        ? 'bg-blue-105 text-blue-700'
                        : 'bg-yellow-105 text-yellow-700'
                    }`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
