const axios = require("axios");
const FormData = require("form-data");
const env = require("../config/env");

const DEFAULT_TIMEOUT = 45000;
const pythonServiceUrls = [env.pythonServiceUrl];

if (env.pythonServiceUrl.includes("127.0.0.1")) {
  pythonServiceUrls.push(
    env.pythonServiceUrl.replace("127.0.0.1", "localhost"),
  );
}
if (env.pythonServiceUrl.includes("localhost")) {
  pythonServiceUrls.push(
    env.pythonServiceUrl.replace("localhost", "127.0.0.1"),
  );
}
const uniquePythonServiceUrls = [...new Set(pythonServiceUrls)];

const client = axios.create({
  timeout: DEFAULT_TIMEOUT,
  headers: {
    Accept: "application/json",
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

const requestWithFallback = async (config) => {
  let lastError = null;
  for (const baseURL of uniquePythonServiceUrls) {
    try {
      const response = await client.request({ ...config, baseURL });
      return response;
    } catch (error) {
      lastError = error;
      const retryable =
        error.code === "ECONNREFUSED" || error.code === "ENOTFOUND";
      if (
        !retryable ||
        baseURL === uniquePythonServiceUrls[uniquePythonServiceUrls.length - 1]
      ) {
        break;
      }
      console.warn(
        `[python-service] request to ${baseURL} failed, trying fallback URL.`,
        error.message,
      );
    }
  }
  throw lastError;
};

const logPythonResult = (method, route, payload, response) => {
  const summary =
    response?.data && typeof response.data === "object" ? response.data : {};
  console.info(
    `[python-service] ${method.toUpperCase()} ${route} ok`,
    JSON.stringify({
      status: response?.status,
      keys: Object.keys(summary).slice(0, 12),
      overallScore: summary.overallScore,
      predictedATSScore: summary.predictedATSScore,
      matchScore: summary.matchScore,
      analysisSource: summary.analysisSource,
    }),
  );
};

const logPythonError = (method, route, error) => {
  const details = error?.response?.data || {};
  console.error(
    `[python-service] ${method.toUpperCase()} ${route} failed`,
    JSON.stringify({
      message: error?.message,
      status: error?.response?.status,
      detail: details?.detail || details?.message || details,
      keys:
        details && typeof details === "object"
          ? Object.keys(details).slice(0, 12)
          : [],
    }),
  );
};

const postJson = async (path, data) => {
  try {
    const response = await requestWithFallback({
      method: "post",
      url: path,
      data,
    });
    logPythonResult("post", path, data, response);
    return response.data;
  } catch (error) {
    logPythonError("post", path, error);
    throw error;
  }
};

const postBinary = async (path, data) => {
  try {
    const response = await requestWithFallback({
      method: "post",
      url: path,
      data,
      responseType: "arraybuffer",
    });
    console.info(
      `[python-service] POST ${path} binary ok`,
      JSON.stringify({
        status: response?.status,
        contentType: response?.headers?.["content-type"],
        bytes: response?.data?.byteLength || response?.data?.length || 0,
      }),
    );
    return {
      buffer: Buffer.from(response.data),
      contentType: response.headers["content-type"],
      disposition: response.headers["content-disposition"],
    };
  } catch (error) {
    logPythonError("post", path, error);
    throw error;
  }
};

const postMultipart = async (path, fields, file) => {
  const form = new FormData();

  Object.entries(fields || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value),
      );
    }
  });

  if (file?.buffer) {
    form.append("file", file.buffer, {
      filename: file.filename,
      contentType: file.mimetype,
    });
  }

  try {
    const response = await requestWithFallback({
      method: "post",
      url: path,
      data: form,
      headers: form.getHeaders(),
    });
    logPythonResult("post", path, fields, response);
    return response.data;
  } catch (error) {
    logPythonError("post", path, error);
    throw error;
  }
};

module.exports = {
  postJson,
  postMultipart,
  postBinary,
};
