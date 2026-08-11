import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Expense } from '../types';
import { Modal } from '../components/Modal';
import { DollarSign, Plus, TrendingUp, PieChart, CreditCard } from 'lucide-react';

export const Finance: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      const [sumRes, expRes] = await Promise.all([
        api.get('/finance'),
        api.get('/finance/expenses'),
      ]);
      setSummary(sumRes.data.summary);
      setExpenses(expRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/finance/expenses', {
        category,
        amount: Number(amount),
        description,
      });
      setIsModalOpen(false);
      fetchFinance();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add expense');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Finance & P&L Operations <DollarSign className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400">Income, corporate expenses, net profit, and profit margins</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Record Expense
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
          <h3 className="text-2xl font-extrabold text-white mt-2">₹{(summary?.totalRevenue || 0).toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400">Total Expenses</span>
          <h3 className="text-2xl font-extrabold text-rose-400 mt-2">₹{(summary?.totalExpenses || 0).toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400">Net Operating Profit</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">₹{(summary?.netProfit || 0).toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400">Net Profit Margin</span>
          <h3 className="text-2xl font-extrabold text-indigo-400 mt-2">{summary?.netMargin || 0}%</h3>
        </div>
      </div>

      {/* Expenses Ledger */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-rose-400" /> Recent Corporate Expenses
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{exp.category}</td>
                  <td className="px-6 py-4 text-slate-300">{exp.description}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-rose-400">₹{exp.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Corporate Expense">
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Rent">Rent & Facilities</option>
              <option value="Utilities">Utilities & Power</option>
              <option value="Payroll">Payroll & Wages</option>
              <option value="Marketing">Marketing & Advertising</option>
              <option value="Software Licensing">Software Licensing</option>
              <option value="Travel & Logistics">Travel & Logistics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount (₹)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Monthly office rent payment"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Save Expense Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
