/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Keyboard, Search, LayoutDashboard, Compass, Layers, Gift, FileSpreadsheet, Settings, Truck, HelpCircle } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: "Global Commands",
      shortcuts: [
        { keys: ["⌘", "K"], orKeys: ["Ctrl", "K"], description: "Open search & command palette", icon: Search },
        { keys: ["?"], orKeys: ["Shift", "?"], description: "Show/hide keyboard shortcuts help", icon: HelpCircle },
        { keys: ["Esc"], description: "Dismiss open modals or active menus", icon: X }
      ]
    },
    {
      title: "Workspace Sections (Navigation Hotkeys)",
      shortcuts: [
        { keys: ["Alt", "1"], description: "Navigate to Dashboard overview", icon: LayoutDashboard },
        { keys: ["Alt", "2"], description: "Go to Products list", icon: Compass },
        { keys: ["Alt", "3"], description: "Go to Categories dashboard", icon: Layers },
        { keys: ["Alt", "4"], description: "Go to Gift Hampers customization", icon: Gift },
        { keys: ["Alt", "5"], description: "Go to Invoices & Orders registry", icon: FileSpreadsheet },
        { keys: ["Alt", "6"], description: "Go to Shipping & courier logistics (NDR)", icon: Truck },
        { keys: ["Alt", "S"], description: "Go to System configurations & settings", icon: Settings }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop with subtle blur */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Tactile modern glassmorphism modal frame */}
      <div 
        className="relative bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-fade-in text-stone-900 dark:text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Keyboard className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-stone-900 dark:text-stone-50">Keyboard Navigation Shortcuts</h3>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Baskly console efficiency hotkeys for rapid operations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Shortcuts Directory */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-6">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-stone-400 dark:text-stone-500 uppercase tracking-widest border-b border-stone-100 dark:border-stone-805 pb-1 select-none">
                {group.title}
              </h4>
              
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut, sIdx) => {
                  const Icon = shortcut.icon;
                  return (
                    <div 
                      key={sIdx} 
                      className="flex items-center justify-between py-2 px-3 hover:bg-stone-50 dark:hover:bg-stone-800/40 rounded-lg transition-colors group select-none"
                    >
                      {/* Left: icon and description */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        {Icon && (
                          <Icon className="h-4 w-4 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0 transition-colors" />
                        )}
                        <span className="text-xs font-semibold text-stone-650 dark:text-stone-300 truncate">
                          {shortcut.description}
                        </span>
                      </div>

                      {/* Right: keyboard key representation blocks */}
                      <div className="flex items-center gap-1 shrink-0 ml-4 font-sans">
                        {shortcut.keys.map((key, kIdx) => (
                          <kbd 
                            key={kIdx} 
                            className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold font-mono text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 border-b-2 border-stone-300 dark:border-stone-700 rounded shadow-xs"
                          >
                            {key}
                          </kbd>
                        ))}
                        
                        {shortcut.orKeys && (
                          <>
                            <span className="text-[10px] text-stone-400 font-medium px-0.5">or</span>
                            {shortcut.orKeys.map((key, kIdx) => (
                              <kbd 
                                key={kIdx} 
                                className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold font-mono text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 border-b-2 border-stone-300 dark:border-stone-700 rounded shadow-xs"
                              >
                                {key}
                              </kbd>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info/hint */}
        <div className="px-5 py-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-center">
          <p className="text-[9px] text-stone-400 dark:text-stone-500 font-mono">
            Press <kbd className="px-1 py-0.5 bg-stone-200 dark:bg-stone-800 rounded font-semibold text-stone-600 dark:text-stone-300">Esc</kbd> anywhere to dismiss panels. Pro tip: click anywhere outside to close.
          </p>
        </div>
      </div>
    </div>
  );
}
