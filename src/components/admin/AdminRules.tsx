import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { ActivityCreditRule } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const AdminRules: React.FC = () => {
  const { rules, updateCreditRule } = useApp();
  const [editingRule, setEditingRule] = useState<ActivityCreditRule | null>(null);
  const [credits, setCredits] = useState<number>(20);
  const [co2, setCo2] = useState<number>(2.0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleStartEdit = (rule: ActivityCreditRule) => {
    setEditingRule(rule);
    setCredits(rule.default_credits);
    setCo2(rule.co2_savings_kg);
    setDescription(rule.description);
    setStatusMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    setLoading(true);
    setStatusMsg(null);

    const res = await updateCreditRule(editingRule.id, {
      default_credits: credits,
      co2_savings_kg: co2,
      description,
    });

    if (res.success) {
      setStatusMsg('Credit rule updated successfully!');
      setTimeout(() => {
        setEditingRule(null);
        setStatusMsg(null);
      }, 1500);
    } else {
      setStatusMsg(res.error || 'Failed to update rule.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Activity Credit & Impact Rules
            </h3>
            <p className="text-xs text-slate-500">
              Configure baseline Green Credits awarded and CO₂ offset rates per campus sustainability action.
            </p>
          </div>
          <Badge variant="mint" size="md">
            Active Platform Policies
          </Badge>
        </div>

        <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            These rules serve as default award guidelines in the verification queue. Administrators can fine-tune credits awarded for exceptional student actions.
          </span>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => {
          const isSelected = editingRule?.id === rule.id;
          return (
            <div
              key={rule.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{rule.title}</h4>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    ID: {rule.activity_type}
                  </span>
                </div>
                <Badge variant={rule.is_active ? 'emerald' : 'slate'} size="sm">
                  {rule.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {rule.description}
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Default Award
                  </span>
                  <span className="text-base font-extrabold text-emerald-700">
                    {rule.default_credits} Green Credits
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    CO₂ Saved / Unit
                  </span>
                  <span className="text-base font-extrabold text-slate-800">
                    {rule.co2_savings_kg} kg CO₂
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant={isSelected ? 'secondary' : 'outline'}
                  onClick={() => handleStartEdit(rule)}
                  icon={<Sliders className="w-3.5 h-3.5" />}
                >
                  {isSelected ? 'Editing Rule' : 'Configure Values'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline Editor Drawer */}
      {editingRule && (
        <form
          onSubmit={handleSave}
          className="p-5 bg-white rounded-2xl border-2 border-emerald-600 shadow-lg space-y-4 text-xs animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">
              Editing Rule: <span className="text-emerald-700">{editingRule.title}</span>
            </h4>
            <button
              type="button"
              onClick={() => setEditingRule(null)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Green Credits (1 - 500) *
              </label>
              <input
                type="number"
                min={1}
                max={500}
                required
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border rounded-xl font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estimated CO₂ Offset (kg per action) *
              </label>
              <input
                type="number"
                step="0.1"
                min={0}
                required
                value={co2}
                onChange={(e) => setCo2(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Activity Description & Guidelines
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingRule(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              icon={<Save className="w-3.5 h-3.5" />}
            >
              Save Rule Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
