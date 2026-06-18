import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiArrowRight,
  FiLayers,
  FiTarget,
  FiUpload,
} from "react-icons/fi";
import SectionHeading from "../components/cards/SectionHeading";
import Button from "../components/buttons/Button";
import Textarea from "../components/forms/Textarea";
import Spinner from "../components/loaders/Spinner";
import {
  uploadResume,
  analyzeResume,
  optimizeResume,
} from "../features/resume/resumeSlice";

const clamp = (value) => Math.max(0, Math.min(100, Number(value || 0)));

const ScoreRing = ({ value, label, accent = "#10b981" }) => {
  const score = clamp(value);
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{score}%</p>
        </div>
        <div
          className="grid h-16 w-16 place-items-center rounded-full text-sm font-bold text-slate-900"
          style={{
            background: `conic-gradient(${accent} ${score}%, #e2e8f0 0)`,
          }}
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white">
            {score}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeAnalyzerPage = () => {
  const dispatch = useDispatch();
  const { uploadedResume, atsResult, optimizationResult, loading, error } =
    useSelector((state) => state.resume);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewMode, setPreviewMode] = useState("pdf");
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(uploadedResume?.fileUrl || "");
      setPreviewMode(
        uploadedResume?.fileType?.includes("wordprocessingml") ? "docx" : "pdf",
      );
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setPreviewMode(selectedFile.type.includes("pdf") ? "pdf" : "docx");

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, uploadedResume]);

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles?.[0] || null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const buildFormData = (fileOverride = selectedFile) => {
    const formData = new FormData();
    if (fileOverride) {
      formData.append("resume", fileOverride);
    } else if (uploadedResume?._id) {
      formData.append("resumeId", uploadedResume._id);
    }
    formData.append("jobDescription", jobDescription || "");
    return formData;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await dispatch(uploadResume(buildFormData()));
  };

  const handleAnalyze = async () => {
    await dispatch(analyzeResume(buildFormData()));
  };

  const handleOptimize = async () => {
    await dispatch(optimizeResume(buildFormData()));
  };

  const analysis = atsResult || uploadedResume?.analysisMetadata || null;

  const scoreItems = useMemo(() => {
    if (!analysis) return [];
    return [
      { label: "Overall", value: analysis.overallScore, accent: "#10b981" },
      { label: "Keyword", value: analysis.keywordScore, accent: "#14b8a6" },
      { label: "Skills", value: analysis.skillsScore, accent: "#0ea5e9" },
      {
        label: "Experience",
        value: analysis.experienceScore,
        accent: "#8b5cf6",
      },
      {
        label: "Formatting",
        value: analysis.formattingScore,
        accent: "#f59e0b",
      },
      { label: "Projects", value: analysis.projectScore, accent: "#ef4444" },
    ];
  }, [analysis]);

  const previewSource = previewUrl || uploadedResume?.fileUrl || "";
  const previewText = selectedFile
    ? selectedFile.name
    : uploadedResume?.fileName || "No resume selected yet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <SectionHeading
        eyebrow="Resume Analyzer"
        title="Upload, scan, and optimize your resume"
        description="Upload a resume, preview it professionally, run ATS scanning, and get AI-powered optimization suggestions."
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div
              {...getRootProps()}
              className={`rounded-[1.7rem] border-2 border-dashed p-8 text-center transition ${
                isDragActive
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-600">
                <FiUpload />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                {selectedFile
                  ? selectedFile.name
                  : "Drop a PDF or DOCX resume here"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Upload your resume to preview it and run the ATS scan.
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              <Textarea
                label="Target Job Description (optional)"
                placeholder="Paste the role or job description to improve scan relevance."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                type="button"
                className="gap-2"
                onClick={handleUpload}
                disabled={!selectedFile || loading}
              >
                <FiUpload /> Upload
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="gap-2"
                onClick={handleAnalyze}
                disabled={loading || (!selectedFile && !uploadedResume)}
              >
                <FiTarget /> Scan Resume
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="gap-2"
                onClick={handleOptimize}
                disabled={loading || (!selectedFile && !uploadedResume)}
              >
                <FiLayers /> Optimize Resume
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="section-label">Preview</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              {previewText}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode("pdf")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${previewMode === "pdf" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("docx")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${previewMode === "docx" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                DOCX
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
              {previewSource && previewMode === "pdf" ? (
                <iframe
                  title="Resume preview"
                  src={previewSource}
                  className="h-[340px] w-full"
                />
              ) : (
                <div className="flex h-[340px] items-center justify-center p-6 text-center text-sm text-slate-500">
                  <div>
                    <FiAlertCircle className="mx-auto text-2xl text-emerald-500" />
                    <p className="mt-3">
                      {selectedFile?.type?.includes("wordprocessingml") ||
                      uploadedResume?.fileType?.includes("wordprocessingml")
                        ? "DOCX previews show the uploaded file name and extracted text."
                        : "Upload a PDF to render the preview here."}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {uploadedResume?.rawText
                        ? uploadedResume.rawText.slice(0, 220)
                        : "The ATS scan works even when preview support is limited."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-label">ATS Results</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">
                  Score breakdown
                </h3>
              </div>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={handleAnalyze}
                disabled={loading}
              >
                Re-run Scan <FiArrowRight />
              </Button>
            </div>

            {loading && !analysis ? (
              <div className="mt-6">
                <Spinner label="Analyzing resume..." />
              </div>
            ) : scoreItems.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {scoreItems.map((item) => (
                  <ScoreRing
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    accent={item.accent}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                Upload a resume and run the scan to see ATS scoring and
                suggestions.
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="section-label">Optimization</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              AI suggestions
            </h3>
            {optimizationResult?.optimizedResume ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Predicted ATS score
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-700">
                    {optimizationResult.predictedATSScore || 0}%
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Original resume snapshot
                    </p>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {analysis?.rawText?.slice(0, 1200) ||
                        "Original resume text unavailable."}
                    </pre>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Suggested optimization
                    </p>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {optimizationResult.optimizedResume}
                    </pre>
                  </div>
                </div>
                {optimizationResult.improvements?.length ? (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Improvements</p>
                    <ul className="mt-3 space-y-2">
                      {optimizationResult.improvements.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Run the optimizer to get actionable resume rewriting
                suggestions.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeAnalyzerPage;
