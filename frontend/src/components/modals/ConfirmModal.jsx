import React from 'react';

const ConfirmModal = ({ open, title, description, onConfirm, onCancel, confirmLabel = 'Confirm' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

