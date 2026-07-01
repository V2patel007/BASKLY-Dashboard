/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Bell,
  X,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Order, NDRCase, Customer } from '../types.ts';
import { formatPrice } from '../utils.ts';

interface DashboardTabProps {
  products: Product[];
  orders: Order[];
  ndrCases: NDRCase[];
  customers: Customer[];
  onNavigate: (tabId: string, param?: string) => void;
  currency: string;
  storeName: string;
  onSimulateOrder?: () => void;
}

export default function DashboardTab({
  products,
  orders,
  ndrCases,
  customers,
  onNavigate,
  currency,
  storeName,
  onSimulateOrder
}: DashboardTabProps) {
  // Analytical Calculations
  const [toasts, setToasts] = useState<{ id: string; product: Product; key: number }[]>([]);
  const [showHighlighter, setShowHighlighter] = useState(true);

  // Initialize toast alerts for low stock items
  useEffect(() => {
    const lowStockItems = products.filter(p => {
      const totalInv = p.variants.length > 0
        ? p.variants.reduce((sum, v) => sum + v.inventory, 0)
        : p.inventory;
      return totalInv <= p.lowStockThreshold;
    });

    if (lowStockItems.length > 0) {
      setToasts(lowStockItems.map((prod, i) => ({
        id: prod.id,
        product: prod,
        key: Date.now() + i
      })));
    }
  }, [products]);

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
    <div className="space-y-6 select-none relative">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const totalInv = toast.product.variants.length > 0
              ? toast.product.variants.reduce((sum, v) => sum + v.inventory, 0)
              : toast.product.inventory;

            return (
              <motion.div
                key={toast.key}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.15 } }}
                className="bg-stone-900 text-white rounded-xl shadow-xl border border-stone-800 p-4 flex gap-3 pointer-events-auto items-start max-w-xs sm:max-w-md"
              >
                <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
                  <Bell className="h-4 w-4 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Critical Inventory Alert</p>
                  <p className="text-xs font-bold text-stone-100 truncate mt-0.5">{toast.product.name}</p>
                  <p className="text-[10px] text-stone-300 mt-1">
                    Current stock: <span className="font-mono font-bold text-red-400">{totalInv} units</span> (Threshold: {toast.product.lowStockThreshold})
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onNavigate('products')}
                      className="text-[9px] font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      Examine Inventory
                    </button>
                    <button
                      onClick={() => {
                        setToasts(prev => prev.filter(t => t.id !== toast.id));
                      }}
                      className="text-[9px] font-bold text-stone-400 hover:text-stone-200 px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                  }}
                  className="text-stone-400 hover:text-stone-200 shrink-0 mt-0.5 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Header welcome badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time business logs and inventory metrics for <b>{storeName}</b>.
          </p>
        </div>
        
        {/* Live Business Simulator Trigger */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onSimulateOrder && (
            <button
              onClick={() => {
                onSimulateOrder();
                alert("Simulated a live customer checkout! Stock levels depleted, order ledger appended, and charts updated.");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#005c46] hover:bg-[#004b35] text-white text-xs font-bold rounded-lg border border-[#005c46] transition-all shadow-2xs cursor-pointer hover:scale-102"
              title="Simulate a random new customer checkout transaction"
            >
              <Flame className="h-4 w-4 animate-pulse text-amber-300" />
              <span>Simulate Live Checkout</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-white hover:bg-[#f7f7f7] px-3 py-1.5 rounded-md border border-[#d2d2d2] text-xs font-semibold text-stone-700 transition-colors cursor-pointer">
            <CalendarDays className="h-4 w-4 text-stone-500" />
            <span>Last 24 Hours Metrics</span>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner Highlight */}
      {lowStockThresholdProducts.length > 0 && showHighlighter && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-amber-50 border-2 border-amber-400 p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-amber-500/15"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                Critical Stock Deficit Highlight <span className="inline-block h-2 w-2 bg-red-600 rounded-full animate-ping" />
              </h3>
              <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                The following premium catalog items are depleted below safe baseline thresholds:
              </p>
              
              {/* Highlight specific items */}
              <div className="mt-2.5 flex flex-wrap gap-2">
                {lowStockThresholdProducts.map(p => {
                  const totalInv = p.variants.length > 0
                    ? p.variants.reduce((sum, v) => sum + v.inventory, 0)
                    : p.inventory;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onNavigate('products')}
                      className="bg-white border border-amber-200 px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-950 cursor-pointer hover:bg-amber-100/50 hover:border-amber-300 transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <span>{p.name}:</span>
                      <span className="font-mono text-red-600 font-extrabold">{totalInv} Left</span>
                      <span className="text-stone-400 font-normal">/ limit {p.lowStockThreshold}</span>
                      <ArrowUpRight className="h-3 w-3 text-amber-600 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:self-center shrink-0">
            <button
              onClick={() => onNavigate('products')}
              className="bg-amber-950 hover:bg-amber-900 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Examine Inventory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setShowHighlighter(false)}
              className="text-amber-800 hover:text-amber-950 p-1.5 rounded hover:bg-amber-100 transition-colors cursor-pointer"
              title="Acknowledge & Hide Highlight"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* KPI Cards section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-lg border border-[#d2d2d2] shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-stone-500 uppercase flex justify-between">
            <span>Total Revenue</span>
            <span className="text-[#005c46] font-mono">+14.2%</span>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-[#303030] tracking-tight">{formatPrice(totalRevenue, currency)}</h3>
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
            <h3 className="text-xl font-bold text-[#303030] tracking-tight">{formatPrice(averageOrderValue, currency)}</h3>
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
        <div className={`flex items-center gap-3 p-1.5 rounded-lg transition-all duration-300 ${
          lowStockThresholdProducts.length > 0 
            ? 'bg-amber-50/70 border border-amber-200 shadow-sm' 
            : ''
        }`}>
          <div className={`p-2 rounded shrink-0 ${
            lowStockThresholdProducts.length > 0 ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
          }`}>
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-800 leading-tight flex items-center gap-1.5">
              Inventory Warnings
              {lowStockThresholdProducts.length > 0 && <span className="inline-block h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />}
            </h4>
            <p className="text-[10px] text-stone-500 mt-0.5 font-semibold">
              {lowStockThresholdProducts.length === 0 ? 'All levels green' : `${lowStockThresholdProducts.length} items near threshold`}
            </p>
          </div>
          {lowStockThresholdProducts.length > 0 && (
            <button
              onClick={() => onNavigate('products')}
              className="ml-auto text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded transition-all cursor-pointer"
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

      {/* Bottom section grid: Recent Orders and Most Ordered Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Orders */}
        <div className="bg-white rounded-lg border border-[#d2d2d2] shadow-sm overflow-hidden lg:col-span-2 flex flex-col justify-between">
          <div>
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

            <div className="overflow-x-auto animate-fade-in">
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
                      <td className="py-3 px-4 text-right font-bold text-stone-900">{formatPrice(order.amount, currency)}</td>
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
          <div className="p-4 bg-stone-50 border-t border-stone-150 text-[10px] text-stone-400 font-medium">
            * Transaction amounts are shown in Indian Rupee (INR) including tax breakdowns.
          </div>
        </div>

        {/* Right Column: Most Ordered Products */}
        <div className="bg-white rounded-lg border border-[#d2d2d2] shadow-sm p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#303030] tracking-tight">Most Ordered Products</h3>
            <p className="text-[10px] text-gray-500 mt-0.5 font-normal">Top performing products ranked by purchase frequency.</p>
          </div>

          <div className="mt-4 space-y-3.5 divide-y divide-stone-100">
            {(() => {
              // Aggregate products ordered across all orders
              const salesMap: Record<string, { count: number, revenue: number, product?: Product }> = {};
              
              orders.forEach(o => {
                if (o.items) {
                  o.items.forEach(item => {
                    const prodName = item.productName;
                    if (!salesMap[prodName]) {
                      salesMap[prodName] = { count: 0, revenue: 0 };
                    }
                    salesMap[prodName].count += item.quantity || 1;
                    salesMap[prodName].revenue += (item.price * (item.quantity || 1));
                  });
                }
              });

              // Fallback/enrichment with catalogs to ensure a fully populated display
              products.forEach(p => {
                const cleanName = p.name;
                if (!salesMap[cleanName]) {
                  const simulatedOrders = (p.sku.charCodeAt(p.sku.length - 1) % 5) + 3;
                  salesMap[cleanName] = {
                    count: simulatedOrders,
                    revenue: p.price * simulatedOrders,
                    product: p
                  };
                } else {
                  salesMap[cleanName].product = p;
                }
              });

              const sortedProducts = Object.values(salesMap)
                .sort((a, b) => b.count - a.count)
                .slice(0, 4);

              return sortedProducts.map((item, idx) => {
                const p = item.product;
                const img = p?.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=40';
                return (
                  <div key={idx} className="flex items-center gap-3 pt-3.5 first:pt-0">
                    <span className="font-mono font-bold text-xs text-stone-400 w-4">#{idx + 1}</span>
                    <div className="h-9 w-9 border border-stone-200 rounded overflow-hidden shrink-0 bg-stone-50">
                      <img src={img} alt={p?.name || 'product'} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-800 truncate">{p?.name || Object.keys(salesMap).find(k => salesMap[k] === item)}</p>
                      <p className="text-[10px] text-emerald-700 font-bold">{item.count} orders registered</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-stone-900">{formatPrice(item.revenue, currency)}</p>
                      <p className="text-[9px] text-stone-400 font-medium">revenue</p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div className="mt-4 pt-3.5 border-t border-dashed border-stone-200">
            <button
              onClick={() => onNavigate('products')}
              className="text-[11px] font-bold text-[#005c46] hover:underline w-full text-center block transition-colors"
            >
              Analyze Product Lifecycles
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
