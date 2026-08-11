import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Building, User, Shield, Moon, Sun, Key } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, company, updateCompany } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [companyName, setCompanyName] = useState(company?.name || '');
  const [gstNumber, setGstNumber] = useState(company?.gstNumber || '');
  const [financialYear, setFinancialYear] = useState(company?.financialYear || '2025-2026');
  const [currency, setCurrency] = useState(company?.currency || 'INR');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setCompanyName(company.name);
      setGstNumber(company.gstNumber || '');
    }
  }, [company]);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings/company', {
        name: companyName,
        gstNumber,
        financialYear,
        currency,
      });
      updateCompany(res.data);
      alert('Company settings updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          System Settings & Configuration <SettingsIcon className="w-5 h-5 text-slate-400" />
        </h1>
        <p className="text-xs text-slate-400">Manage profile, company details, permissions, & workspace preferences</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" /> User Profile Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Full Name:</span>
            <p className="font-bold text-white mt-1">{user?.name}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Email Address:</span>
            <p className="font-bold text-white mt-1">{user?.email}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">System Role:</span>
            <span className="inline-block font-bold text-blue-400 mt-1 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Company Settings Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Building className="w-4 h-4 text-indigo-400" /> Company Parameters
        </h3>
        <form onSubmit={handleSaveCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Company Legal Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">GST Registration Number</label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 uppercase"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Financial Year</label>
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Currency Code</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Theme & Security Preferences */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" /> Security & Interface Preferences
        </h3>
        <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
          <div>
            <p className="font-semibold text-white">Visual Mode Theme</p>
            <p className="text-[11px] text-slate-400">Toggle between Dark Mode and Light Mode interface</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            {theme.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};
