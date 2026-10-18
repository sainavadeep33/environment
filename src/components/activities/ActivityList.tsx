import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Calendar,
  Award,
  Filter,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Activity, ActivityStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ActivityListProps {
  activities: Activity[];
  isAdminView?: boolean;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  isAdminView = false,
}) => {
  const [filter, setFilter] = useState<'all' | ActivityStatus>('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filtered = activities.filter((act) => {
    if (filter === 'all') return true;
    return act.status === filter;
  });

  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="rose" size="sm" icon={<XCircle className="w-3 h-3" />}>
            Rejected
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="amber" size="sm" icon={<Clock className="w-3 h-3" />}>
            Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({activities.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({activities.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'approved'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved ({activities.filter((a) => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'rejected'
                ? 'bg-white text-rose-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected ({activities.filter((a) => a.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Activities Grid / List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-semibold text-slate-700 text-sm">No activities found</h4>
          <p className="text-xs text-slate-400 mt-1">
            {filter === 'all'
              ? 'No sustainability actions logged yet. Start by clicking "Log Action"!'
              : `No activities with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md hover:border-emerald-300/80 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                      {act.activity_title || act.activity_type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {act.date}
                      </span>
                      {isAdminView && act.student_name && (
                        <span>• Student: {act.student_name}</span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(act.status)}
                </div>

                <p className="text-xs text-slate-700 line-clamp-3 mb-3 leading-relaxed">
                  {act.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {act.evidence_url ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                      <ImageIcon className="w-3 h-3" /> Photo Attached
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">No Photo</span>
                  )}

                  {act.rejection_reason && (
                    <span className="flex items-center gap-1 text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-medium">
                      <MessageSquare className="w-3 h-3" /> Reason given
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs text-emerald-950">
                  {act.status === 'approved' ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> +{act.credits_awarded} Credits
                    </span>
                  ) : act.status === 'pending' ? (
                    <span className="text-amber-700 font-medium">Pending Review</span>
                  ) : (
                    <span className="text-rose-600 font-medium">0 Credits</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Inspection Modal */}
      {selectedActivity && (
        <Modal
          isOpen={Boolean(selectedActivity)}
          onClose={() => setSelectedActivity(null)}
          title={selectedActivity.activity_title || selectedActivity.activity_type.replace('_', ' ')}
          description={`Submitted on ${selectedActivity.date}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Review Status:</span>
              {getStatusBadge(selectedActivity.status)}
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-1">Description:</h5>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed">
                {selectedActivity.description}
              </p>
            </div>

            {selectedActivity.evidence_url && (
              <div>
                <h5 className="font-bold text-slate-900 mb-1">Attached Photo Evidence:</h5>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-64 bg-slate-100">
                  <img
                    src={selectedActivity.evidence_url}
                    alt="Evidence"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {selectedActivity.status === 'approved' && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Verified by Sustainability Office
                </div>
                <p className="text-[11px] text-emerald-800">
                  Awarded <strong>{selectedActivity.credits_awarded} Green Credits</strong> directly to student ledger balance.
                </p>
                {selectedActivity.reviewed_at && (
                  <p className="text-[10px] text-emerald-700">
                    Reviewed on {new Date(selectedActivity.reviewed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {selectedActivity.status === 'rejected' && selectedActivity.rejection_reason && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Reviewer Feedback / Reason:
                </div>
                <p className="text-[11px] text-rose-800">
                  {selectedActivity.rejection_reason}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
