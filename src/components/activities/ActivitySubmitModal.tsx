import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Info,
  X,
  FileImage,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { uploadEvidenceImage } from '../../lib/storage';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ActivitySubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ActivitySubmitModal: React.FC<ActivitySubmitModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { rules, submitActivity } = useApp();

  const [activityType, setActivityType] = useState('recycling');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activeRules = rules.filter((r) => r.is_active);
  const selectedRule = rules.find((r) => r.activity_type === activityType) || activeRules[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit.');
      return;
    }

    setEvidenceFile(file);
    const previewUrl = URL.createObjectURL(file);
    setEvidencePreview(previewUrl);
    setErrorMsg(null);
  };

  const handleClearImage = () => {
    setEvidenceFile(null);
    setEvidencePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      let uploadedUrl: string | undefined = undefined;

      if (evidenceFile) {
        const uploadRes = await uploadEvidenceImage(evidenceFile, currentUser.id);
        if (uploadRes.error) {
          setErrorMsg(uploadRes.error);
          setLoading(false);
          return;
        }
        uploadedUrl = uploadRes.url;
      }

      const res = await submitActivity({
        activity_type: activityType,
        description,
        date,
        evidence_url: uploadedUrl,
      });

      if (res.success) {
        setSuccessMsg(
          'Eco-action logged successfully! It is now pending review by a campus administrator.'
        );
        setTimeout(() => {
          setDescription('');
          setEvidenceFile(null);
          setEvidencePreview(null);
          setSuccessMsg(null);
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Failed to submit activity.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log an Eco-Friendly Action"
      description="Submit photo evidence or notes of your sustainability action on campus to earn verified Green Credits."
      maxWidth="lg"
    >
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Activity Category Selector */}
        <div>
          <label className="block font-semibold text-slate-800 mb-1.5">
            Select Sustainability Activity *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeRules.map((rule) => (
              <button
                key={rule.id}
                type="button"
                onClick={() => setActivityType(rule.activity_type)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  activityType === rule.activity_type
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 mb-0.5">
                    {rule.title}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {rule.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-emerald-700">
                    +{rule.default_credits} Green Credits
                  </span>
                  <span className="text-slate-500">
                    ~{rule.co2_savings_kg} kg CO₂ saved
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Details & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-800 mb-1">
              Description & Location *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Deposited 15 washed aluminum cans and glass bottles at North Dining Hall recycling station."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Date Completed *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Action must be within the current academic term.
            </p>
          </div>
        </div>

        {/* Evidence Photo Upload */}
        <div>
          <label className="block font-semibold text-slate-800 mb-1">
            Photo Evidence (Recommended for fast approval)
          </label>
          {evidencePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 group h-44 bg-slate-100 flex items-center justify-center">
              <img
                src={evidencePreview}
                alt="Uploaded evidence"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30">
              <UploadCloud className="w-8 h-8 text-emerald-600 mb-1.5" />
              <span className="font-semibold text-slate-700">
                Click to upload photo evidence
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, or WebP up to 5MB
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Transparent Rules Notice */}
        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start gap-2.5 text-[11px] text-emerald-950">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Verified Ledger Rule:</span> Credits are awarded to your balance only after review by campus sustainability administrators. Estimated reward for this activity is{' '}
            <strong className="text-emerald-800">
              {selectedRule?.default_credits || 15} Green Credits
            </strong>.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Submit for Verification
          </Button>
        </div>
      </form>
    </Modal>
  );
};
