import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  User,
  Award,
  AlertCircle,
  Sparkles,
  Search,
} from 'lucide-react';
import { Activity } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AdminApprovals: React.FC = () => {
  const { activities, rules, approveActivity, rejectActivity } = useApp();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [customCredits, setCustomCredits] = useState<number | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const pendingActivities = activities.filter((a) => a.status === 'pending');
  const reviewedActivities = activities.filter((a) => a.status !== 'pending');

  const filteredPending = pendingActivities.filter(
    (a) =>
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.student_name && a.student_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenApproveModal = (activity: Activity) => {
    setSelectedActivity(activity);
    const rule = rules.find((r) => r.activity_type === activity.activity_type);
    setCustomCredits(rule?.default_credits || 20);
    setRejectModalOpen(false);
    setStatusFeedback(null);
  };

  const handleOpenRejectModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setRejectReason('');
    setRejectModalOpen(true);
    setStatusFeedback(null);
  };

  const handleConfirmApproval = async () => {
    if (!selectedActivity) return;
    setActionLoading(true);
    setStatusFeedback(null);

    const res = await approveActivity(selectedActivity.id, customCredits);
    if (res.success) {
      setStatusFeedback('Activity approved! Credits awarded to student ledger.');
      setTimeout(() => {
        setSelectedActivity(null);
        setStatusFeedback(null);
      }, 1200);
    } else {
      setStatusFeedback(res.error || 'Approval failed.');
    }
    setActionLoading(false);
  };

  const handleConfirmRejection = async () => {
    if (!selectedActivity) return;
    if (!rejectReason.trim()) {
      setStatusFeedback('Please provide a reason for the rejection.');
      return;
    }
    setActionLoading(true);
    setStatusFeedback(null);

    const res = await rejectActivity(selectedActivity.id, rejectReason);
    if (res.success) {
      setStatusFeedback('Activity rejected with feedback sent to student.');
      setTimeout(() => {
        setRejectModalOpen(false);
        setSelectedActivity(null);
        setStatusFeedback(null);
      }, 1200);
    } else {
      setStatusFeedback(res.error || 'Rejection failed.');
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Pending Submissions Verification Queue
          </h3>
          <p className="text-xs text-slate-500">
            Review student evidence and award Green Credits directly to the ledger.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or activity..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Pending Items Table / Cards */}
      {filteredPending.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h4 className="font-semibold text-slate-800 text-sm">Verification Queue Clear!</h4>
          <p className="text-xs text-slate-400 mt-1">
            All submitted eco-actions have been reviewed. New student submissions will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPending.map((act) => {
            const rule = rules.find((r) => r.activity_type === act.activity_type);
            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {act.evidence_url ? (
                    <img
                      src={act.evidence_url}
                      alt="Evidence"
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-[10px] text-center p-2">
                      No Photo Evidence
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {act.activity_title || act.activity_type.replace('_', ' ')}
                      </span>
                      <Badge variant="amber" size="sm">
                        Pending Verification
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5" />
                        {act.student_name || 'Student'} ({act.student_email || 'No email'})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {act.date}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-700">
                        Rule standard: +{rule?.default_credits || 15} GC
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenRejectModal(act)}
                    icon={<XCircle className="w-4 h-4 text-rose-500" />}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenApproveModal(act)}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Approve & Award
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Approval Modal */}
      {selectedActivity && !rejectModalOpen && (
        <Modal
          isOpen={Boolean(selectedActivity && !rejectModalOpen)}
          onClose={() => setSelectedActivity(null)}
          title="Approve Activity Submission"
          description="Verify student evidence and record credits in the immutable ledger."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-700">
            {statusFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{statusFeedback}</span>
              </div>
            )}

            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">
                {selectedActivity.activity_title || selectedActivity.activity_type}
              </div>
              <p className="text-slate-600">{selectedActivity.description}</p>
              <div className="text-[11px] text-slate-500 pt-1">
                Student: <strong>{selectedActivity.student_name}</strong> • Date: {selectedActivity.date}
              </div>
            </div>

            {selectedActivity.evidence_url && (
              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Submitted Evidence Photo:
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56 bg-slate-100">
                  <img
                    src={selectedActivity.evidence_url}
                    alt="Evidence"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Green Credits to Award:
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={customCredits ?? 20}
                onChange={(e) => setCustomCredits(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This transaction will be committed to the student's credit ledger and cannot be reversed by client actions.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="md" onClick={() => setSelectedActivity(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={actionLoading}
                onClick={handleConfirmApproval}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Confirm Approval
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Review Rejection Modal */}
      {selectedActivity && rejectModalOpen && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Activity Submission"
          description="Provide constructive feedback explaining why this submission cannot be verified."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-700">
            {statusFeedback && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{statusFeedback}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Reason for Rejection *
              </label>
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Evidence photo is blurry or does not clearly show the campus recycling location. Please re-submit with clear photo."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="md" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                loading={actionLoading}
                onClick={handleConfirmRejection}
                icon={<XCircle className="w-4 h-4" />}
              >
                Reject Submission
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
