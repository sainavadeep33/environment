import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, Settings2, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, supabaseUrl, supabaseAnonKey, setRuntimeSupabaseConfig, clearRuntimeSupabaseConfig } from '../../lib/supabase';
import { Modal } from './Modal';
import { Button } from './Button';

export const SupabaseSetupBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [inputUrl, setInputUrl] = useState(supabaseUrl);
  const [inputKey, setInputKey] = useState(supabaseAnonKey);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleCopySqlInstructions = () => {
    navigator.clipboard.writeText(
      `-- GreenCred Supabase Migration\n-- Open supabase/migrations/20261018000000_init_greencred.sql and paste into your Supabase SQL Editor!`
    );
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || !inputKey) {
      setSaveStatus('Please enter both Supabase URL and Anon Key.');
      return;
    }
    if (!inputUrl.startsWith('https://')) {
      setSaveStatus('Supabase URL must start with https://');
      return;
    }
    setSaveStatus('Saving and connecting...');
    setRuntimeSupabaseConfig(inputUrl, inputKey);
  };

  const handleResetToDemo = () => {
    clearRuntimeSupabaseConfig();
  };

  return (
    <>
      {/* Top Banner Notice */}
      <div className={`text-xs py-2 px-4 transition-colors ${
        isSupabaseConfigured
          ? 'bg-emerald-950 text-emerald-200 border-b border-emerald-900'
          : 'bg-emerald-900/90 text-white border-b border-emerald-800'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'
              }`}></span>
            </span>
            <span>
              {isSupabaseConfigured ? (
                <>
                  <strong className="font-semibold text-emerald-300">Live Backend Active:</strong> Connected to Supabase PostgreSQL cloud instance.
                </>
              ) : (
                <>
                  <strong className="font-semibold text-amber-300">Interactive Demo & Evaluation Mode:</strong> Full ledger & activity logic enabled locally. Connect your live Supabase database anytime.
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1.5 font-medium underline text-emerald-300 hover:text-white transition-colors cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {isSupabaseConfigured ? 'Backend Status & SQL' : 'Connect Supabase Cloud'}
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Connection Setup Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Supabase Backend Integration Guide"
        description="Connect your PostgreSQL database with full Row-Level Security and ledger functions."
        maxWidth="xl"
      >
        <div className="space-y-5 text-sm text-slate-700">
          {/* Status Indicator */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isSupabaseConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isSupabaseConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-semibold text-sm">
                {isSupabaseConfigured
                  ? 'Connected to Supabase PostgreSQL'
                  : 'Currently running in Local Demo Mode'}
              </h4>
              <p className="text-xs mt-1 text-slate-600">
                {isSupabaseConfigured
                  ? `URL: ${supabaseUrl}`
                  : 'All features (activity submissions, approvals, ledger credits, and rewards) work smoothly in-memory and in localStorage. Follow the 3 steps below to hook up your own Supabase project.'}
              </p>
            </div>
          </div>

          {/* Quick 3-Step Setup Guide */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              How to configure Supabase in 3 minutes:
            </h5>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
              <li>
                Create a free project at{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-medium underline inline-flex items-center gap-0.5"
                >
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>.
              </li>
              <li>
                Open the <strong>SQL Editor</strong> in your Supabase dashboard and run the migration script located at:
                <code className="block bg-slate-200 text-slate-800 px-2 py-1 rounded-sm font-mono mt-1 text-[11px]">
                  supabase/migrations/20261018000000_init_greencred.sql
                </code>
              </li>
              <li>
                In your Supabase Dashboard, go to <strong>Project Settings → API</strong>, copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong>, and paste them below or into your <code className="font-mono text-emerald-700">.env</code> file.
              </li>
            </ol>
          </div>

          {/* Runtime Credentials Form */}
          <form onSubmit={handleSaveCredentials} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Anon (Public) Key
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white font-mono"
              />
            </div>

            {saveStatus && (
              <p className="text-xs font-medium text-amber-700">{saveStatus}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Button type="submit" size="sm" variant="primary">
                  Save & Connect
                </Button>
                {isSupabaseConfigured && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleResetToDemo}
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Reset to Local Mode
                  </Button>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopySqlInstructions}
                className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copied migration path!' : 'Copy SQL Path'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
