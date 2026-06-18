import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiMenu } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../buttons/Button';
import { logoutUser } from '../../features/auth/authSlice';

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-2xl border border-slate-200 p-2 lg:hidden" onClick={onMenuClick}>
            <FiMenu />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="rounded-2xl bg-emerald-500 px-3 py-2 text-sm text-white">AR</span>
            <span className="hidden sm:inline">Resume Analyzer</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-2xl border border-slate-200 p-2 text-slate-600">
            <FiBell />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-xs uppercase tracking-widest text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'Candidate'}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="gap-2">
            <FiLogOut />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

