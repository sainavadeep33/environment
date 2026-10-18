import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Coins,
  Gift,
  Users,
  Sliders,
  Trophy,
  Mail,
  BarChart2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AdminApprovals } from '../components/admin/AdminApprovals';
import { AdminRules } from '../components/admin/AdminRules';
import { AdminRewards } from '../components/admin/AdminRewards';
import { AdminChallenges } from '../components/admin/AdminChallenges';
import { AdminMessages } from '../components/admin/AdminMessages';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const {
    activities,
    transactions,
    rewards,
    redemptions,
    challenges,
    contactMessages,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'approvals' | 'rules' | 'rewards' | 'challenges' | 'messages' | 'analytics'
  >('approvals');

  // Authorization check guard
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          Access Restricted: Platform Administrator Required
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          You are currently logged in as a student or unauthenticated guest. Administrative controls, verification queues, and credit rules require verified administrator rights.
        </p>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 max-w-sm mx-auto">
          Tip: You can use the <strong>Role: Admin</strong> button in the top navigation bar to test the administrator console.
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const pendingActivities = activities.filter((a) => a.status === 'pending');
  const approvedActivities = activities.filter((a) => a.status === 'approved');
  const rejectedActivities = activities.filter((a) => a.status === 'rejected');

  const totalCreditsAwarded = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalCreditsRedeemed = Math.abs(
    transactions
      .filter((tx) => tx.amount < 0)
      .reduce((acc, tx) => acc + tx.amount, 0)
  );

  const unreadMessagesCount = contactMessages.filter((m) => m.status === 'unread').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
              Campus Sustainability Command Center
            </h1>
            <Badge variant="forest" size="md">
              Authorized Admin
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Administrator: {currentUser?.full_name} • {currentUser?.college_name}
          </p>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Queue</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-amber-600">
              {pendingActivities.length}
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Approved Actions</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-emerald-700">
              {approvedActivities.length}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Rejected Actions</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-rose-600">
              {rejectedActivities.length}
            </span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Credits Minted</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-emerald-950">
              {totalCreditsAwarded}
            </span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Vouchers Claimed</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-slate-900">
              {redemptions.length}
            </span>
            <Gift className="w-4 h-4 text-emerald-700" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Messages</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-slate-900">
              {contactMessages.length}
            </span>
            {unreadMessagesCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                {unreadMessagesCount} new
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveAdminTab('approvals')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'approvals'
              ? 'bg-emerald-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          Verification Queue ({pendingActivities.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('rules')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'rules'
              ? 'bg-emerald-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Credit & CO₂ Rules
        </button>

        <button
          onClick={() => setActiveAdminTab('rewards')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'rewards'
              ? 'bg-emerald-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Gift className="w-4 h-4" />
          Rewards Catalog ({rewards.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('challenges')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'challenges'
              ? 'bg-emerald-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Challenges ({challenges.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('messages')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'messages'
              ? 'bg-emerald-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          Contact Inquiries ({contactMessages.length})
          {unreadMessagesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeAdminTab === 'approvals' && <AdminApprovals />}
        {activeAdminTab === 'rules' && <AdminRules />}
        {activeAdminTab === 'rewards' && <AdminRewards />}
        {activeAdminTab === 'challenges' && <AdminChallenges />}
        {activeAdminTab === 'messages' && <AdminMessages />}
      </div>
    </div>
  );
};
