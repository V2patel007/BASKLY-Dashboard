/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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

// Nav elements layouts
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import CommandPalette from './components/CommandPalette.tsx';
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
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

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

  // Command palette hotkey handler (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
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
      role: 'Administrator',
      timestamp: new Date().toISOString(),
      target,
      category
    };
    setActivityLogs(prev => [freshLog, ...prev]);
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
          />
        );
      case 'products':
        return (
          <ProductsTab
            products={products}
            setProducts={setProducts}
            labCertificates={labCertificates}
            onLogActivity={handleLogActivity}
          />
        );
      case 'categories':
        return (
          <CategoriesTab
            categories={categories}
            setCategories={setCategories}
            onLogActivity={handleLogActivity}
          />
        );
      case 'orders':
        return (
          <OrdersTab
            orders={orders}
            setOrders={setOrders}
            onLogActivity={handleLogActivity}
          />
        );
      case 'shipping':
        return (
          <ShippingTab
            ndrCases={ndrCases}
            setNdrCases={setNdrCases}
            onLogActivity={handleLogActivity}
          />
        );
      case 'customers':
        return (
          <CustomersTab
            customers={customers}
            setCustomers={setCustomers}
            onLogActivity={handleLogActivity}
          />
        );
      case 'coupons':
        return (
          <CouponsTab
            coupons={coupons}
            setCoupons={setCoupons}
            onLogActivity={handleLogActivity}
          />
        );
      case 'cms':
        return (
          <CMSTab
            cmsPages={cmsPages}
            setCmsPages={setCmsPages}
            onLogActivity={handleLogActivity}
          />
        );
      case 'hampers':
        return (
          <HampersTab
            hampers={giftHampers}
            setHampers={setHampers}
            products={products}
            onLogActivity={handleLogActivity}
          />
        );
      case 'certificates':
        return (
          <CertificatesTab
            labCertificates={labCertificates}
            setLabCertificates={setLabCertificates}
            products={products}
            setProducts={setProducts}
            onLogActivity={handleLogActivity}
          />
        );
      case 'suppliers':
        return (
          <SuppliersTab
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            onLogActivity={handleLogActivity}
          />
        );
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return (
          <SettingsTab
            onLogActivity={handleLogActivity}
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

    </div>
  );
}
