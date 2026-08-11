import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Bot,
  ShoppingBag,
  Package,
  Users,
  UserCheck,
  DollarSign,
  FileCheck,
  LineChart,
  SlidersHorizontal,
  Zap,
  FileSpreadsheet,
  Link2,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { company } = useAuth();

  const navItems = [
    { label: 'Main Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Executive Center', path: '/executive', icon: ShieldCheck },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Bot, highlight: true },
    { label: 'Sales Management', path: '/sales', icon: ShoppingBag },
    { label: 'Inventory & Stock', path: '/products', icon: Package },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Employees & HR', path: '/employees', icon: UserCheck },
    { label: 'Finance & P&L', path: '/finance', icon: DollarSign },
    { label: 'GST & Compliance', path: '/gst', icon: FileCheck },
    { label: 'AI Forecasting', path: '/forecasting', icon: LineChart },
    { label: 'What-If Simulator', path: '/simulator', icon: SlidersHorizontal },
    { label: 'Automation Center', path: '/automation', icon: Zap },
    { label: 'Reports & Export', path: '/reports', icon: FileSpreadsheet },
    { label: 'Data Integrations', path: '/integrations', icon: Link2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          B
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
            BizOS <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
          </h1>
          <p className="text-xs text-slate-400 truncate max-w-[140px]">{company?.name || 'Apex Innovations'}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : item.highlight
                    ? 'text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800 m-2 rounded-xl bg-slate-800/40 text-slate-400 text-[11px] flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Engine Online
        </span>
        <span className="text-[10px] text-slate-500">v2.4.0</span>
      </div>
    </aside>
  );
};
