import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import SectionHeading from '../components/cards/SectionHeading';
import Button from '../components/buttons/Button';
import Input from '../components/forms/Input';
import ConfirmModal from '../components/modals/ConfirmModal';
import { THEME_OPTIONS } from '../utils/constants';
import { setTheme, updateTheme, updatePassword, logoutAccount } from '../features/settings/settingsSlice';
import { clearAuth } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../services/profileApi';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, loading, error } = useSelector((state) => state.settings);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  const saveTheme = async (value) => {
    dispatch(setTheme(value));
    await dispatch(updateTheme({ theme: value }));
  };

  const changePassword = async (values) => {
    await dispatch(updatePassword(values));
    reset();
  };

  const doLogout = async () => {
    await dispatch(logoutAccount());
    dispatch(clearAuth());
    navigate('/login');
  };

  const doDelete = async () => {
    try {
      await profileApi.deleteAccount();
      dispatch(clearAuth());
      navigate('/login');
    } catch (error) {
      // Handled by API response; keep the modal open if it fails.
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <SectionHeading eyebrow="Preferences" title="Settings" description="Control theme, password, logout, and account management." />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading eyebrow="Theme" title="Appearance" />
          <div className="mt-4 flex flex-wrap gap-3">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => saveTheme(option.value)}
                disabled={loading}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${theme === option.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'} ${loading ? 'opacity-70' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit(changePassword)} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <SectionHeading eyebrow="Security" title="Change password" />
          <Input label="Current Password" type="password" {...register('currentPassword', { required: true })} />
          <Input label="New Password" type="password" {...register('newPassword', { required: true, minLength: 8 })} />
          <Button type="submit" disabled={loading}>Update password</Button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeading eyebrow="Account" title="Danger zone" />
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={doLogout} disabled={loading}>Logout</Button>
          <Button variant="secondary" onClick={() => setConfirmDelete(true)} className="text-red-600" disabled={loading}>Delete account</Button>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete your account?"
        description="This will permanently remove your profile, resumes, versions, and applications."
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={doDelete}
      />
    </motion.div>
  );
};

export default SettingsPage;
