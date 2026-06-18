import React from 'react';

const StatCard = ({ title, value, hint, icon }) => (
  <div className="glass-card rounded-3xl border border-slate-200 p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</h3>
        {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
      </div>
      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">{icon}</div>
    </div>
  </div>
);

export default StatCard;

