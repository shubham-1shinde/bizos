import React, { useState } from 'react';
import { api } from '../services/api';
import { SlidersHorizontal, Play, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

export const Simulator: React.FC = () => {
  const [scenarioType, setScenarioType] = useState('PRICE_CHANGE');
  const [priceChangePct, setPriceChangePct] = useState(10);
  const [employeeCount, setEmployeeCount] = useState(2);
  const [budgetIncrease, setBudgetIncrease] = useState(50000);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSim = async () => {
    setLoading(true);
    try {
      const res = await api.post('/simulations', {
        scenarioType,
        parameters: {
          priceChangePct: Number(priceChangePct),
          employeeCount: Number(employeeCount),
          budgetIncrease: Number(budgetIncrease),
        },
      });
      setResult(res.data);
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
            What-If Scenario Simulation Engine <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Simulate price elasticity, hiring plans, & marketing budget impacts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white">Scenario Configuration</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Choose Scenario</label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="PRICE_CHANGE">1. Change Product Pricing</option>
              <option value="HIRE_EMPLOYEES">2. Hire Sales Specialists</option>
              <option value="MARKETING_BOOST">3. Increase Marketing Budget</option>
            </select>
          </div>

          {scenarioType === 'PRICE_CHANGE' && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Price Adjustment (%)</span>
                <span className="font-bold text-blue-400">+{priceChangePct}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                value={priceChangePct}
                onChange={(e) => setPriceChangePct(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          )}

          {scenarioType === 'HIRE_EMPLOYEES' && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Employees to Hire</span>
                <span className="font-bold text-blue-400">{employeeCount} Reps</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          )}

          {scenarioType === 'MARKETING_BOOST' && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Additional Campaign Spend (₹)</span>
                <span className="font-bold text-blue-400">₹{budgetIncrease.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="300000"
                step="10000"
                value={budgetIncrease}
                onChange={(e) => setBudgetIncrease(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          )}

          <button
            onClick={runSim}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Running Math Engine...' : 'Run Simulation'} <Play className="w-4 h-4" />
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Simulated Forecast Output</h3>

            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <span className="text-[11px] text-slate-400">Revenue Impact</span>
                    <p className="text-xl font-extrabold text-emerald-400 mt-1">+{result.results.revenueImpact}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <span className="text-[11px] text-slate-400">Profit Impact</span>
                    <p className="text-xl font-extrabold text-blue-400 mt-1">+{result.results.profitImpact}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <span className="text-[11px] text-slate-400">Demand Volume</span>
                    <p className={`text-xl font-extrabold mt-1 ${result.results.demandImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.results.demandImpact}%
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <span className="text-[11px] text-slate-400">Cost Impact</span>
                    <p className="text-xl font-extrabold text-amber-400 mt-1">+{result.results.costImpact}%</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-900/30 border border-indigo-500/30 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">AI Strategic Recommendation</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{result.recommendation}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Select parameters on the left and click "Run Simulation" to view calculated projections.
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800/80">
            * Note: Simulated results are predictive estimates generated by mathematical simulation models.
          </div>
        </div>
      </div>
    </div>
  );
};
