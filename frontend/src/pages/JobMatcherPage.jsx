import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiBriefcase } from 'react-icons/fi';
import SectionHeading from '../components/cards/SectionHeading';
import Button from '../components/buttons/Button';
import Spinner from '../components/loaders/Spinner';
import { fetchJobs, fetchJobMatches, applyToJob } from '../features/jobs/jobSlice';

const JobMatcherPage = () => {
  const dispatch = useDispatch();
  const { jobs, matchedJobs, applications, latestResume, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchJobMatches());
  }, [dispatch]);

  const handleApply = async (jobId) => {
    await dispatch(applyToJob({ jobId }));
    dispatch(fetchJobMatches());
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <SectionHeading eyebrow="Job intelligence" title="Job Matcher" description="See your best fits, missing skills, and recent applications." />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {loading ? <Spinner label="Loading jobs..." /> : null}
          {(matchedJobs.length ? matchedJobs : jobs).slice(0, 8).map((job) => (
            <div key={job.jobId || job._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="text-emerald-600" />
                    <p className="font-semibold text-slate-900">{job.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{job.location} • {job.salary || 'Competitive'} • {job.experience || 'Flexible experience'}</p>
                </div>
                {'matchPercentage' in job ? (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{job.matchPercentage}% match</div>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{job.description}</p>
              {'matchingSkills' in job ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Matching skills</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.matchingSkills?.map((skill) => <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{skill}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Missing skills</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.missingSkills?.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{skill}</span>)}
                    </div>
                  </div>
                </div>
              ) : null}
              {'matchingCertifications' in job || 'missingCertifications' in job ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Matching certifications</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.matchingCertifications?.map((cert) => <span key={cert} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{cert}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Missing certifications</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.missingCertifications?.map((cert) => <span key={cert} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{cert}</span>)}
                    </div>
                  </div>
                </div>
              ) : null}
              {'recommendationReason' in job ? <p className="mt-4 text-sm text-slate-500">{job.recommendationReason}</p> : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Button className="gap-2" onClick={() => handleApply(job.jobId || job._id)}>
                  Apply <FiArrowRight />
                </Button>
                <Button variant="secondary" onClick={() => dispatch(fetchJobMatches())}>
                  Refresh matches
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="section-label">Recommended</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Best match jobs</h3>
            {latestResume ? (
              <p className="mt-2 text-sm text-slate-500">
                Matched against {latestResume.fileName} with ATS score {latestResume.atsScore}.
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Upload a resume to generate personalized matches.</p>
            )}
            <div className="mt-4 space-y-3">
              {matchedJobs.slice(0, 3).map((job) => (
                <div key={job.jobId} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{job.title}</span>
                    <span className="text-sm font-semibold text-emerald-700">{job.matchPercentage}%</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{job.recommendationReason}</p>
                </div>
              ))}
              {!matchedJobs.length ? <p className="text-sm text-slate-500">Upload a resume to unlock matching.</p> : null}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="section-label">Applications</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Recently applied</h3>
            <div className="mt-4 space-y-3">
              {applications.slice(0, 5).map((application) => (
                <div key={application._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{application.jobId?.title || 'Job application'}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Status: {application.status} • Match: {application.matchPercentage}%
                  </p>
                </div>
              ))}
              {!applications.length ? <p className="text-sm text-slate-500">No applications yet.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobMatcherPage;
