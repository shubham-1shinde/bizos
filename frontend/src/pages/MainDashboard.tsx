import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { StatCard } from '../components/StatCard';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  FileCheck,
  CreditCard,
  Package,
  Users,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

export const MainDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('monthly');

  useEffect(() => {
    fetchDashboard();
  }, [filter]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpis = data?.kpis;

  return (
    <div className="space-y-6">
      {/* Header & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Main Operating Dashboard <Sparkles className="w-5 h-5 text-blue-400" />
          </h1>
          <p className="text-xs text-slate-400">Real-time enterprise metrics & predictive insights</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-semibold">
          {['weekly', 'monthly', 'yearly'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${(kpis?.revenue || 0).toLocaleString()}`}
          change="18.2%"
          isPositive={true}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Net Operating Profit"
          value={`₹${(kpis?.profit || 0).toLocaleString()}`}
          change="12.4%"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={kpis?.orders || 0}
          change="8.1%"
          isPositive={true}
          icon={ShoppingBag}
          color="indigo"
        />
        <StatCard
          title="GST Tax Liability"
          value={`₹${(kpis?.gstLiability || 0).toLocaleString()}`}
          change="Compliant"
          isPositive={true}
          icon={FileCheck}
          color="purple"
        />
        <StatCard
          title="Pending Payments"
          value={`₹${(kpis?.pendingPayments || 0).toLocaleString()}`}
          change="-4.5%"
          isPositive={false}
          icon={CreditCard}
          color="rose"
        />
        <StatCard
          title="Active SKUs"
          value={kpis?.totalProducts || 0}
          change="Optimal"
          isPositive={true}
          icon={Package}
          color="cyan"
        />
        <StatCard
          title="Customer Base"
          value={kpis?.totalCustomers || 0}
          change={`${kpis?.customerGrowthRate || 14.5}% growth`}
          isPositive={true}
          icon={Users}
          color="sky"
        />
        <StatCard
          title="Net Cash Flow"
          value={`₹${Math.round(kpis?.cashFlowNet || 0).toLocaleString()}`}
          change="Healthy"
          isPositive={true}
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Profit Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue vs Expense vs Profit</h3>
              <p className="text-[11px] text-slate-400">Monthly financial performance breakdown</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.revenueTrend || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Revenue (₹)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProf)" strokeWidth={2} name="Profit (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Recommendation Widget */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">AI Real-time Business Insights</h3>
            </div>
            <div className="space-y-3">
              {data?.aiInsights.map((insight) => (
                <div key={insight.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">{insight.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${insight.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {insight.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800">
            <a href="/ai-assistant" className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              Ask AI Business Assistant <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Low Stock Alert & Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert Widget */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Low Stock Warning</h3>
            </div>
            <a href="/products" className="text-xs text-blue-400 hover:underline">View All Products</a>
          </div>
          <div className="divide-y divide-slate-800">
            {data?.lowStockProducts.map((prod, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{prod.name}</p>
                  <p className="text-[10px] text-slate-500">SKU: {prod.sku}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-400">{prod.currentStock} left</span>
                  <p className="text-[10px] text-slate-400">Reorder at {prod.reorderPoint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Completed Orders</h3>
            <a href="/sales" className="text-xs text-blue-400 hover:underline">View Sales Ledger</a>
          </div>
          <div className="divide-y divide-slate-800">
            {data?.recentSales.map((sale) => (
              <div key={sale._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{sale.invoiceNumber}</p>
                  <p className="text-[10px] text-slate-400">{sale.customerId?.name || 'Walk-in Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">₹{sale.totalAmount.toLocaleString()}</p>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                    {sale.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
