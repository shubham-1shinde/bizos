import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, Activity, DollarSign, Cpu } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Executive Command Center <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400">High-level strategic indicators & enterprise risk assessment</p>
        </div>
      </div>

      {/* Enterprise Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Health Score</span>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-emerald-400">94 <span className="text-xs text-slate-400 font-normal">/ 100</span></h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">EXCELLENT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Strong balance sheet, low default risk & robust margins.</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enterprise Risk Index</span>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-blue-400">LOW</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">SCORE: 12%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Inventory coverage stable; GST compliance risk minimal.</p>
        </div>

        <StatCard title="Today's Estimated Revenue" value="₹1,84,500" change="+14%" isPositive={true} icon={DollarSign} color="emerald" />
        <StatCard title="Today's Estimated Profit" value="₹72,400" change="+18%" isPositive={true} icon={TrendingUp} color="blue" />
      </div>

      {/* Strategic AI Recommendations */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" /> Strategic AI Executive Directives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs font-bold text-blue-400 block mb-1">1. Pricing Elasticity Opportunity</span>
            <p className="text-xs text-slate-300">Increasing enterprise workstation prices by 8% will boost net profits by ₹1,40,000 next quarter without affecting order volume.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs font-bold text-emerald-400 block mb-1">2. Supplier Payment Terms</span>
            <p className="text-xs text-slate-300">Negotiating 15-day credit extensions with Silicon Core Distributors will release ₹3,50,000 in working capital.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs font-bold text-indigo-400 block mb-1">3. Customer Retention Protocol</span>
            <p className="text-xs text-slate-300">Engage PhonePe Infrastructure team immediately with customized upgrade packages to mitigate 60-day churn risk.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
