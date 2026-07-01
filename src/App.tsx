/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_HAMPERS,
  INITIAL_SUPPLIERS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_CMS_PAGES,
  INITIAL_NDR_CASES
} from './data.ts';

import { Product, Category, Order, Customer, Coupon, GiftHamper, LabCertificateMapping, Supplier, ActivityLog, CMSPage, NDRCase } from './types.ts';
import { generateMockOrder } from './utils.ts';

// Nav elements layouts
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import CommandPalette from './components/CommandPalette.tsx';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal.tsx';
import DeveloperFilesViewer from './components/DeveloperFilesViewer.tsx';

// Primary tab components
import DashboardTab from './components/DashboardTab.tsx';
import ProductsTab from './components/ProductsTab.tsx';
import CategoriesTab from './components/CategoriesTab.tsx';
import OrdersTab from './components/OrdersTab.tsx';
import ShippingTab from './components/ShippingTab.tsx';
import CustomersTab from './components/CustomersTab.tsx';
import CouponsTab from './components/CouponsTab.tsx';
import CMSTab from './components/CMSTab.tsx';
import HampersTab from './components/HampersTab.tsx';
import CertificatesTab from './components/CertificatesTab.tsx';
import SuppliersTab from './components/SuppliersTab.tsx';
import AnalyticsTab from './components/AnalyticsTab.tsx';
import SettingsTab from './components/SettingsTab.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<'Super Admin' | 'Admin' | 'Manager' | 'Inventory Manager' | 'Customer Support'>('Administrator' as any);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Global enterprise preferences
  const [currency, setCurrency] = useState<string>('INR');
  const [storeName, setStoreName] = useState<string>('Baskly Premium');

  // Central Shared Business state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [giftHampers, setHampers] = useState<GiftHamper[]>(INITIAL_HAMPERS);
  const [labCertificates, setLabCertificates] = useState<LabCertificateMapping[]>(() => 
    INITIAL_PRODUCTS.flatMap(p => p.certificates || [])
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [cmsPages, setCmsPages] = useState<CMSPage[]>(INITIAL_CMS_PAGES);
  const [ndrCases, setNdrCases] = useState<NDRCase[]>(INITIAL_NDR_CASES);

  // Sync dark mode style on HTML node root
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Global Keyboard Shortcuts Controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Modals escape closure (always allowed)
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(false);
        return;
      }

      // 2. Search & Command Palette (always allowed)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // If user is actively typing in inputs or text fields, ignore other navigation shortcuts
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.getAttribute('contenteditable') === 'true'
      );
      if (isTyping) return;

      // 3. Show/hide keyboard shortcuts directory (? or Shift+?)
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      // 4. Tab selection via quick Alt keys (Alt + Num/Key)
      if (e.altKey) {
        if (e.key === '1') { e.preventDefault(); setActiveTab('dashboard'); }
        else if (e.key === '2') { e.preventDefault(); setActiveTab('products'); }
        else if (e.key === '3') { e.preventDefault(); setActiveTab('categories'); }
        else if (e.key === '4') { e.preventDefault(); setActiveTab('hampers'); }
        else if (e.key === '5') { e.preventDefault(); setActiveTab('orders'); }
        else if (e.key === '6') { e.preventDefault(); setActiveTab('shipping'); }
        else if (e.key.toLowerCase() === 's') { e.preventDefault(); setActiveTab('settings'); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Shared audit activity logging function
  const handleLogActivity = (
    action: string,
    category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon',
    target: string
  ) => {
    const freshLog: ActivityLog = {
      id: `act-${Date.now()}`,
      action,
      user: 'virajptl00@gmail.com',
      role: userRole,
      timestamp: new Date().toISOString(),
      target,
      category
    };
    setActivityLogs(prev => [freshLog, ...prev]);
  };

  // Handler to simulate new inbound checkout transactions
  const handleSimulateOrder = () => {
    const newOrder = generateMockOrder(products, customers, orders.length);
    setOrders(prev => [newOrder, ...prev]);
    
    // Deplete inventory of ordered items
    setProducts(prevProducts => prevProducts.map(p => {
      const orderItem = newOrder.items.find(item => item.productId === p.id);
      if (orderItem) {
        const newInv = Math.max(0, p.inventory - orderItem.quantity);
        return { ...p, inventory: newInv };
      }
      return p;
    }));

    handleLogActivity(
      `Inbound checkout simulated: ${newOrder.id} placed by ${newOrder.customer.name} (Amount: ₹${newOrder.amount})`,
      'Order',
      newOrder.id
    );
  };

  // Switch dynamic viewport display area
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            products={products}
            orders={orders}
            ndrCases={ndrCases}
            customers={customers}
            onNavigate={(id) => setActiveTab(id)}
            currency={currency}
            storeName={storeName}
            onSimulateOrder={handleSimulateOrder}
          />
        );
      case 'products':
        return (
          <ProductsTab
            products={products}
            setProducts={setProducts}
            labCertificates={labCertificates}
            userRole={userRole}
            onLogActivity={handleLogActivity}
            currency={currency}
          />
        );
      case 'categories':
        return (
          <CategoriesTab
            categories={categories}
            setCategories={setCategories}
            userRole={userRole}
            onLogActivity={handleLogActivity}
          />
        );
      case 'orders':
        return (
          <OrdersTab
            orders={orders}
            setOrders={setOrders}
            userRole={userRole}
            onLogActivity={handleLogActivity}
            currency={currency}
            storeName={storeName}
          />
        );
      case 'shipping':
        return (
          <ShippingTab
            ndrCases={ndrCases}
            setNdrCases={setNdrCases}
            userRole={userRole}
            onLogActivity={handleLogActivity}
          />
        );
      case 'customers':
        return (
          <CustomersTab
            customers={customers}
            setCustomers={setCustomers}
            userRole={userRole}
            onLogActivity={handleLogActivity}
          />
        );
      case 'coupons':
        return (
          <CouponsTab
            coupons={coupons}
            setCoupons={setCoupons}
            userRole={userRole}
            onLogActivity={handleLogActivity}
          />
        );
      case 'cms':
        return (
          <CMSTab
            cmsPages={cmsPages}
            setCmsPages={setCmsPages}
            userRole={userRole}
            onLogActivity={handleLogActivity}
          />
        );
      case 'hampers':
        return (
          <HampersTab
            hampers={giftHampers}
            setHampers={setHampers}
            products={products}
            userRole={userRole}
            onLogActivity={handleLogActivity}
            currency={currency}
          />
        );
      case 'certificates':
        return (
          <CertificatesTab
            labCertificates={labCertificates}
            setLabCertificates={setLabCertificates}
            products={products}
            setProducts={setProducts}
            userRole={userRole}
            onLogActivity={handleLogActivity}
          />
        );
      case 'suppliers':
        return (
          <SuppliersTab
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            userRole={userRole}
            onLogActivity={handleLogActivity}
          />
        );
      case 'analytics':
        return (
          <AnalyticsTab
            products={products}
            orders={orders}
            customers={customers}
            suppliers={suppliers}
            currency={currency}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            userRole={userRole}
            setUserRole={setUserRole as any}
            onLogActivity={handleLogActivity}
            currency={currency}
            setCurrency={setCurrency}
            storeName={storeName}
            setStoreName={setStoreName}
          />
        );
      case 'blueprints':
        return <DeveloperFilesViewer />;
      default:
        return <div className="text-stone-500 font-semibold p-10 text-center">Unimplemented layout view.</div>;
    }
  };

  return (
    <div className={`min-h-screen font-sans flex antialiased bg-[#f6f6f7] text-[#202223] transition-colors duration-200 ${darkMode ? 'bg-stone-900 text-stone-100 dark' : ''}`}>
      
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
        lowStockCount={products.filter(p => p.inventory < p.lowStockThreshold).length}
        openNdrCount={ndrCases.filter(n => n.status === 'Open').length}
        isOpenMobile={isMobileOpen}
        setIsOpenMobile={setIsMobileOpen}
      />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header toolbar */}
        <Header
          setIsOpenMobile={setIsMobileOpen}
          onSearchClick={() => setIsCommandPaletteOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          userRole={userRole}
          setUserRole={setUserRole}
          activityLogs={activityLogs}
        />

        {/* Dynamic viewport panel mapping */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16 overflow-y-auto">
          {renderActiveTabContent()}
        </main>
      </div>

      {/* Global Command palette search (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        products={products}
        orders={orders}
        cmsPages={cmsPages}
        onNavigate={(tabId) => {
          setActiveTab(tabId);
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* Keyboard shortcuts modal directory */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Floating Tactical Hotkey Assistant Trigger */}
      <button
        onClick={() => setIsShortcutsOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-850 border border-stone-250 dark:border-stone-800 text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all hover:scale-102 active:scale-98 select-none cursor-pointer"
        title="Keyboard Shortcuts Help (?)"
      >
        <Keyboard className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        <span className="flex items-center gap-1">
          <span className="text-stone-600 dark:text-stone-300">Hotkeys</span>
          <kbd className="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 border-b border-stone-300 dark:border-stone-750 rounded text-[9px] font-mono text-stone-550 dark:text-stone-400">?</kbd>
        </span>
      </button>

    </div>
  );
}
