import React, { useState } from 'react';
import { User, School, Mail, Shield, CheckCircle2, AlertCircle, Save, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { currentUser, isAdmin, isStudent, updateProfile, resetPassword } = useAuth();
  const { userBalance, userApprovedActivitiesCount, userTotalCO2SavedKg, userTreesEquivalent } = useApp();

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [collegeName, setCollegeName] = useState(currentUser?.college_name || '');
  const [publicAlias, setPublicAlias] = useState(currentUser?.public_alias || '');
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(currentUser?.show_on_leaderboard ?? true);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const res = await updateProfile({
      full_name: fullName.trim(),
      college_name: collegeName.trim(),
      public_alias: publicAlias.trim(),
      show_on_leaderboard: showOnLeaderboard,
    });

    if (res.success) {
      setStatusMsg('Profile updated successfully!');
      setTimeout(() => setStatusMsg(null), 2000);
    } else {
      setStatusMsg(res.error || 'Failed to update profile.');
    }
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setResetStatus('Sending reset link...');
    const res = await resetPassword(currentUser.email);
    setResetStatus(res.message || res.error || 'Request sent.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={
            currentUser?.avatar_url ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
              currentUser?.full_name || 'User'
            )}`
          }
          alt={currentUser?.full_name}
          className="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-100 shadow-md shrink-0"
        />

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {currentUser?.full_name}
            </h1>
            <Badge variant={isAdmin ? 'forest' : 'emerald'} size="md">
              {isAdmin ? 'Campus Administrator' : 'Student Eco-Steward'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {currentUser?.email} • {currentUser?.college_name}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-700">
            <span>Public Eco-Alias: <strong className="text-emerald-700 font-mono">{currentUser?.public_alias || 'None'}</strong></span>
            {isStudent && (
              <span>Balance: <strong className="text-emerald-800">{userBalance} Green Credits</strong></span>
            )}
          </div>
        </div>
      </div>

      {/* Student Impact Stats */}
      {isStudent && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Ledger Balance</span>
            <span className="text-2xl font-black text-emerald-700">{userBalance} GC</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Approved Actions</span>
            <span className="text-2xl font-black text-slate-900">{userApprovedActivitiesCount}</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">CO₂ Avoided</span>
            <span className="text-2xl font-black text-emerald-600">{userTotalCO2SavedKg.toFixed(1)} kg</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tree Equivalent</span>
            <span className="text-2xl font-black text-slate-900">{userTreesEquivalent}</span>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Personal Information & Privacy</h2>
          <p className="text-xs text-slate-500">
            Manage your campus credentials and public leaderboard display preferences.
          </p>
        </div>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                College / University
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Public Eco-Alias (Displayed on Leaderboard)
              </label>
              <input
                type="text"
                required
                value={publicAlias}
                onChange={(e) => setPublicAlias(e.target.value)}
                placeholder="e.g. EcoWarrior_99"
                className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Shields your private name on public campus leaderboards.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Campus Email (Read-Only)
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={showOnLeaderboard}
                onChange={(e) => setShowOnLeaderboard(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              Show my ranking on the public Campus Leaderboard
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePasswordReset}
              icon={<KeyRound className="w-3.5 h-3.5" />}
            >
              Request Password Reset Email
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>

          {resetStatus && (
            <p className="text-xs text-emerald-700 font-medium text-right mt-1">
              {resetStatus}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
