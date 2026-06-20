/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, Key, Database, RefreshCw, Smartphone, Webhook, Save, Server, Globe } from 'lucide-react';

interface SettingsTabProps {
  userRole: string;
  setUserRole: (role: string) => void;
  onLogActivity: (action: string, category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon', target: string) => void;
}

export default function SettingsTab({
  userRole,
  setUserRole,
  onLogActivity
}: SettingsTabProps) {
  const [storeName, setStoreName] = useState('Baskly Premium');
  const [currency, setCurrency] = useState('INR');
  const [webhookUrl, setWebhookUrl] = useState('https://api.baskly.com/v1/shiprocket-relay');
  const [isSaving, setIsSaving] = useState(false);

  const isReadOnly = userRole === 'Customer Support' || userRole === 'Inventory Manager';

  const handleSaveConfigs = () => {
    if (isReadOnly) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onLogActivity(`Updated central global enterprise configurations`, 'Settings', 'Global_Settings');
      alert("Applet parameter preferences updated successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">System Settings & API Keys</h2>
          <p className="text-xs text-stone-500 mt-1">Audit active security credentials, switch operational roles, and establish webhook endpoints.</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={handleSaveConfigs}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#008060] hover:bg-[#006e52] rounded-lg transition-colors shadow-2xs"
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Processing save...' : 'Save Settings'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold">
        
        {/* Left Column: General & Webhooks */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Metadata */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-3xs">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1">
              <Server className="h-4 w-4 text-stone-400" /> Platform General configuration
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-stone-705">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Enterprise Store Title</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-white border rounded-lg focus:outline-none"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Settlement Currency Symbol</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-white border rounded-lg focus:outline-none"
                  disabled={isReadOnly}
                >
                  <option value="USD">United States Dollar ($ USD)</option>
                  <option value="INR">Indian Rupee (₹ INR)</option>
                  <option value="EUR">Euro (€ EUR)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Webhooks configuration */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-3xs">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1">
              <Webhook className="h-4 w-4 text-stone-400" /> Automated Webhook Relay Hooks (Shiprocket)
            </p>

            <div className="space-y-3 text-xs text-stone-705 font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Shiprocket Webhook Receiver URL</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-white border rounded-lg focus:outline-none font-mono"
                  disabled={isReadOnly}
                />
              </div>
              <p className="text-[10px] text-stone-400 font-medium">
                Our custom router listens to this link to receive immediate update webhooks when parcels enter transit milestone checkpoints on blue dart or Delhivery.
              </p>
            </div>
          </div>

          {/* Security details (Simulated API Secrets Vault) */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-3xs bg-stone-50/20">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1.5">
              <Key className="h-4 w-4 text-stone-400" /> Private Secrets Vault (Simulated API integrations)
            </p>

            <div className="space-y-3.5 pt-1">
              <div className="bg-white border p-3 rounded-lg flex justify-between items-center text-xs shadow-3xs">
                <div>
                  <span className="font-bold text-stone-800">Shiprocket API Auth Token</span>
                  <p className="text-[10px] text-stone-400 font-medium mt-0.5">Authorizes secure dispatch orders with Delhivery cargo lists.</p>
                </div>
                <span className="font-mono text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded font-bold">
                  ••••••••••••••••3A8F
                </span>
              </div>

              <div className="bg-white border p-3 rounded-lg flex justify-between items-center text-xs shadow-3xs">
                <div>
                  <span className="font-bold text-stone-800">Cloudflare R2 Bucket Access</span>
                  <p className="text-[10px] text-stone-400 font-medium mt-0.5">Permits direct image storage uploads for saffron jar media.</p>
                </div>
                <span className="font-mono text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded font-bold">
                  ••••••••••••••••B911
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: RBAC selector list */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-5 shadow-3xs bg-[#f4f7f6]/40">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1">
              <Shield className="h-4 w-4 text-stone-400" /> System RBAC Roles Management
            </p>

            <div className="space-y-2 text-xs">
              <p className="font-medium text-stone-500 leading-normal text-[11px] mb-3">
                Switching roles here modifies action locks and restricts dashboard editing boundaries across tabs simulated dynamically!
              </p>

              {(['Administrator', 'Inventory Manager', 'Customer Support'] as const).map((role) => (
                <div
                  key={role}
                  onClick={() => {
                    setUserRole(role);
                    onLogActivity(`Switched security profile to role "${role}"`, 'Settings', 'RBAC_Role');
                  }}
                  className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                    userRole === role
                      ? 'bg-white border-[#008060] shadow-2xs text-[#008060]'
                      : 'bg-white border-stone-200 hover:border-stone-400 text-stone-700'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block leading-none">{role}</span>
                    <span className="text-[9px] text-stone-400 mt-1 block">
                      {role === 'Administrator' ? 'Unrestricted root security keys privileges.' : role === 'Inventory Manager' ? 'Locks customer accounts, allows stock adjustments.' : 'Locks stock configurations, read customer CRM.'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
