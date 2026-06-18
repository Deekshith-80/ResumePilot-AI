import React from 'react';

const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center gap-3 text-sm text-slate-500">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
    <span>{label}</span>
  </div>
);

export default Spinner;

