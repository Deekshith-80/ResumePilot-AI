import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import SectionHeading from '../components/cards/SectionHeading';
import Button from '../components/buttons/Button';
import Input from '../components/forms/Input';
import Textarea from '../components/forms/Textarea';
import StatCard from '../components/cards/StatCard';
import Spinner from '../components/loaders/Spinner';
import { fetchProfile, fetchProfileStats, updateProfile } from '../features/profile/profileSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, stats, resumeHistory, applicationHistory, loading, error } = useSelector((state) => state.profile);
  const { register, handleSubmit, reset } = useForm();
  const [avatarFile, setAvatarFile] = React.useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchProfileStats());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        skills: profile.skills?.join(', ') || ''
      });
    }
  }, [profile, reset]);

  const currentProfile = profile || {};

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value || ''));
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    await dispatch(updateProfile(formData));
    dispatch(fetchProfileStats());
  };

  if (loading && !profile) {
    return <Spinner label="Loading profile..." />;
  }

  if (!profile && !error) {
    return <Spinner label="Loading profile..." />;
  }

  if (error && !profile) {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <SectionHeading eyebrow="Profile" title="Manage your personal details" description="Keep your resume profile current and track your application progress." />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Completion" value={`${stats?.profileCompletion || currentProfile.profileCompletion || 0}%`} hint="Profile completeness" />
        <StatCard title="Resumes" value={stats?.totalResumes || resumeHistory.length || 0} hint="Resume versions" />
        <StatCard title="Applications" value={stats?.totalApplications || applicationHistory.length || 0} hint="Total applications" />
        <StatCard title="ATS Score" value={stats?.latestAtsScore || 0} hint="Latest analyzed resume" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-3xl bg-emerald-50">
              {currentProfile.avatar ? <img src={currentProfile.avatar} alt={currentProfile.name || 'Profile'} className="h-full w-full object-cover" /> : null}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{currentProfile.name || 'Your profile'}</p>
              <p className="text-sm text-slate-500">{currentProfile.email || 'No email saved yet'}</p>
            </div>
          </div>
          <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-500" />
          <Input label="Name" {...register('name')} />
          <Input label="Email" type="email" {...register('email')} />
          <Input label="Phone" {...register('phone')} />
          <Input label="Location" {...register('location')} />
          <Textarea label="Bio" {...register('bio')} />
          <Input label="Skills" placeholder="React, Node.js, MongoDB" {...register('skills')} />
          <Button type="submit" className="w-full py-3">Edit Profile</Button>
        </form>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading eyebrow="Resume history" title="Latest uploads" />
            <div className="space-y-3">
              {resumeHistory.slice(0, 5).map((resume) => (
                <div key={resume._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{resume.fileName}</p>
                  <p className="mt-1 text-sm text-slate-500">ATS {resume.atsScore} • {new Date(resume.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {!resumeHistory.length ? <p className="text-sm text-slate-500">Upload a resume to see history here.</p> : null}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading eyebrow="Applications" title="Application history" />
            <div className="space-y-3">
              {applicationHistory.slice(0, 5).map((application) => (
                <div key={application._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{application.jobId?.title || 'Job'}</p>
                  <p className="mt-1 text-sm text-slate-500">{application.status} • Match {application.matchPercentage}%</p>
                </div>
              ))}
              {!applicationHistory.length ? <p className="text-sm text-slate-500">Applications will appear here.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
