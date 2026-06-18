import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Topbar from '../components/navbar/Topbar';

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell flex">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div
        className="min-h-screen flex-1"
        style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%)' }}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      {mobileOpen ? <div className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
    </div>
  );
};

export default DashboardLayout;
