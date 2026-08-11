import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LineChart as LineChartIcon, Sparkles, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const Forecasting: React.FC = () => {
  const [type, setType] = useState('REVENUE');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, [type]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/forecasts?type=${type}`);
      setData(res.data);
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
            AI Predictive Forecasting Engine <LineChartIcon className="w-5 h-5 text-blue-400" />
          </h1>
          <p className="text-xs text-slate-400">Scikit-learn trend models for Revenue, Sales, Demand & Profit</p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-semibold overflow-x-auto">
          {['REVENUE', 'SALES', 'DEMAND', 'PROFIT', 'EXPENSES'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                type === t ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Explanation Banner */}
          <div className="p-4 rounded-2xl bg-indigo-900/30 border border-indigo-500/30 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="text-xs text-slate-200">
              <span className="font-bold text-white">Model Explanation:</span> {data?.explanation}
              <span className="ml-2 font-semibold text-emerald-400">(Confidence: {data?.confidence}%)</span>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Actual vs Predicted Trajectory</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.predictions || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} name="Historical Actual (₹)" />
                  <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2.5} name="AI Projected Forecast (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
