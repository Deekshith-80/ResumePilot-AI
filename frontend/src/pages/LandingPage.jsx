import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiBarChart2, FiBriefcase, FiUploadCloud, FiShield } from 'react-icons/fi';
import FeatureCard from '../components/cards/FeatureCard';
import Button from '../components/buttons/Button';

const features = [
  { title: 'ATS Analysis', description: 'Scan resumes against role keywords and formatting expectations.', icon: <FiBarChart2 size={22} /> },
  { title: 'Resume Optimization', description: 'Get actionable suggestions to improve impact and ATS performance.', icon: <FiUploadCloud size={22} /> },
  { title: 'Job Matching', description: 'Compare your resume to live roles and surface best-fit opportunities.', icon: <FiBriefcase size={22} /> },
  { title: 'Secure Workspace', description: 'JWT auth, protected routes, and a clean SaaS workflow.', icon: <FiShield size={22} /> }
];

const LandingPage = () => (
  <div
    className="min-h-screen"
    style={{
      background:
        'radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 22%), radial-gradient(circle at top right, rgba(52,211,153,0.12), transparent 24%), linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%)'
    }}
  >
    <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 font-semibold text-slate-900">
        <span className="rounded-2xl bg-emerald-500 px-3 py-2 text-white">AR</span>
        <span className="hidden sm:inline">AI Resume Analyzer</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="secondary">Login</Button>
        </Link>
        <Link to="/register">
          <Button>Get Started</Button>
        </Link>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="section-label">Premium SaaS for job seekers</p>
          <h1 className="page-title mt-4 max-w-3xl font-semibold text-slate-900">
            Optimize your resume, improve ATS performance, and land better jobs.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Analyze resumes, generate cover letters, match against live jobs, and track every application in one polished workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button className="gap-2 px-6 py-3 text-base">
                Start Free <FiArrowRight />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="px-6 py-3 text-base">
                View Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['ATS score insights', 'AI suggestions', 'Job matches'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                <FiCheckCircle className="text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="glass-card rounded-[2rem] p-6">
          <div className="subtle-grid rounded-[1.5rem] border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">ATS Score</p>
                <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">92</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">+18 this week</div>
            </div>
            <div className="mt-6 h-40 rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-4">
              <div className="grid h-full grid-cols-5 items-end gap-3">
                {[38, 54, 62, 80, 92].map((value) => (
                  <div key={value} className="flex flex-col items-center gap-2">
                    <div className="w-full rounded-t-2xl bg-emerald-500/90" style={{ height: `${value}%` }} />
                    <span className="text-xs text-slate-500">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <section className="mt-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="section-label">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">A smoother workflow from upload to application</h2>
          <ol className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            {['Upload a resume in PDF or DOCX format.', 'Run ATS analysis and improve weak sections.', 'Match to jobs and submit applications faster.'].map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 font-semibold text-emerald-700">{index + 1}</span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
          <p className="section-label text-emerald-300">Trusted result</p>
          <blockquote className="mt-4 text-2xl font-medium leading-9">
            “The platform helped me identify missing keywords, improve my resume score, and get better interview callbacks.”
          </blockquote>
          <p className="mt-6 text-sm text-slate-300">Candidate success story</p>
        </div>
      </section>
    </main>
  </div>
);

export default LandingPage;
