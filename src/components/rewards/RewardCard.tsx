import React from 'react';
import { Gift, Package, Check, AlertCircle } from 'lucide-react';
import { Reward } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface RewardCardProps {
  reward: Reward;
  userBalance: number;
  onRedeemClick: (reward: Reward) => void;
  isStudent: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  userBalance,
  onRedeemClick,
  isStudent,
}) => {
  const isOutOfStock = reward.available_stock <= 0;
  const hasEnoughCredits = userBalance >= reward.credit_cost;
  const canRedeem = isStudent && !isOutOfStock && hasEnoughCredits;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Reward Image with Category Badge */}
        <div className="relative h-44 overflow-hidden bg-slate-100">
          <img
            src={reward.image_url}
            alt={reward.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
              {reward.category}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <Badge variant="rose" size="sm">
                Out of Stock
              </Badge>
            ) : reward.available_stock < 10 ? (
              <Badge variant="amber" size="sm">
                Only {reward.available_stock} left!
              </Badge>
            ) : (
              <Badge variant="emerald" size="sm">
                {reward.available_stock} in stock
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {reward.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {reward.description}
          </p>

          <div className="mt-3 py-1 px-2 rounded-md bg-slate-50 border border-slate-100 text-[10px] text-slate-400 italic">
            Example campus partner reward item
          </div>
        </div>
      </div>

      {/* Footer & Action */}
      <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Cost
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-emerald-700">
              {reward.credit_cost}
            </span>
            <span className="text-xs font-semibold text-emerald-950">
              Credits
            </span>
          </div>
        </div>

        <div>
          {isStudent ? (
            <Button
              size="sm"
              variant={canRedeem ? 'primary' : 'outline'}
              disabled={!canRedeem}
              onClick={() => onRedeemClick(reward)}
              icon={<Gift className="w-4 h-4" />}
            >
              {isOutOfStock
                ? 'Out of Stock'
                : !hasEnoughCredits
                ? `Need ${reward.credit_cost - userBalance} more`
                : 'Redeem Voucher'}
            </Button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              Student login required
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
