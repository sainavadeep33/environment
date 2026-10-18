import React, { useState } from 'react';
import { PlusCircle, Trophy, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Challenge } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AdminChallenges: React.FC = () => {
  const { challenges, rules, createChallenge } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState('recycling');
  const [targetCount, setTargetCount] = useState(5);
  const [creditReward, setCreditReward] = useState(50);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setTitle('');
    setDescription('');
    setActivityType(rules[0]?.activity_type || 'recycling');
    setTargetCount(5);
    setCreditReward(50);
    setStatusMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const res = await createChallenge({
      title,
      description,
      activity_type: activityType,
      target_count: targetCount,
      credit_reward: creditReward,
      start_date: startDate,
      end_date: endDate,
      is_active: true,
    });

    if (res.success) {
      setStatusMsg('Campus challenge published successfully!');
      setTimeout(() => setModalOpen(false), 1000);
    } else {
      setStatusMsg(res.error || 'Failed to create challenge.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Campus Sustainability Campaigns
          </h3>
          <p className="text-xs text-slate-500">
            Launch goal-oriented challenges to rally students around key campus climate targets.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleOpenCreate}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          Create Challenge
        </Button>
      </div>

      {/* Challenge List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((chal) => (
          <div
            key={chal.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="mint" size="sm">
                  +{chal.credit_reward} Bonus Credits
                </Badge>
                <Badge variant={chal.is_active ? 'emerald' : 'slate'} size="sm">
                  {chal.is_active ? 'Active' : 'Closed'}
                </Badge>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mb-1">{chal.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                {chal.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Activity:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {chal.activity_type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Goal:</span>
                  <span className="font-bold text-emerald-800">
                    {chal.target_count} logged actions
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Schedule:</span>
                  <span className="text-slate-600">
                    {chal.start_date} to {chal.end_date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Challenge Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Campus Challenge"
        description="Set goal thresholds and bonus credit awards for participants."
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Challenge Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zero-Waste Finals Week Sprint"
              className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Targeted Eco-Action *
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {rules.map((r) => (
                  <option key={r.id} value={r.activity_type}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Goal Actions Required *
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border rounded-xl font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bonus Credits Award *
              </label>
              <input
                type="number"
                min={5}
                max={1000}
                required
                value={creditReward}
                onChange={(e) => setCreditReward(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border rounded-xl font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description & Participation Guidelines *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how students can participate and any campus department sponsors..."
              className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Publish Challenge
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
