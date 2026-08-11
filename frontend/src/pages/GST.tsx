import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { GSTSummary } from '../types';
import { FileCheck, ShieldCheck, AlertCircle, Calendar } from 'lucide-react';

export const GST: React.FC = () => {
  const [data, setData] = useState<{ summary: GSTSummary; returns: any[]; recentRecords: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGSTData();
  }, []);

  const fetchGSTData = async () => {
    try {
      const res = await api.get('/gst');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { summary, returns, recentRecords } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            GST & Tax Compliance Center <FileCheck className="w-5 h-5 text-purple-400" />
          </h1>
          <p className="text-xs text-slate-400">Automated CGST/SGST/IGST tax calculation & GSTR-1/GSTR-3B filings</p>
        </div>
      </div>

      {/* Tax Liability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400">Total Output Tax (Sales)</span>
          <h3 className="text-2xl font-extrabold text-purple-400 mt-2">₹{summary.outputTax.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400">Input Tax Credit (ITC)</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">₹{summary.inputTaxCredit.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400">Net GST Liability</span>
          <h3 className="text-2xl font-extrabold text-white mt-2">₹{summary.netTaxLiability.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400">Compliance Health Score</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">{summary.complianceScore} / 100</h3>
        </div>
      </div>

      {/* Breakdown: CGST, SGST, IGST */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">GST Tax Breakdown</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400">CGST (Central Tax)</span>
            <p className="text-lg font-bold text-white mt-1">₹{summary.cgst.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400">SGST (State Tax)</span>
            <p className="text-lg font-bold text-white mt-1">₹{summary.sgst.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400">IGST (Integrated Tax)</span>
            <p className="text-lg font-bold text-white mt-1">₹{summary.igst.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* GST Returns Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Scheduled GST Returns & Filings
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Return Type</th>
                <th className="px-6 py-3.5">Period</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Tax Liability (₹)</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {returns.map((ret) => (
                <tr key={ret._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{ret.returnType}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{ret.period}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(ret.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">₹{ret.taxLiability.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ret.status === 'Filed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {ret.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
