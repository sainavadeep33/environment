import React, { useState } from 'react';
import { Gift, Ticket, Search, Filter, QrCode, CheckCircle2, Clock } from 'lucide-react';
import { Reward, Redemption } from '../types';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { RewardCard } from '../components/rewards/RewardCard';
import { RedemptionModal } from '../components/rewards/RedemptionModal';
import { Badge } from '../components/common/Badge';

export const RewardsPage: React.FC = () => {
  const { currentUser, isStudent } = useAuth();
  const { rewards, redemptions, userBalance } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'vouchers'>('catalog');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const userRedemptions = redemptions.filter((r) => r.user_id === currentUser?.id);

  const categories = ['All', 'Merchandise', 'Dining', 'Transit', 'Recognition', 'Academic'];

  const filteredRewards = rewards.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-emerald-600" />
            Campus Sustainability Rewards Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Redeem your verified Green Credits for campus dining, textbooks, bike rentals, and eco-merchandise.
          </p>
        </div>

        {/* View Switcher: Catalog vs My Vouchers */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift className="w-4 h-4 text-emerald-700" />
            Rewards Catalog
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vouchers'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-4 h-4 text-emerald-700" />
            My Claim Vouchers ({userRedemptions.length})
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="space-y-6">
          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rewards..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Example Demo Data Notice */}
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs text-emerald-950">
            <strong>Campus Merchant Notice:</strong> Rewards shown below are representative examples of campus partner offers until your campus integrates local vendor contracts. Redemptions strictly deduct credits via atomic database transactions.
          </div>

          {/* Rewards Grid */}
          {filteredRewards.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
              <Gift className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-700 text-sm">No rewards match your criteria</h4>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting "All" categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userBalance={userBalance}
                  onRedeemClick={(r) => setSelectedReward(r)}
                  isStudent={isStudent}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* My Claim Vouchers View */
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            Show these voucher claim codes to campus staff at designated collection points to receive your reward item.
          </div>

          {userRedemptions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-700 text-sm">No vouchers claimed yet</h4>
              <p className="text-xs text-slate-400 mt-1">
                Browse the catalog and exchange your Green Credits to generate your first claim voucher.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRedemptions.map((red) => (
                <div
                  key={red.id}
                  className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Voucher Issued
                      </span>
                      <h4 className="font-bold text-base text-slate-900 mt-0.5">
                        {red.reward_title || 'Campus Reward Item'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Claimed on {new Date(red.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                      {red.status}
                    </Badge>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                    <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">
                      Redemption Claim Code
                    </span>
                    <div className="text-xl font-mono font-black text-emerald-950 tracking-widest">
                      {red.redemption_code}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Cost: <strong>{red.credits_spent} Green Credits</strong></span>
                    <span className="text-emerald-700 font-medium">Valid for collection</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Redemption Confirmation Modal */}
      {selectedReward && (
        <RedemptionModal
          reward={selectedReward}
          isOpen={Boolean(selectedReward)}
          onClose={() => setSelectedReward(null)}
          userBalance={userBalance}
        />
      )}
    </div>
  );
};
