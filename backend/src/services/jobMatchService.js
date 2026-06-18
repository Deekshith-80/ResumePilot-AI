const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s+./#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value) =>
  new Set(
    normalize(value)
      .split(' ')
      .map((item) => item.trim())
      .filter(Boolean)
  );

const parseExperienceYears = (experienceText = '') => {
  const match = String(experienceText).match(/(\d+)\s*\+?\s*years?/i);
  return match ? Number(match[1]) : 0;
};

const extractResumeYears = (resume = {}) => {
  if (typeof resume.experienceYears === 'number') {
    return resume.experienceYears;
  }

  const fromExperience = Array.isArray(resume.experience) ? resume.experience.join(' ') : '';
  const raw = String(resume.rawText || '');
  const match = `${fromExperience} ${raw}`.match(/(\d+)\s*\+?\s*years?/i);
  return match ? Number(match[1]) : 0;
};

const getResumeSkills = (resume = {}) => {
  if (Array.isArray(resume.skills) && resume.skills.length) {
    return resume.skills;
  }
  const metadataSkills = resume?.analysisMetadata?.skills;
  return Array.isArray(metadataSkills) ? metadataSkills : [];
};

const scoreJob = (resume = {}, job = {}) => {
  const resumeSkills = new Set(getResumeSkills(resume).map((skill) => normalize(skill)));
  const resumeCerts = new Set((resume.certifications || resume?.analysisMetadata?.certifications || []).map((item) => normalize(item)));
  const jobSkills = (job.requiredSkills || []).map((skill) => normalize(skill));
  const jobKeywords = tokenize(`${job.title} ${job.description} ${job.category}`);
  const resumeKeywords = tokenize(`${resume.rawText || ''} ${(resume.skills || []).join(' ')} ${(resume.projects || []).join(' ')}`);
  const resumeYears = extractResumeYears(resume);
  const requiredYears = parseExperienceYears(job.experience);
  const requiredCerts = (job.requiredCertifications || []).map((cert) => normalize(cert));

  const matchingSkills = jobSkills.filter((skill) => resumeSkills.has(skill));
  const missingSkills = job.requiredSkills.filter((skill) => !resumeSkills.has(normalize(skill)));
  const matchingCertifications = requiredCerts.filter((cert) => resumeCerts.has(cert));
  const missingCertifications = job.requiredCertifications?.filter((cert) => !resumeCerts.has(normalize(cert))) || [];

  const skillScore = jobSkills.length ? (matchingSkills.length / jobSkills.length) * 45 : 25;
  const keywordOverlap = [...jobKeywords].filter((keyword) => resumeKeywords.has(keyword)).length;
  const keywordScore = jobKeywords.size ? Math.min(25, (keywordOverlap / jobKeywords.size) * 25) : 12;

  let experienceScore = 10;
  if (!requiredYears) {
    experienceScore = resumeYears > 0 ? 15 : 10;
  } else if (resumeYears >= requiredYears) {
    experienceScore = 20;
  } else {
    experienceScore = Math.max(5, (resumeYears / requiredYears) * 20);
  }

  const projectScore = Array.isArray(resume.projects) && resume.projects.length ? 10 : 5;
  const certificationScore = requiredCerts.length
    ? Math.max(0, 10 - Math.max(0, missingCertifications.length * 3))
    : 5;
  const rawMatch = Math.round(Math.min(100, skillScore + keywordScore + experienceScore + projectScore + certificationScore));

  const reasons = [];
  if (matchingSkills.length) {
    reasons.push(`Matches on ${matchingSkills.slice(0, 3).join(', ')}`);
  }
  if (missingSkills.length) {
    reasons.push(`Missing ${missingSkills.slice(0, 3).join(', ')}`);
  }
  if (matchingCertifications.length) {
    reasons.push(`Has ${matchingCertifications.slice(0, 2).join(', ')}`);
  }
  if (missingCertifications.length) {
    reasons.push(`Could improve with ${missingCertifications.slice(0, 2).join(', ')}`);
  }
  if (resumeYears >= requiredYears && requiredYears > 0) {
    reasons.push('Experience level aligns with the role');
  }
  if (!reasons.length) {
    reasons.push('Basic profile alignment detected');
  }

  return {
    jobId: job._id,
    title: job.title,
    category: job.category,
    location: job.location,
    salary: job.salary,
    description: job.description,
    matchPercentage: rawMatch,
    matchingSkills,
    missingSkills,
    matchingCertifications,
    missingCertifications,
    recommendationReason: reasons.join('. '),
    scoring: {
      skillScore: Math.round(skillScore),
      keywordScore: Math.round(keywordScore),
      experienceScore: Math.round(experienceScore),
      projectScore,
      certificationScore
    }
  };
};

const rankJobsForResume = (resume = {}, jobs = []) =>
  jobs
    .filter((job) => job.isActive !== false)
    .map((job) => scoreJob(resume, job))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

module.exports = {
  scoreJob,
  rankJobsForResume
};
