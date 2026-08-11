import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Customer } from '../types';
import { Modal } from '../components/Modal';
import { Users, Plus, Search, Sparkles } from 'lucide-react';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState<'VIP' | 'Premium' | 'Regular' | 'New' | 'At Risk'>('Regular');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/customers', { name, email, phone, segment });
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create customer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Customer Intelligence & Predictive CLV <Users className="w-5 h-5 text-sky-400" />
          </h1>
          <p className="text-xs text-slate-400">Automated segmentation, churn risk scoring, and customer lifetime value</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Customer Name</th>
                <th className="px-6 py-3.5">Segment</th>
                <th className="px-6 py-3.5">Total Spent (₹)</th>
                <th className="px-6 py-3.5">Estimated CLV (₹)</th>
                <th className="px-6 py-3.5">Predicted Next Purchase</th>
                <th className="px-6 py-3.5">Churn Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.segment === 'VIP'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : c.segment === 'At Risk'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-400">₹{c.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">
                    ₹{Math.round(c.aiPredictions?.clvEstimated || c.totalSpent * 2).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{c.aiPredictions?.nextPurchaseDate || 'In 14 Days'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-extrabold ${
                        c.aiPredictions?.churnRisk === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {c.aiPredictions?.churnRisk || 'LOW'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Customer Account">
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Customer / Company Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tata Digital Services"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tech@tatadigital.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9820011223"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Segment</label>
            <select
              value={segment}
              onChange={(e: any) => setSegment(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="VIP">VIP</option>
              <option value="Premium">Premium</option>
              <option value="Regular">Regular</option>
              <option value="New">New</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
