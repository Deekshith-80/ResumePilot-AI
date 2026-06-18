import React from 'react';
import clsx from 'clsx';

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const classes = clsx(
    'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60',
    variant === 'primary' && 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600',
    variant === 'secondary' && 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
    variant === 'ghost' && 'bg-transparent text-slate-700 hover:bg-slate-100',
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;

