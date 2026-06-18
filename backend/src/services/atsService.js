const pythonService = require("./pythonService");
const env = require("../config/env");

const summarizeAnalysis = (analysis = {}) => ({
  overallScore:
    analysis.overallScore ??
    analysis.predictedATSScore ??
    analysis.matchScore ??
    0,
  keywordScore: analysis.keywordScore ?? 0,
  skillsScore: analysis.skillsScore ?? 0,
  experienceScore: analysis.experienceScore ?? 0,
  formattingScore: analysis.formattingScore ?? 0,
  projectScore: analysis.projectScore ?? 0,
  missingKeywords: analysis.missingKeywords || [],
  strengths: analysis.strengths || [],
  weaknesses: analysis.weaknesses || [],
  suggestions: analysis.suggestions || [],
  jobMatch: analysis.jobMatch || null,
});

const analyzeResumeBuffer = async ({
  buffer,
  filename,
  mimetype,
  jobDescription = "",
  targetRole = "",
}) => {
  try {
    const analysis = await pythonService.postMultipart(
      "/analyze",
      {
        job_description: jobDescription,
        target_role: targetRole,
      },
      {
        buffer,
        filename,
        mimetype,
      },
    );

    console.info(
      "[ats-service] analysis complete",
      JSON.stringify({
        filename,
        overallScore: analysis.overallScore,
        keywordScore: analysis.keywordScore,
        skillsScore: analysis.skillsScore,
        missingKeywords: analysis.missingKeywords?.slice?.(0, 8) || [],
        analysisSource: analysis.analysisSource,
      }),
    );

    return {
      ...analysis,
      ...summarizeAnalysis(analysis),
      analysisSource: analysis.analysisSource || "python",
    };
  } catch (error) {
    if (
      error?.code === "ECONNREFUSED" ||
      error?.code === "ENOTFOUND" ||
      error?.message?.includes("connect ECONNREFUSED")
    ) {
      error.message = `Unable to reach the Python ATS service at ${env.pythonServiceUrl}. Start it from the backend/python-service folder and try again.`;
    }
    console.error(
      "[ats-service] analysis failed",
      JSON.stringify({
        filename,
        message: error?.message,
        status: error?.response?.status,
        detail:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          null,
      }),
    );
    throw error;
  }
};

const analyzeResumeFile = async ({
  filePath,
  filename,
  mimetype,
  jobDescription = "",
  targetRole = "",
}) => {
  const fs = require("fs");
  const buffer = await fs.promises.readFile(filePath);
  return analyzeResumeBuffer({
    buffer,
    filename,
    mimetype,
    jobDescription,
    targetRole,
  });
};

const optimizeResumeBuffer = async ({
  buffer,
  filename,
  mimetype,
  jobDescription = "",
  targetRole = "",
}) => {
  try {
    const optimized = await pythonService.postMultipart(
      "/optimize",
      {
        job_description: jobDescription,
        target_role: targetRole,
      },
      {
        buffer,
        filename,
        mimetype,
      },
    );

    console.info(
      "[ats-service] optimization complete",
      JSON.stringify({
        filename,
        predictedATSScore: optimized.predictedATSScore,
        missingKeywords: optimized.missingKeywords?.slice?.(0, 8) || [],
        analysisSource: optimized.analysisSource,
      }),
    );

    return {
      ...optimized,
      analysisSource: optimized.analysisSource || "python",
    };
  } catch (error) {
    if (
      error?.code === "ECONNREFUSED" ||
      error?.code === "ENOTFOUND" ||
      error?.message?.includes("connect ECONNREFUSED")
    ) {
      error.message = `Unable to reach the Python ATS service at ${env.pythonServiceUrl}. Start it from the backend/python-service folder and try again.`;
    }
    console.error(
      "[ats-service] optimization failed",
      JSON.stringify({
        filename,
        message: error?.message,
        status: error?.response?.status,
        detail:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          null,
      }),
    );
    throw error;
  }
};

const optimizeResumeFile = async (payload) => {
  const fs = require("fs");
  const buffer = await fs.promises.readFile(payload.filePath);
  return optimizeResumeBuffer({ ...payload, buffer });
};

const generateCoverLetter = async ({
  resumeSummary = "",
  jobTitle = "",
  companyName = "",
  jobDescription = "",
  skills = [],
  experience = [],
}) => {
  try {
    const generated = await pythonService.postJson("/generate-cover-letter", {
      resume_summary: resumeSummary,
      job_title: jobTitle,
      company_name: companyName,
      job_description: jobDescription,
      skills,
      experience,
    });

    console.info(
      "[ats-service] cover letter generated",
      JSON.stringify({
        jobTitle,
        companyName,
        analysisSource: generated.analysisSource,
        tone: generated.tone,
      }),
    );

    return {
      ...generated,
      analysisSource: generated.analysisSource || "python",
    };
  } catch (error) {
    console.error(
      "[ats-service] cover letter failed",
      JSON.stringify({
        jobTitle,
        companyName,
        message: error?.message,
        status: error?.response?.status,
        detail:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          null,
      }),
    );
    throw error;
  }
};

const matchJob = async (payload) => {
  try {
    return await pythonService.postJson("/match-job", payload);
  } catch (error) {
    console.error(
      "[ats-service] job match failed",
      JSON.stringify({
        message: error?.message,
        status: error?.response?.status,
        detail:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          null,
      }),
    );
    throw error;
  }
};

const exportDocument = async (payload) => {
  try {
    return await pythonService.postBinary("/export", payload);
  } catch (error) {
    console.error(
      "[ats-service] export failed",
      JSON.stringify({
        message: error?.message,
        status: error?.response?.status,
        detail:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          null,
      }),
    );
    throw error;
  }
};

module.exports = {
  analyzeResumeBuffer,
  analyzeResumeFile,
  optimizeResumeBuffer,
  optimizeResumeFile,
  generateCoverLetter,
  matchJob,
  exportDocument,
};
