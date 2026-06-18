import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/forms/Input';
import Button from '../components/buttons/Button';
import { loginUser } from '../features/auth/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: true }
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));
    if (result.type.endsWith('/fulfilled')) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue optimizing your resume and managing applications.">
      <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="Enter your password" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" {...register('rememberMe')} className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400" />
            Remember me
          </label>
          <button type="button" className="font-medium text-emerald-700 hover:text-emerald-600">
            Forgot password?
          </button>
        </div>
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </motion.form>
      <p className="mt-6 text-center text-sm text-slate-600">
        New here? <Link to="/register" className="font-semibold text-emerald-700">Create an account</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;

