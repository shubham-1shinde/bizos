import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Employee } from '../types';
import { UserCheck, Sparkles, Award, TrendingUp } from 'lucide-react';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.employees);
      setAiInsight(res.data.aiInsight);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Employee Performance & HR Analytics <UserCheck className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Target achievements, productivity metrics, and AI HR insights</p>
        </div>
      </div>

      {/* AI HR Insight Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">AI Team Productivity Analysis</h3>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">{aiInsight}</p>
        </div>
      </div>

      {/* Employees Leaderboard Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Sales Leaderboard & Productivity Ratings
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Role & Department</th>
                <th className="px-6 py-3.5">Target Sales (₹)</th>
                <th className="px-6 py-3.5">Achieved Sales (₹)</th>
                <th className="px-6 py-3.5">Target Progress</th>
                <th className="px-6 py-3.5">Productivity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {employees.map((emp) => {
                const pct = emp.targetSales > 0 ? Math.round((emp.achievedSales / emp.targetSales) * 100) : 100;
                return (
                  <tr key={emp._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{emp.name}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-200 font-medium">{emp.role}</p>
                      <p className="text-[10px] text-slate-500">{emp.department}</p>
                    </td>
                    <td className="px-6 py-4">₹{emp.targetSales.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400">₹{emp.achievedSales.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                        </div>
                        <span className="font-bold">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {emp.productivityScore} / 100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
