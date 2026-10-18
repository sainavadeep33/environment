import React from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  TreePine,
  Wind,
  Gift,
  Trophy,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { RewardCard } from '../components/rewards/RewardCard';
import { ChallengeCard } from '../components/challenges/ChallengeCard';

interface StudentDashboardPageProps {
  onOpenSubmitModal: () => void;
  onNavigate: (tab: string) => void;
  onRedeemClick: (reward: any) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  onOpenSubmitModal,
  onNavigate,
  onRedeemClick,
}) => {
  const { currentUser, isStudent } = useAuth();
  const {
    userBalance,
    userApprovedActivitiesCount,
    userTotalCO2SavedKg,
    userTreesEquivalent,
    activities,
    transactions,
    rewards,
    challenges,
    participations,
    joinChallenge,
    leaderboard,
  } = useApp();

  // Student specific data
  const userActivities = activities.filter((a) => a.student_id === currentUser?.id);
  const userPendingCount = userActivities.filter((a) => a.status === 'pending').length;
  const recentUserActivities = userActivities.slice(0, 3);
  const recentTransactions = transactions
    .filter((tx) => tx.user_id === currentUser?.id)
    .slice(0, 4);

  // Student rank on leaderboard
  const studentRankEntry = leaderboard.find((e) => e.user_id === currentUser?.id);
  const studentRank = studentRankEntry ? `#${studentRankEntry.rank}` : '#1';

  const activeChallenges = challenges.filter((c) => c.is_active).slice(0, 2);
  const featuredRewards = rewards.filter((r) => r.is_active).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Quick Log CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {currentUser?.full_name?.split(' ')[0]}!
            </h1>
            <Badge variant="mint" size="md">
              Student Eco-Steward
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser?.college_name} • Every verified action contributes to your campus climate footprint.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={onOpenSubmitModal}
          icon={<PlusCircle className="w-4 h-4" />}
          className="shadow-md"
        >
          Log Sustainability Action
        </Button>
      </div>

      {/* Primary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Green Credits Balance (Immutable Ledger) */}
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Verified Ledger Balance
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-3xl font-black mt-2">
              {userBalance} <span className="text-sm font-semibold text-emerald-200">GC</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200">
            <span className="text-[11px]">Ready to redeem</span>
            <button
              onClick={() => onNavigate('rewards')}
              className="text-[11px] font-bold underline hover:text-white cursor-pointer"
            >
              Browse Catalog &rarr;
            </button>
          </div>
        </div>

        {/* 2. Total Approved Activities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Approved Eco-Actions
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {userApprovedActivitiesCount}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {userPendingCount > 0 ? (
                <strong className="text-amber-700">{userPendingCount} in review</strong>
              ) : (
                'All actions verified'
              )}
            </span>
            <button
              onClick={() => onNavigate('activities')}
              className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              View history &rarr;
            </button>
          </div>
        </div>

        {/* 3. CO2 Offset & Trees Equivalent */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Carbon Offset (EPA)
              </span>
              <Wind className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2">
              {userTotalCO2SavedKg.toFixed(1)} <span className="text-sm font-semibold text-slate-500">kg</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
            <TreePine className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              ≈ <strong>{userTreesEquivalent}</strong> mature tree/year absorption
            </span>
          </div>
        </div>

        {/* 4. Campus Leaderboard Standing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Campus Standing
              </span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-950 mt-2">
              {studentRank}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Ranked by verified credits</span>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              Leaderboard &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Middle Grid: Recent Submissions & Credit Ledger History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity Submissions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Recent Activity History
              </h3>
              <p className="text-xs text-slate-400">
                Track status and admin reviews for your submitted actions.
              </p>
            </div>
            <button
              onClick={() => onNavigate('activities')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              View All ({userActivities.length})
            </button>
          </div>

          {recentUserActivities.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs text-slate-600 font-medium">No actions submitted yet</p>
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenSubmitModal}
                className="mt-2"
              >
                Log Your First Action
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUserActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">
                      {act.activity_title || act.activity_type.replace('_', ' ')}
                    </span>
                    <p className="text-slate-500 line-clamp-1">{act.description}</p>
                    <span className="text-[10px] text-slate-400">{act.date}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge
                      variant={
                        act.status === 'approved'
                          ? 'emerald'
                          : act.status === 'rejected'
                          ? 'rose'
                          : 'amber'
                      }
                      size="sm"
                    >
                      {act.status}
                    </Badge>
                    <div className="mt-1 font-bold text-emerald-700 text-xs">
                      {act.status === 'approved' ? `+${act.credits_awarded} GC` : '0 GC'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Immutable Ledger Stream (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Credit Ledger Transactions
              </h3>
              <p className="text-xs text-slate-400">
                Immutable record of awards & redemptions.
              </p>
            </div>
            <Badge variant="forest" size="sm">
              Ledger
            </Badge>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl text-xs text-slate-400">
              No transactions recorded in ledger yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800 block line-clamp-1">
                      {tx.description}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(tx.created_at).toLocaleDateString()} • {tx.transaction_type}
                    </span>
                  </div>
                  <span
                    className={`font-black text-sm ${
                      tx.amount > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} GC
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Campus Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Active Campus Challenges
            </h3>
            <p className="text-xs text-slate-500">
              Complete group goals to earn bonus Green Credits.
            </p>
          </div>
          <button
            onClick={() => onNavigate('challenges')}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            All Challenges &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeChallenges.map((chal) => {
            const part = participations.find(
              (p) => p.challenge_id === chal.id && p.user_id === currentUser?.id
            );
            return (
              <ChallengeCard
                key={chal.id}
                challenge={chal}
                participation={part}
                onJoin={joinChallenge}
                isStudent={isStudent}
              />
            );
          })}
        </div>
      </div>

      {/* Featured Rewards Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Featured Rewards
            </h3>
            <p className="text-xs text-slate-500">
              Redeem your verified Green Credits for real campus items.
            </p>
          </div>
          <button
            onClick={() => onNavigate('rewards')}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            Explore Catalog &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userBalance={userBalance}
              onRedeemClick={onRedeemClick}
              isStudent={isStudent}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
