import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiBarChart2, FiFileText, FiGrid, FiSettings, FiUser, FiBriefcase } from 'react-icons/fi';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FiFileText },
  { to: '/job-matcher', label: 'Job Matcher', icon: FiBriefcase },
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings }
];

const Sidebar = ({ mobileOpen = false, onClose }) => (
  <aside
    className={clsx(
      'fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white px-4 py-6 transition-transform lg:static lg:translate-x-0',
      mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
    )}
  >
    <div className="mb-8 flex items-center justify-between lg:block">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-500 px-3 py-2 font-semibold text-white">AR</div>
        <div>
          <p className="text-sm font-semibold text-slate-900">AI Resume</p>
          <p className="text-xs text-slate-500">Analyzer SaaS</p>
        </div>
      </div>
      <button onClick={onClose} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm lg:hidden">
        Close
      </button>
    </div>
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            <Icon className="text-lg" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
    <div className="mt-8 rounded-3xl bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <FiBarChart2 />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">ATS Optimized</p>
          <p className="text-xs leading-5 text-slate-500">Track score trends and improve faster.</p>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;

