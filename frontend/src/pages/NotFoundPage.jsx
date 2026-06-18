import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/buttons/Button';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl">
      <p className="section-label">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">The route you requested does not exist.</p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Go home</Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

