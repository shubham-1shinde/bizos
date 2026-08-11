import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FileSpreadsheet, Plus, Download, Calendar } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [type, setType] = useState('Sales');
  const [format, setFormat] = useState('PDF');
  const [schedule, setSchedule] = useState('Manual');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reports/generate', { type, format, schedule });
      setIsModalOpen(false);
      fetchReports();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Reports & Export Center <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400">Generate and schedule PDF, Excel, and CSV enterprise statements</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Generate New Report
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Report Title</th>
                <th className="px-6 py-3.5">Module Type</th>
                <th className="px-6 py-3.5">Format</th>
                <th className="px-6 py-3.5">Schedule</th>
                <th className="px-6 py-3.5">Generated At</th>
                <th className="px-6 py-3.5 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reports.map((rep) => (
                <tr key={rep._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{rep.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{rep.type}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-blue-400 border border-slate-700">
                      {rep.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{rep.schedule}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(rep.generatedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => alert(`Downloading report: ${rep.name}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Corporate Report">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Report Module</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Sales">Sales Ledger & Revenue</option>
              <option value="Inventory">Inventory & Stock Valuations</option>
              <option value="Finance">Profit & Loss Statement</option>
              <option value="GST">GST Output & ITC Summary</option>
              <option value="Executive">Executive Briefing Report</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="PDF">PDF Document</option>
              <option value="Excel">Excel Spreadsheet (.xlsx)</option>
              <option value="CSV">CSV Data File (.csv)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Scheduling</label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Manual">One-time Instant Generation</option>
              <option value="Daily">Daily Automated Export</option>
              <option value="Weekly">Weekly Automated Export</option>
              <option value="Monthly">Monthly Automated Export</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Generate Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
