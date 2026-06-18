import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiTarget, FiList, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/cards/SectionHeading';
import StatCard from '../components/cards/StatCard';
import Button from '../components/buttons/Button';
import Spinner from '../components/loaders/Spinner';
import { fetchProfileStats } from '../features/profile/profileSlice';
import { fetchJobMatches } from '../features/jobs/jobSlice';
import { fetchResumeHistory } from '../features/resume/resumeSlice';
import { TrendChart, BreakdownChart } from '../components/charts/OverviewCharts';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
  const { matchedJobs, applications, loading: jobsLoading, error: jobsError } = useSelector((state) => state.jobs);
  const { resumeHistory, loading: resumeLoading, error: resumeError } = useSelector((state) => state.resume);

  useEffect(() => {
    dispatch(fetchProfileStats());
    dispatch(fetchJobMatches());
    dispatch(fetchResumeHistory());
  }, [dispatch]);

  const loading = profileLoading || jobsLoading || resumeLoading;
  const latestAtsScore = stats?.latestAtsScore || resumeHistory?.[0]?.atsScore || 0;
  const chartLabels = resumeHistory.slice(0, 6).map((item) => new Date(item.createdAt).toLocaleDateString());
  const chartValues = resumeHistory.slice(0, 6).map((item) => item.atsScore || 0).reverse();
  const skills = resumeHistory?.[0]?.skills || [];

  if (loading && !stats && !resumeHistory.length && !matchedJobs.length) {
    return <Spinner label="Loading dashboard..." />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <SectionHeading
        eyebrow="Overview"
        title="Dashboard"
        description="Track your ATS progress, job matches, applications, and resume insights in one place."
        action={
          <div className="flex gap-3">
            <Link to="/resume-analyzer">
              <Button className="gap-2"><FiUploadCloud /> Upload Resume</Button>
            </Link>
            <Link to="/job-matcher">
              <Button variant="secondary" className="gap-2"><FiTarget /> Match Jobs</Button>
            </Link>
          </div>
        }
      />

      {profileError || jobsError || resumeError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {profileError || jobsError || resumeError}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        <StatCard title="ATS Score" value={latestAtsScore} hint="Latest analyzed resume" icon={<FiTrendingUp />} />
        <StatCard title="Matched Jobs" value={matchedJobs.length} hint="Recommended opportunities" icon={<FiTarget />} />
        <StatCard title="Applications" value={stats?.totalApplications || applications.length || 0} hint="Tracked applications" icon={<FiList />} />
        <StatCard title="Profile Completion" value={`${stats?.profileCompletion || 0}%`} hint="Profile completeness" icon={<FiUploadCloud />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="section-label">Trend</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">ATS score trend</h3>
            </div>
          </div>
          <div className="h-80">
            <TrendChart labels={chartLabels.length ? chartLabels : ['Week 1', 'Week 2', 'Week 3', 'Week 4']} data={chartValues.length ? chartValues : [52, 61, 74, latestAtsScore || 82]} />
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="section-label">Skills</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">Skill breakdown</h3>
          <div className="mt-6 h-72">
            <BreakdownChart labels={skills.slice(0, 4).length ? skills.slice(0, 4) : ['React', 'Node.js', 'MongoDB', 'SQL']} data={skills.slice(0, 4).length ? skills.slice(0, 4).map(() => 25) : [32, 24, 18, 26]} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading eyebrow="Quick actions" title="Get moving" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Upload Resume', to: '/resume-analyzer' },
              { title: 'Analyze Resume', to: '/resume-analyzer' },
              { title: 'Match Jobs', to: '/job-matcher' },
              { title: 'Edit Profile', to: '/profile' }
            ].map((item) => (
              <Link key={item.title} to={item.to} className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading eyebrow="Recent activity" title="What happened lately" />
          <div className="space-y-4 text-sm text-slate-600">
            {resumeHistory.slice(0, 3).map((resume) => (
              <div key={resume._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">{resume.fileName}</p>
                <p className="mt-1">ATS score: {resume.atsScore} | Skills: {resume.skills?.slice(0, 3).join(', ') || 'N/A'}</p>
              </div>
            ))}
            {!resumeHistory.length ? <p>No recent resume activity yet. Upload a resume to start.</p> : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
