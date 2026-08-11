import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building, FileText, MapPin, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { company, updateCompany } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: company?.name || 'Apex Innovations Pvt Ltd',
    logo: company?.logo || '',
    gstNumber: company?.gstNumber || '27AAACA0000A1Z5',
    address: company?.address || 'Suite 402, Tech Park, Bandra East, Mumbai - 400051',
    financialYear: company?.financialYear || '2025-2026',
    industry: company?.industry || 'Technology & Retail',
    currency: company?.currency || 'INR (₹)',
    timezone: company?.timezone || 'Asia/Kolkata (IST)',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/onboarding', formData);
      updateCompany(res.data.company);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 mb-3 border border-blue-500/30">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Complete Company Setup</h2>
          <p className="text-xs text-slate-400 mt-1">Configure your 8 business parameters to initialize AI insights</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">1. Company Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 2. Logo */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">2. Logo URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 3. GST Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">3. GST Number</label>
            <input
              type="text"
              required
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none uppercase"
            />
          </div>

          {/* 4. Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">4. Registered Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 5. Financial Year */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">5. Financial Year</label>
            <select
              value={formData.financialYear}
              onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>

          {/* 6. Industry */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">6. Industry Sector</label>
            <input
              type="text"
              required
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 7. Currency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">7. Operating Currency</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 8. Timezone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">8. Timezone</label>
            <input
              type="text"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Finalizing Workspace...' : 'Launch Main Dashboard'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
