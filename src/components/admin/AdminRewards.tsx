import React, { useState } from 'react';
import { PlusCircle, Edit3, CheckCircle2, AlertCircle, Package, Gift, Trash2, Power } from 'lucide-react';
import { Reward } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AdminRewards: React.FC = () => {
  const { rewards, createReward, updateReward } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Merchandise');
  const [imageUrl, setImageUrl] = useState('');
  const [creditCost, setCreditCost] = useState(100);
  const [stock, setStock] = useState(50);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingReward(null);
    setTitle('');
    setDescription('');
    setCategory('Merchandise');
    setImageUrl('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80');
    setCreditCost(100);
    setStock(50);
    setIsActive(true);
    setStatusMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (reward: Reward) => {
    setEditingReward(reward);
    setTitle(reward.title);
    setDescription(reward.description);
    setCategory(reward.category);
    setImageUrl(reward.image_url);
    setCreditCost(reward.credit_cost);
    setStock(reward.available_stock);
    setIsActive(reward.is_active);
    setStatusMsg(null);
    setModalOpen(true);
  };

  const handleToggleActive = async (reward: Reward) => {
    await updateReward(reward.id, { is_active: !reward.is_active });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      if (editingReward) {
        const res = await updateReward(editingReward.id, {
          title,
          description,
          category,
          image_url: imageUrl,
          credit_cost: creditCost,
          available_stock: stock,
          is_active: isActive,
        });
        if (res.success) {
          setStatusMsg('Reward updated successfully!');
          setTimeout(() => setModalOpen(false), 1000);
        } else {
          setStatusMsg(res.error || 'Failed to update reward.');
        }
      } else {
        const res = await createReward({
          title,
          description,
          category,
          image_url: imageUrl,
          credit_cost: creditCost,
          initial_stock: stock,
          available_stock: stock,
          is_active: isActive,
        });
        if (res.success) {
          setStatusMsg('Reward created successfully!');
          setTimeout(() => setModalOpen(false), 1000);
        } else {
          setStatusMsg(res.error || 'Failed to create reward.');
        }
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Campus Rewards & Voucher Inventory
          </h3>
          <p className="text-xs text-slate-500">
            Manage rewards catalog, configure stock allocations, and set credit costs.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleOpenCreate}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          Add New Reward
        </Button>
      </div>

      {/* Rewards Catalog Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
              reward.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div>
              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100 mb-3">
                <img
                  src={reward.image_url}
                  alt={reward.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white">
                  {reward.category}
                </span>
                <span className="absolute top-2 right-2">
                  <Badge variant={reward.is_active ? 'emerald' : 'slate'} size="sm">
                    {reward.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                {reward.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {reward.description}
              </p>

              <div className="mt-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Cost</span>
                  <span className="font-extrabold text-emerald-700">{reward.credit_cost} GC</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Stock</span>
                  <span className={`font-bold ${reward.available_stock <= 5 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {reward.available_stock} available
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(reward)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Power className={`w-3.5 h-3.5 ${reward.is_active ? 'text-emerald-600' : 'text-slate-400'}`} />
                {reward.is_active ? 'Deactivate' : 'Activate'}
              </button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenEdit(reward)}
                icon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingReward ? 'Edit Reward Item' : 'Add New Reward Item'}
        description="Configure reward details, stock limits, and Green Credit costs."
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
              Reward Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zero-Waste Campus Water Flask"
              className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Merchandise">Merchandise</option>
                <option value="Dining">Dining</option>
                <option value="Transit">Transit</option>
                <option value="Recognition">Recognition</option>
                <option value="Academic">Academic</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Credit Cost *
              </label>
              <input
                type="number"
                min={1}
                required
                value={creditCost}
                onChange={(e) => setCreditCost(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border rounded-xl font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Available Stock Units *
              </label>
              <input
                type="number"
                min={0}
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                Active in Catalog
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reward Description *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide item specifications and redemption location details..."
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
              {editingReward ? 'Save Changes' : 'Create Reward'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
