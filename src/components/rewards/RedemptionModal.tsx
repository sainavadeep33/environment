import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Gift,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  Building,
  ArrowRight,
} from 'lucide-react';
import { Reward } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface RedemptionModalProps {
  reward: Reward | null;
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
}

export const RedemptionModal: React.FC<RedemptionModalProps> = ({
  reward,
  isOpen,
  onClose,
  userBalance,
}) => {
  const { redeemReward } = useApp();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!reward) return null;

  const handleRedeem = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await redeemReward(reward.id);
      if (res.success && res.redemptionCode) {
        setRedeemedCode(res.redemptionCode);
        // Fire confetti celebration!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
        });
      } else {
        setErrorMsg(res.error || 'Failed to redeem reward.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!redeemedCode) return;
    navigator.clipboard.writeText(redeemedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleClose = () => {
    setRedeemedCode(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={redeemedCode ? 'Reward Voucher Issued!' : 'Confirm Reward Redemption'}
      description={
        redeemedCode
          ? 'Present this claim code at campus collection points.'
          : 'Green Credits will be deducted from your ledger.'
      }
      maxWidth="md"
    >
      {redeemedCode ? (
        /* Success Voucher View */
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-in zoom-in-75">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="font-extrabold text-base text-slate-900">
              Congratulations!
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              You redeemed <strong>{reward.title}</strong> for{' '}
              <strong>{reward.credit_cost} Green Credits</strong>.
            </p>
          </div>

          {/* Voucher Box */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300 text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Your Unique Redemption Code
            </span>
            <div className="text-2xl font-mono font-black text-emerald-950 tracking-widest py-1 bg-white rounded-xl border border-emerald-200">
              {redeemedCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied to Clipboard!' : 'Copy Claim Code'}
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-700" />
              How to collect on campus:
            </div>
            <p>
              1. Visit the Campus Sustainability Hub or Student Center Desk.
            </p>
            <p>
              2. Show your student ID and this claim voucher code.
            </p>
            <p>
              3. You can also view this code anytime under <em>Rewards → My Vouchers</em>.
            </p>
          </div>

          <Button variant="primary" size="md" className="w-full" onClick={handleClose}>
            Done & Return to Catalog
          </Button>
        </div>
      ) : (
        /* Confirmation & Balance Check View */
        <div className="space-y-4 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src={reward.image_url}
              alt={reward.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <div>
              <h4 className="font-bold text-sm text-slate-900">{reward.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Category: {reward.category}
              </p>
              <div className="font-extrabold text-emerald-700 text-sm mt-1">
                Cost: {reward.credit_cost} Green Credits
              </div>
            </div>
          </div>

          {/* Ledger Calculation Breakdown */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Current Ledger Balance:</span>
              <span className="font-bold text-slate-900">{userBalance} Credits</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Redemption Cost:</span>
              <span className="font-bold">-{reward.credit_cost} Credits</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-emerald-950">
              <span>Balance After Claim:</span>
              <span>{userBalance - reward.credit_cost} Credits</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic">
            * Redemptions are verified atomically by server-side stored procedure to prevent duplicate deductions or overdrafts.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="ghost" size="md" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={loading}
              onClick={handleRedeem}
              icon={<Gift className="w-4 h-4" />}
            >
              Confirm & Redeem Voucher
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
