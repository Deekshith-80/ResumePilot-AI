import React from 'react';

const Textarea = React.forwardRef(({ label, error, ...props }, ref) => (
  <label className="block">
    {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
    <textarea
      ref={ref}
      className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      {...props}
    />
    {error ? <span className="mt-1.5 block text-xs text-red-500">{error}</span> : null}
  </label>
));

Textarea.displayName = 'Textarea';

export default Textarea;
