import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/forms/Input';
import Button from '../components/buttons/Button';
import { registerUser } from '../features/auth/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });
  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim().toLowerCase()
    };
    const result = await dispatch(registerUser(payload));
    if (result.type.endsWith('/fulfilled')) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Get ATS analysis, job matching, and AI-powered resume guidance in one place.">
      <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Input label="Name" placeholder="Your name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
        <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          {...register('password', {
            required: 'Password is required',
            validate: (value) =>
              strongPasswordPattern.test(value) ||
              'Use 8+ characters with uppercase, lowercase, number, and symbol.'
          })}
          error={errors.password?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match'
          })}
          error={errors.confirmPassword?.message}
        />
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
        <p className="text-xs text-slate-500">
          Passwords need at least 8 characters, with uppercase, lowercase, a number, and a symbol.
        </p>
        <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </Button>
      </motion.form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="font-semibold text-emerald-700">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
