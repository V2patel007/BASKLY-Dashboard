/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import BasklyLogo from "./BasklyLogo.tsx";
import {
  LayoutDashboard,
  Tag,
  ShoppingBag,
  Users,
  Megaphone,
  FileText,
  Truck,
  Award,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  PackageCheck,
  Package,
  Layers,
  HeartHandshake,
  Menu,
  X,
  Building,
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lowStockCount: number;
  openNdrCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  lowStockCount,
  openNdrCount,
  isOpenMobile,
  setIsOpenMobile,
}: SidebarProps) {
  // Collapsible states
  const [catalogExpanded, setCatalogExpanded] = useState(true);
  const [ordersExpanded, setOrdersExpanded] = useState(true);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpenMobile(false);
  };

  const navClass = (tabId: string) =>
    `flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-all ${
      currentTab === tabId
        ? "bg-[#ebebeb] text-[#303030] font-semibold"
        : "text-stone-600 hover:bg-[#f7f7f7] hover:text-stone-900"
    }`;

  const subNavClass = (tabId: string) =>
    `flex items-center justify-between w-full pl-8 pr-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
      currentTab === tabId
        ? "bg-[#ebebeb] text-[#005c46] font-semibold"
        : "text-stone-500 hover:bg-[#f7f7f7] hover:text-stone-900"
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#d2d2d2] w-60 select-none">
      {/* Brand Header */}
      <div className="flex flex-col gap-1.5 p-4 border-b border-[#f1f1f1]">
        <div className="flex items-center gap-2 py-1">
          <BasklyLogo className="h-10 w-auto" />
        </div>
        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest pl-0.5 mt-1">
          Store Console
        </p>
      </div>

      {/* Nav Link Scroller */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin">
        {/* Core Workspace */}
        <div className="space-y-1">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={navClass("dashboard")}
          >
            <span className="flex items-center gap-3">
              <LayoutDashboard className="h-4 w-4 text-stone-500" />
              Home
            </span>
          </button>
        </div>

        {/* Catalog Submenu */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Catalog
            </p>
            <button
              onClick={() => setCatalogExpanded(!catalogExpanded)}
              className="text-stone-400 hover:text-stone-600 p-0.5 rounded-sm transition-colors"
            >
              {catalogExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          </div>

          {catalogExpanded && (
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick("products")}
                className={subNavClass("products")}
              >
                <span className="flex items-center gap-2">
                  <Package className="h-3.5 w-3.5 text-stone-400" />
                  Products
                </span>
                {lowStockCount > 0 && (
                  <span className="bg-[#ffea8a] text-stone-900 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                    {lowStockCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleTabClick("categories")}
                className={subNavClass("categories")}
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-stone-400" />
                  Categories
                </span>
              </button>
              <button
                onClick={() => handleTabClick("hampers")}
                className={subNavClass("hampers")}
              >
                <span className="flex items-center gap-2">
                  <GiftHamperIcon className="h-3.5 w-3.5 text-stone-400" />
                  Gift Hampers
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Orders & Logistics */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Orders & Logistics
            </p>
            <button
              onClick={() => setOrdersExpanded(!ordersExpanded)}
              className="text-stone-400 hover:text-stone-600 p-0.5 rounded-sm transition-colors"
            >
              {ordersExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          </div>

          {ordersExpanded && (
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick("orders")}
                className={subNavClass("orders")}
              >
                <span className="flex items-center gap-2">
                  <PackageCheck className="h-3.5 w-3.5 text-stone-400" />
                  All Orders
                </span>
              </button>
              <button
                onClick={() => handleTabClick("shipping")}
                className={subNavClass("shipping")}
              >
                <span className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-stone-400" />
                  Shipping Hub
                </span>
                {openNdrCount > 0 && (
                  <span className="bg-[#ffea8a] text-stone-900 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                    {openNdrCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Customer Operations */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
            Customers
          </p>

          <button
            onClick={() => handleTabClick("customers")}
            className={navClass("customers")}
          >
            <span className="flex items-center gap-3">
              <Users className="h-4 w-4 text-stone-500" />
              Customer CRM
            </span>
          </button>
        </div>

        {/* CMS & Content */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
            Marketing & CMS
          </p>

          <button
            onClick={() => handleTabClick("coupons")}
            className={navClass("coupons")}
          >
            <span className="flex items-center gap-3">
              <Megaphone className="h-4 w-4 text-stone-500" />
              Discounts
            </span>
          </button>

          <button
            onClick={() => handleTabClick("cms")}
            className={navClass("cms")}
          >
            <span className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-stone-500" />
              CMS Pages
            </span>
          </button>
        </div>

        {/* Compliance & Partners */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
            Partners
          </p>

          <button
            onClick={() => handleTabClick("suppliers")}
            className={navClass("suppliers")}
          >
            <span className="flex items-center gap-3">
              <Building className="h-4 w-4 text-stone-500" />
              Suppliers
            </span>
          </button>

          <button
            onClick={() => handleTabClick("certificates")}
            className={navClass("certificates")}
          >
            <span className="flex items-center gap-3">
              <Award className="h-4 w-4 text-stone-500" />
              Lab Certificates
            </span>
          </button>
        </div>

        {/* Analytics & System */}
        <div className="space-y-1 pt-2 border-t border-[#f1f1f1]">
          <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
            Analysis & Config
          </p>

          <button
            onClick={() => handleTabClick("analytics")}
            className={navClass("analytics")}
          >
            <span className="flex items-center gap-3">
              <BarChart3 className="h-4 w-4 text-stone-500" />
              Analytics
            </span>
          </button>

          <button
            onClick={() => handleTabClick("settings")}
            className={navClass("settings")}
          >
            <span className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-stone-500" />
              Settings
            </span>
          </button>
        </div>
      </div>

      {/* Integration Blueprint Footer */}
      <div className="p-4 border-t border-[#f1f1f1]">
        <button
          onClick={() => handleTabClick("blueprints")}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-stone-700 bg-[#ebebeb] hover:bg-[#e2e2e2] rounded-md transition-colors border border-stone-300"
        >
          <Award className="h-3.5 w-3.5 text-[#005c46]" />
          Technical Specs
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 select-none z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-55 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />
          {/* Menu Drawer */}
          <div className="relative flex flex-col w-64 max-w-xs bg-white h-full transform transition-transform animate-slide-in shadow-xl">
            <button
              onClick={() => setIsOpenMobile(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-[#008060]"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-full flex flex-col">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
}

// Inline Custom Little Icon for gift hampers so we do not need to deal with custom svgs and conform to constraints
function GiftHamperIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v13m0-13A3.5 3.5 0 1 0 8.5 4.5c.348 0 .686.046 1.01.13M12 8a3.5 3.5 0 1 1 3.5-3.5c-.347 0-.685.046-1.01.13M12 8V4.63M3 12h18M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M3 9.5a2.5 2.5 0 0 1 2.5-2.5h13A2.5 2.5 0 0 1 21 9.5v2.5H3V9.5Z"
      />
    </svg>
  );
}
