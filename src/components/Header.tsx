/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Activity,
  User,
  ShieldCheck,
  ChevronDown,
  Globe,
  HelpCircle,
  Clock
} from 'lucide-react';
import { ActivityLog } from '../types.ts';

interface HeaderProps {
  setIsOpenMobile: (open: boolean) => void;
  onSearchClick: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activityLogs: ActivityLog[];
}

export default function Header({
  setIsOpenMobile,
  onSearchClick,
  darkMode,
  setDarkMode,
  activityLogs
}: HeaderProps) {
  const [showNotificationCount, setShowNotificationCount] = useState(true);
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);

  // Filter logs for this visual view
  const displayLogs = activityLogs.slice(0, 8);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Admin': return 'bg-[#ebebeb] text-[#303030] border-[#d2d2d2]';
      case 'Manager': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Inventory Manager': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Customer Support': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#d2d2d2] select-none h-14">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-full">
        
        {/* Toggle Button for mobile & Search Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpenMobile(true)}
            className="p-1.5 -ml-1.5 rounded-md text-stone-500 hover:bg-[#f7f7f7] lg:hidden transition-colors border border-transparent"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Trigger Mock Input */}
          <div className="relative w-48 sm:w-96">
            <button
              onClick={onSearchClick}
              className="w-full flex items-center gap-2.5 text-xs text-stone-500 bg-[#f1f1f1] border border-[#d2d2d2] rounded-md px-3 py-1.5 hover:bg-[#eaeaea] transition-all text-left focus:outline-none"
            >
              <Search className="h-3.5 w-3.5 text-stone-400 shrink-0" />
              <span className="truncate">Search catalogs, pages, or orders</span>
              <kbd className="hidden sm:inline-block ml-auto text-[9px] px-1.5 bg-white text-stone-500 rounded border border-[#d2d2d2] font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Global Control Elements */}
        <div className="flex items-center gap-3">
          
          {/* Quick External Links */}
          <a
            href="https://baskly.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#005c46] hover:bg-[#f1fcf9] border border-[#d2d2d2] bg-white px-3 py-1.5 rounded-md transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-[#005c46]" />
            <span>Live Storeframe</span>
          </a>

          {/* Activity Logs Button Toggle */}
          <button
            onClick={() => {
              setShowActivityDrawer(!showActivityDrawer);
              setShowNotificationCount(false);
            }}
            className="relative p-2 text-stone-600 hover:text-stone-900 rounded-full bg-[#ebebeb] hover:bg-gray-200 border border-[#d2d2d2] transition-all"
            title="Applet Activity Log & Audit Trail"
          >
            <Bell className="h-4 w-4" />
            {showNotificationCount && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#005c46] rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Active User Indicator */}
          <div className="flex items-center gap-2 border border-[#d2d2d2] bg-white px-3 py-1.5 rounded-md text-xs font-medium">
            <div className="w-6 h-6 bg-[#2c6ecb] rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              HP
            </div>
            <div className="hidden sm:text-left sm:block">
              <p className="text-[11px] font-bold text-stone-800 leading-tight">Hetashvi Parikh</p>
              <span className="inline-block text-[8px] font-bold uppercase px-1 border rounded-[3px] scale-95 origin-left bg-purple-100 text-purple-700 border-purple-200">
                Administrator
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Activity Logs Side-Drawer */}
      {showActivityDrawer && (
        <>
          <div className="fixed inset-0 z-45 bg-black/15" onClick={() => setShowActivityDrawer(false)} />
          <div className="fixed right-0 top-14 h-[calc(100vh-56px)] w-80 bg-white border-l border-[#d2d2d2] z-50 p-5 flex flex-col shadow-xl animate-slide-in">
            <div className="flex items-center justify-between border-b border-[#f1f1f1] pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#303030] flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#005c46]" />
                Audit Trail & Activity Log
              </h3>
              <button
                onClick={() => setShowActivityDrawer(false)}
                className="text-stone-400 hover:text-stone-600 font-bold text-xs"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {displayLogs.map((log) => (
                <div key={log.id} className="text-xs space-y-1 pb-3 border-b border-[#f1f1f1]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 text-[11px]">{log.user}</span>
                    <span className={`text-[8px] font-bold px-1 rounded-xs uppercase tracking-wide border ${getRoleColor(log.role)}`}>
                      {log.role}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">{log.action}</p>
                  <div className="flex items-center gap-1.5 text-[9px] text-stone-400 font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span>•</span>
                    <span className="bg-stone-100 px-1 rounded-sm text-stone-500 font-bold">{log.category}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#f7f7f7] p-3 rounded-md border border-[#d2d2d2] text-[10px] text-stone-500 leading-normal mt-4">
              <span className="font-bold text-stone-700 block mb-1">Audit Policy Active</span>
              All actions are encrypted and appended to high-fidelity compliance ledger files.
            </div>
          </div>
        </>
      )}
    </header>
  );
}
