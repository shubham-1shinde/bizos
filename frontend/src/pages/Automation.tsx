import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Zap, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Automation: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('STOCK_LESS_THAN_REORDER');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await api.get('/automation');
      setWorkflows(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.patch(`/automation/${id}/toggle`);
      fetchWorkflows();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/automation', {
        name,
        trigger,
        conditions: { threshold: 10 },
        actions: ['NOTIFY_MANAGER', 'CREATE_PURCHASE_ORDER', 'SEND_EMAIL'],
        isEnabled: true,
      });
      setIsModalOpen(false);
      fetchWorkflows();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create workflow');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Automation Center Workflows <Zap className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400">Configure IF-THEN triggers for auto purchase orders & notifications</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Create Workflow Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <div key={wf._id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{wf.name}</span>
              <button
                onClick={() => handleToggle(wf._id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                  wf.isEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {wf.isEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 text-xs text-slate-300 space-y-1">
              <p><span className="text-amber-400 font-bold">IF:</span> Stock level falls below reorder threshold</p>
              <p><span className="text-blue-400 font-bold">THEN:</span> Notify Manager AND Create Draft Purchase Order AND Send Email</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Automation Rule">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rule Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Auto Restock High Priority SKUs"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">IF Trigger Event</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="STOCK_LESS_THAN_REORDER">Stock Level &lt; Reorder Point</option>
              <option value="GST_RETURN_DUE">GST Filing Due in 7 Days</option>
              <option value="PAYMENT_OVERDUE">Invoice Payment Overdue &gt; 30 Days</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Save Workflow Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
