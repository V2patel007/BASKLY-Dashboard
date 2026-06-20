/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  Printer,
  ChevronRight,
  User,
  MapPin,
  CircleDollarSign,
  MessageSquare,
  RefreshCw,
  Clock,
  ArrowLeft,
  Barcode,
  Package,
  Check,
  AlertCircle
} from 'lucide-react';
import { Order, OrderItem, ShippingLog } from '../types.ts';

interface OrdersTabProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function OrdersTab({
  orders,
  setOrders,
  onLogActivity
}: OrdersTabProps) {
  // Navigation
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Paid' | 'Pending' | 'Refunded'>('All');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'All' | 'Unfulfilled' | 'Fulfilled' | 'Shipped' | 'Delivered'>('All');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Shiprocket simulated loading state
  const [logisticsActiveId, setLogisticsActiveId] = useState<'ship' | 'awb' | 'label' | 'track' | null>(null);

  const isReadOnly = false; // Inventory managers usually can fulfill but maybe restricted on basic finance changes

  // Filter List
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;
    const matchesFullfill = fulfillmentFilter === 'All' || o.fulfillmentStatus === fulfillmentFilter;
    return matchesSearch && matchesPayment && matchesFullfill;
  });

  const activeOrder = orders.find(o => o.id === selectedOrderId);

  // Order state actions
  const updateFulfillment = (status: 'Fulfilled' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    if (!selectedOrderId) return;
    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderId) {
        const timeNow = new Date().toLocaleTimeString();
        return {
          ...o,
          fulfillmentStatus: status,
          timeline: [
            ...o.timeline,
            { id: `t-${Date.now()}`, date: `${timeNow}, Today`, title: `Order set to ${status}`, desc: `Operator modified status manually.`, user: 'System' }
          ]
        };
      }
      return o;
    }));
    onLogActivity(`Marked order "${selectedOrderId}" as ${status}`, 'Order', selectedOrderId);
  };

  const refundOrder = () => {
    if (!selectedOrderId) return;
    if (window.confirm("Are you sure you want to trigger a full refund? Payment Gateway will reverse fees.")) {
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrderId) {
          return {
            ...o,
            paymentStatus: 'Refunded',
            fulfillmentStatus: 'Cancelled',
            timeline: [
              ...o.timeline,
              { id: `t-${Date.now()}`, date: 'Just now', title: 'Refund initiated', desc: 'SaaS automated API routed gateway reverse.', user: 'Gateway' }
            ]
          };
        }
        return o;
      }));
      onLogActivity(`Processed full refund for "${selectedOrderId}"`, 'Order', selectedOrderId);
    }
  };

  // Shiprocket Actions Simulated
  const triggerShiprocketCreate = () => {
    if (!selectedOrderId || !activeOrder) return;
    setLogisticsActiveId('ship');
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrderId) {
          return {
            ...o,
            fulfillmentStatus: 'Shipped',
            shiprocket: {
              courierName: 'Delhivery Air Standard',
              awbNumber: `SR-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
              trackingStatus: 'In Transit',
              deliveryEta: new Date(Date.now() + 3*24*60*60*1000).toISOString().slice(0, 10),
              logs: [
                { id: 'sl-r1', timestamp: 'Just now', status: 'Approved', location: 'Primary Hub', activity: 'Manifest cleared on Shiprocket partner portal.' }
              ]
            },
            timeline: [
              ...o.timeline,
              { id: `t-sr1`, date: 'Just now', title: 'Carrier Shipment Dispatch', desc: 'Created Delhivery AWB label securely under manifest.', user: 'Shiprocket API' }
            ]
          };
        }
        return o;
      }));
      setLogisticsActiveId(null);
      onLogActivity(`Created Shiprocket shipment details on order "${selectedOrderId}"`, 'Order', selectedOrderId);
    }, 1500);
  };

  const triggerShiprocketGenerateAWB = () => {
    if (!selectedOrderId || !activeOrder || !activeOrder.shiprocket) return;
    setLogisticsActiveId('awb');
    setTimeout(() => {
      alert(`AWB Generated successfully! Carrier Node linked payload. Code: ${activeOrder.shiprocket?.awbNumber}`);
      setLogisticsActiveId(null);
    }, 1000);
  };

  const triggerShiprocketLabelDownload = () => {
    setLogisticsActiveId('label');
    setTimeout(() => {
      setIsInvoiceOpen(true); // Open printing invoice and shipping slip directly for high-value UX
      setLogisticsActiveId(null);
    }, 800);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans text-stone-800">

      {!selectedOrderId ? (
        <>
          {/* List View Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d2d2d2] pb-5">
            <div>
              <h2 className="text-xl font-bold font-display text-[#303030] tracking-tight">Orders List</h2>
              <p className="text-xs text-stone-500 mt-1">Audit customer checkouts, print tax receipts, and configure carrier routing.</p>
            </div>
          </div>

          {/* Search Table Filters */}
          <div className="bg-white border border-[#d2d2d2] rounded-md p-4 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Fuzzy search orders by customer name, order #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold pl-9 pr-4 py-2 border border-[#d2d2d2] focus:outline-none focus:border-black rounded-md"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-tight shrink-0">Paid Status:</span>
              {(['All', 'Paid', 'Pending', 'Refunded'] as const).map((pay) => (
                <button
                  key={pay}
                  onClick={() => setPaymentFilter(pay)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors shrink-0 ${
                    paymentFilter === pay
                      ? 'bg-[#ebebeb] text-[#303030] border-[#d2d2d2]'
                      : 'bg-white text-stone-600 border-[#d2d2d2] hover:bg-[#f7f7f7]'
                  }`}
                >
                  {pay}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
              <span className="text-[10px] font-bold text-stone-500 tracking-tight uppercase shrink-0">Fulfillment:</span>
              {(['All', 'Unfulfilled', 'Shipped', 'Delivered'] as const).map((full) => (
                <button
                  key={full}
                  onClick={() => setFulfillmentFilter(full)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors shrink-0 ${
                    fulfillmentFilter === full
                      ? 'bg-[#ebebeb] text-[#303030] border-[#d2d2d2]'
                      : 'bg-white text-stone-605 border-[#d2d2d2] hover:bg-[#f7f7f7]'
                  }`}
                >
                  {full}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Data Table */}
          <div className="bg-white rounded-md border border-[#d2d2d2] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto text-xs">
                <thead>
                  <tr className="bg-[#f9f9f9] text-[10px] font-bold text-stone-500 uppercase tracking-tight border-b border-[#d2d2d2]">
                    <th className="py-2.5 px-4">Order ID</th>
                    <th className="py-2.5 px-4">Client Name</th>
                    <th className="py-2.5 px-4">Checkout date</th>
                    <th className="py-2.5 px-4 text-right">Invoice Amount</th>
                    <th className="py-2.5 px-4 text-center">Payment</th>
                    <th className="py-2.5 px-4 text-center">Courier details</th>
                    <th className="py-2.5 px-4 text-center">Carrier Status</th>
                    <th className="py-2.5 px-4 text-center">Fulfill details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f1f1]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-400 font-medium">
                        <AlertCircle className="h-4 w-4 mx-auto text-stone-300 mb-2" />
                        No orders registered under these filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/70 cursor-pointer text-stone-700" onClick={() => setSelectedOrderId(o.id)}>
                        <td className="py-3 px-4 font-bold text-[#2c6ecb] font-mono">{o.id}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-800">{o.customer.name}</p>
                          <p className="text-[10px] text-stone-400">{o.customer.email}</p>
                        </td>
                        <td className="py-3 px-4 text-stone-500 font-medium">
                          {new Date(o.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-stone-950">₹{o.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.paymentStatus === 'Paid'
                              ? 'bg-green-105 text-green-700 border border-transparent'
                              : o.paymentStatus === 'Pending'
                              ? 'bg-yellow-105 text-yellow-705 border border-transparent'
                              : 'bg-red-105 text-red-700 border border-transparent'
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {o.shiprocket ? (
                            <div className="space-y-0.5 inline-block text-left">
                              <p className="font-bold text-stone-700 text-[10px]">{o.shiprocket.courierName}</p>
                              <span className="font-mono text-[9px] text-[#2c6ecb] font-bold">{o.shiprocket.awbNumber}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-mono">self logistics</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {o.shiprocket ? (
                            <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[9px] ${
                              o.shiprocket.trackingStatus === 'Delivered'
                                ? 'bg-green-105 text-green-700'
                                : 'bg-blue-105 text-blue-700'
                            }`}>
                              {o.shiprocket.trackingStatus}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-medium">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="p-1 hover:bg-stone-100 rounded-md">
                            <ChevronRight className="h-4 w-4 text-stone-400" />
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
        /* Detailed View of order */
        activeOrder && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
            
            {/* Nav Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-5 gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedOrderId(null)} className="p-1.5 hover:bg-stone-50 rounded bg-stone-100 border border-stone-200">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    Order details: {activeOrder.id}
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${
                      activeOrder.paymentStatus === 'Paid' ? 'bg-emerald-100 border-emerald-200 text-emerald-900' : 'bg-amber-100 border-amber-200 text-amber-900'
                    }`}>
                      {activeOrder.paymentStatus}
                    </span>
                  </h3>
                  <p className="text-[10px] text-stone-400 mt-1 font-medium select-none">
                    Session placement: {new Date(activeOrder.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 hover:bg-stone-50 text-xs font-semibold rounded-lg text-stone-600"
                >
                  <Printer className="h-4 w-4" />
                  Print Tax Bill
                </button>
                {activeOrder.fulfillmentStatus === 'Unfulfilled' && !isReadOnly && (
                  <button
                    onClick={() => updateFulfillment('Fulfilled')}
                    className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
                  >
                    Mark Fulfilled
                  </button>
                )}
                {activeOrder.paymentStatus === 'Paid' && !isReadOnly && (
                  <button
                    onClick={refundOrder}
                    className="px-3.5 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-extrabold rounded-lg"
                  >
                    Reverse Charge (Refund)
                  </button>
                )}
              </div>
            </div>

            {/* Layout Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left col: products list & timelines */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Products Grid */}
                <div className="border border-stone-200 bg-stone-50/10 p-5 rounded-xl space-y-3">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5">
                    Purchased Goods
                  </p>
                  <div className="divide-y divide-stone-100">
                    {activeOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3">
                        <div className="flex gap-3 min-w-0">
                          <img src={item.image} alt="Purchased slide" className="w-10 h-10 object-cover rounded border border-stone-200" />
                          <div>
                            <p className="text-xs font-bold text-stone-900 truncate max-w-[250px]">{item.productName}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5 font-medium">{item.variantDetails || `SKU: ${item.sku}`}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-stone-500 font-mono">₹{item.price.toFixed(2)} x {item.quantity}</span>
                          <p className="text-xs font-bold text-stone-900 mt-0.5">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Math Summary */}
                  <div className="border-t border-stone-100 pt-3 space-y-1.5 text-xs text-stone-600 font-semibold select-none">
                    <div className="flex justify-between">
                      <span>Taxable Price</span>
                      <span className="font-mono text-stone-900">₹{activeOrder.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Simulated Tax (5% Spices GST)</span>
                      <span className="font-mono text-stone-900">₹{activeOrder.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Postal Courier Fee</span>
                      <span className="font-mono text-stone-900">₹{activeOrder.shippingAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-extrabold text-stone-950">
                      <span>Total Invoice</span>
                      <span className="font-mono text-indigo-700">₹{(activeOrder.amount + activeOrder.taxAmount + activeOrder.shippingAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Logistics section (Shiprocket Panel Integration) */}
                <div className="bg-gradient-to-r from-stone-50 to-indigo-50/30 border border-indigo-200 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-[#008060] flex items-center gap-1.5 uppercase tracking-wide">
                        <Truck className="h-4 w-4" />
                        Shiprocket Logistics Portal
                      </h4>
                      <p className="text-[9px] text-stone-400 font-medium">Create direct awb orders instantly, monitor status logs and tracking codes.</p>
                    </div>
                    {activeOrder.shiprocket && (
                      <span className="text-[8px] bg-[#e2f1ec] text-[#004b35] border border-[#a3e2d1] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse">
                        Delhivery Carrier Active
                      </span>
                    )}
                  </div>

                  {activeOrder.shiprocket ? (
                    <div className="space-y-4 font-semibold text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-3.5 border border-stone-200 rounded-lg">
                        <div>
                          <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-3">Courier Desk</p>
                          <span className="font-bold text-stone-800 mt-1 block">{activeOrder.shiprocket.courierName}</span>
                        </div>
                        <div>
                          <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-3">Freight AWB Code</p>
                          <span className="font-mono font-extrabold text-indigo-700 mt-1 block">{activeOrder.shiprocket.awbNumber}</span>
                        </div>
                        <div>
                          <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-3">Status Logs Tracker</p>
                          <span className="font-mono font-bold text-rose-700 mt-1 block">{activeOrder.shiprocket.trackingStatus}</span>
                        </div>
                      </div>

                      {/* Log milestones flow */}
                      <div className="space-y-2">
                        <p className="text-[9px] text-stone-400 uppercase tracking-widest border-b border-stone-50 pb-1 flex items-center gap-1.5">
                          <Check className="h-3 w-3" /> Carrier Hub Transit Logs
                        </p>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {activeOrder.shiprocket.logs.map((lg) => (
                            <div key={lg.id} className="text-[10px] bg-white border border-stone-200/50 p-2.5 rounded-lg flex justify-between items-start">
                              <div>
                                <p className="font-bold text-[#008060]">{lg.status} – <span className="text-stone-500 font-normal">{lg.location}</span></p>
                                <p className="text-[9px] text-stone-500 font-medium mt-0.5">{lg.activity}</p>
                              </div>
                              <span className="text-[9px] font-mono text-stone-400 shrink-0">{lg.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Secondary interactions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                        <button
                          onClick={triggerShiprocketGenerateAWB}
                          className="px-3 py-1.5 font-bold text-[11px] border border-stone-200 hover:bg-stone-50 hover:text-stone-850 rounded"
                          disabled={logisticsActiveId !== null}
                        >
                          {logisticsActiveId === 'awb' ? 'Authorizing...' : 'Generate Route AWB'}
                        </button>
                        <button
                          onClick={triggerShiprocketLabelDownload}
                          className="px-3 py-1.5 font-bold text-[11px] border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded flex items-center gap-1"
                        >
                          <Barcode className="h-4 w-4" />
                          Generate Cargo Label
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-white border border-dashed rounded-lg">
                      <Truck className="h-7 w-7 text-stone-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-stone-600">Pending Shiprocket Carrier Setup</p>
                      <p className="text-[9px] text-stone-400 mt-1 max-w-xs mx-auto">Click below to push variables directly to Delhivery Air routing APIs.</p>
                      <button
                        onClick={triggerShiprocketCreate}
                        className="inline-flex mt-4 text-[10px] font-extrabold text-white bg-[#008060] hover:bg-[#006e52] px-3 py-1.5 rounded-md"
                        disabled={logisticsActiveId !== null}
                      >
                        {logisticsActiveId === 'ship' ? 'Securing Carrier Clearance...' : 'Fulfill via Shiprocket'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Timeline and operator flow logs */}
                <div className="bg-white border border-stone-200 p-5 rounded-xl space-y-3 shadow-3xs">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5">
                    Order Timeline & Audit logs
                  </p>
                  <div className="space-y-4 pt-1.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
                    {activeOrder.timeline.map((item) => (
                      <div key={item.id} className="relative pl-7 text-xs">
                        <div className="absolute left-[8px] top-1 w-2.5 h-2.5 rounded-full bg-[#008060] ring-4 ring-white" />
                        <div className="flex items-center justify-between font-semibold">
                          <span className="font-bold text-stone-800">{item.title}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{item.date}</span>
                        </div>
                        <p className="text-stone-500 font-medium text-[11px] mt-0.5">{item.desc}</p>
                        {item.user && (
                          <span className="text-[9px] bg-slate-100 text-stone-550 border rounded-xs px-1 py-0.2 mt-1 inline-block">
                            Operator: {item.user}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right column: customer CRM notes, delivery addresses */}
              <div className="space-y-6">
                
                {/* Customer tags cards */}
                <div className="bg-white border border-stone-200 p-5 rounded-xl space-y-3 shadow-3xs">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                    <User className="h-4 w-4" /> Customer Profile
                  </p>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-stone-905">{activeOrder.customer.name}</p>
                    <p className="text-[#008060] font-medium truncate">{activeOrder.customer.email}</p>
                    <p className="text-stone-500 font-mono">{activeOrder.customer.phone}</p>
                  </div>
                </div>

                {/* Delivery location address */}
                <div className="bg-white border border-stone-200 p-5 rounded-xl space-y-3 shadow-3xs">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> Delivery Address
                  </p>
                  <div className="space-y-1 text-xs text-stone-600 font-semibold leading-relaxed">
                    <p className="text-stone-850">{activeOrder.shippingAddress.street}</p>
                    <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state}</p>
                    <p className="font-mono">{activeOrder.shippingAddress.zip}</p>
                    <p className="text-[10px] font-bold text-stone-400 mt-2 uppercase tracking-wider">{activeOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Checkout Memo Notes */}
                <div className="bg-white border border-stone-200 p-5 rounded-xl space-y-3 shadow-3xs">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" /> Checkout Memo Note
                  </p>
                  <p className="text-xs text-stone-500 font-semibold italic leading-relaxed">
                    {activeOrder.notes || 'No special operator notes registered on checkout.'}
                  </p>
                </div>

              </div>

            </div>
          </div>
        )
      )}

      {/* DETAILED TAX INVOICE OVERLAY (STANDARDS PRINTOUT FOR THERMAL PRINTERS) */}
      {isInvoiceOpen && activeOrder && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="relative bg-white rounded-xl border border-stone-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-6 shadow-2xl animate-scale-up">
            
            {/* Overlay Title control */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6 shrink-0">
              <h4 className="text-xs font-bold text-[#008060] uppercase tracking-widest flex items-center gap-1.5">
                <Barcode className="h-4 w-4" /> tax compliance receipt invoice
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-stone-900 border text-white text-xs font-bold rounded hover:bg-stone-800 transition-colors inline-flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Tax Bill
                </button>
                <button
                  onClick={() => setIsInvoiceOpen(false)}
                  className="px-3 py-1 border text-stone-500 text-xs font-semibold rounded hover:bg-stone-50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* Printable Frame Area */}
            <div id="invoice-bill-frame" className="space-y-6 text-xs text-stone-800 font-medium font-sans leading-relaxed p-4 border rounded bg-slate-50/20">
              
              {/* Receipt Header block */}
              <div className="flex justify-between items-start border-b border-dashed pb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wide">Baskly & Co.</h3>
                  <p className="text-[9px] text-stone-400 mt-1">Reg Office: 14/B Saffron Boulevard, Pampore, Pulwama, J&K</p>
                  <p className="text-[9px] text-stone-400">GSTIN Registration: 01AAGCA8412F1Z8</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-indigo-700">INVOICE: #AR-2026-{activeOrder.id.replace('#ORD-', '')}</p>
                  <p className="text-[10px] mt-1 font-mono">{new Date(activeOrder.date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Addressee panels */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Billing Client</h5>
                  <p className="font-bold text-stone-950">{activeOrder.customer.name}</p>
                  <p className="text-stone-500">{activeOrder.customer.email}</p>
                  <p className="font-mono text-stone-400">{activeOrder.customer.phone}</p>
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Shipping consingment</h5>
                  <p className="text-stone-850 font-bold">{activeOrder.shippingAddress.street}</p>
                  <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - <span className="font-mono">{activeOrder.shippingAddress.zip}</span></p>
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wide">{activeOrder.shippingAddress.country}</span>
                </div>
              </div>

              {/* Items tabular panel */}
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b-2 border-stone-200 text-stone-400 uppercase font-bold text-[9px] tracking-wider">
                    <th className="py-2">Item specifics</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit HSN</th>
                    <th className="py-2 text-right">Selling rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dotted">
                  {activeOrder.items.map((item) => (
                    <tr key={item.id} className="py-2">
                      <td className="py-2">
                        <p className="font-bold text-stone-900">{item.productName}</p>
                        <p className="text-[9px] text-stone-400 mt-0.5">{item.variantDetails || `SKU: ${item.sku}`}</p>
                      </td>
                      <td className="py-2 text-center font-bold">{item.quantity}</td>
                      <td className="py-2 text-right font-mono text-stone-500">09102010</td>
                      <td className="py-2 text-right font-bold text-stone-950">₹{item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total block tax compliant */}
              <div className="flex justify-between items-center pt-4 border-t border-dashed">
                <div className="space-y-0.5 text-stone-400 text-[10px]">
                  <p>Inter-State CGST (2.5%): Included</p>
                  <p>Inter-State SGST (2.5%): Included</p>
                  <p>Paid status: <b> Razorpay Authorized Transaction</b></p>
                </div>
                <div className="text-right font-semibold space-y-1">
                  <div className="flex gap-4">
                    <span>Taxable Base:</span>
                    <span className="font-mono shrink-0">₹{activeOrder.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4">
                    <span>Total Bill:</span>
                    <span className="font-mono font-extrabold text-[#008060] shrink-0">₹{(activeOrder.amount + activeOrder.taxAmount + activeOrder.shippingAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-4 text-center select-none">
                <Barcode className="h-10 w-48 mx-auto text-stone-300 transform scale-x-125" />
                <p className="text-[9px] font-mono text-stone-400 mt-1">TRACKING: {activeOrder.shiprocket?.awbNumber || 'PENDING_AWB_GENERATION'}</p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
