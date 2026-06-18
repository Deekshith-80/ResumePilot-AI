const Job = require('../models/Job');
const jobsData = require('./jobsData');

const seedJobsIfNeeded = async () => {
  const count = await Job.countDocuments();
  if (count > 0) {
    return { seeded: false, count };
  }

  await Job.insertMany(
    jobsData.map((job) => ({
      ...job,
      isActive: true
    }))
  );

  return { seeded: true, count: jobsData.length };
};

module.exports = seedJobsIfNeeded;

