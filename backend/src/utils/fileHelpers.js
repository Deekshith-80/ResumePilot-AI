const fs = require('fs');
const path = require('path');

const ensureDirSync = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const sanitizeFileName = (originalName) => {
  const baseName = path
    .basename(originalName)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');

  return `${Date.now()}-${baseName}`.toLowerCase();
};

const parseListField = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
    }
  } catch (error) {
    // Fall back to comma-separated parsing.
  }

  return trimmed
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const saveBufferToFile = async (directory, originalName, buffer) => {
  ensureDirSync(directory);
  const fileName = sanitizeFileName(originalName);
  const filePath = path.join(directory, fileName);
  await fs.promises.writeFile(filePath, buffer);
  return { fileName, filePath };
};

const deleteIfExists = async (targetPath) => {
  try {
    await fs.promises.unlink(targetPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

const buildPublicUrl = (baseUrl, relativePath) =>
  `${baseUrl.replace(/\/$/, '')}/${relativePath.replace(/^\//, '')}`;

module.exports = {
  ensureDirSync,
  sanitizeFileName,
  parseListField,
  saveBufferToFile,
  deleteIfExists,
  buildPublicUrl
};

