import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => (
  <div
    className="min-h-screen"
    style={{
      background:
        'radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 22%), radial-gradient(circle at top right, rgba(52,211,153,0.12), transparent 24%), linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%)'
    }}
  >
    <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.15fr_0.85fr]">
      <div className="hidden flex-col justify-between p-8 lg:flex">
        <Link to="/" className="inline-flex items-center gap-3 font-semibold text-slate-900">
          <span className="rounded-2xl bg-emerald-500 px-3 py-2 text-white">AR</span>
          <span>AI Resume Analyzer</span>
        </Link>
        <div className="max-w-xl">
          <p className="section-label">Startup-grade resume intelligence</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight text-slate-900">
            Optimize your resume with ATS insights, match jobs faster, and apply with confidence.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Built for serious job seekers who want a polished experience, actionable recommendations, and a clean product feel.
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl">
          <p className="text-sm font-medium text-slate-500">What you get</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">ATS scoring</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-slate-700">Job matching</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-slate-700">Cover letters</div>
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">Application tracking</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/60">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
