const path = require('path');
const AWS = require('aws-sdk');

const endpoint = process.env.OBJECT_STORAGE_ENDPOINT || process.env.S3_ENDPOINT;
const accessKeyId = process.env.OBJECT_STORAGE_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;
const bucket = process.env.OBJECT_STORAGE_BUCKET || process.env.S3_BUCKET;
const region = process.env.OBJECT_STORAGE_REGION || process.env.S3_REGION || 'hn';
const publicBaseUrl = process.env.OBJECT_STORAGE_PUBLIC_BASE_URL || process.env.S3_PUBLIC_BASE_URL;

const isEnabled = Boolean(endpoint && accessKeyId && secretAccessKey && bucket);

const normalizeEndpoint = (value) => {
  if (!value) return value;
  return value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://${value}`;
};

const s3 = isEnabled
  ? new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
      endpoint: normalizeEndpoint(endpoint),
      apiVersion: '2006-03-01',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    })
  : null;

const safeName = (originalName, fallbackName) => {
  const ext = path.extname(originalName || '').toLowerCase();
  const baseName = path
    .basename(originalName || '', ext)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${Date.now()}-${baseName || fallbackName}${ext}`;
};

const publicUrlFor = (key, uploadResult) => {
  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, '')}/${key}`;
  }

  if (uploadResult.Location) {
    return uploadResult.Location;
  }

  return `${normalizeEndpoint(endpoint).replace(/\/$/, '')}/${bucket}/${key}`;
};

const keyFromUrl = (url) => {
  if (!isEnabled || !url || typeof url !== 'string') {
    return null;
  }

  const normalizedEndpoint = normalizeEndpoint(endpoint).replace(/\/$/, '');
  const normalizedPublicBaseUrl = publicBaseUrl?.replace(/\/$/, '');

  if (normalizedPublicBaseUrl && url.startsWith(`${normalizedPublicBaseUrl}/`)) {
    return decodeURIComponent(url.slice(normalizedPublicBaseUrl.length + 1));
  }

  if (url.startsWith(`${normalizedEndpoint}/${bucket}/`)) {
    return decodeURIComponent(url.slice(`${normalizedEndpoint}/${bucket}/`.length));
  }

  try {
    const parsedUrl = new URL(url);
    const endpointUrl = new URL(normalizedEndpoint);

    if (parsedUrl.hostname !== endpointUrl.hostname) {
      return null;
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts[0] !== bucket || pathParts.length < 2) {
      return null;
    }

    return decodeURIComponent(pathParts.slice(1).join('/'));
  } catch (error) {
    return null;
  }
};

const uploadFile = async ({ file, folder, fallbackName, acl = 'public-read' }) => {
  if (!isEnabled || !s3) {
    throw new Error('Object storage is not configured');
  }

  const filename = safeName(file.originalname, fallbackName);
  const key = `${folder.replace(/^\/|\/$/g, '')}/${filename}`;

  const result = await s3.upload({
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: acl,
  }).promise();

  return {
    key,
    url: publicUrlFor(key, result),
  };
};

const deleteFileByUrl = async (url) => {
  if (!isEnabled || !s3) {
    return false;
  }

  const key = keyFromUrl(url);
  if (!key) {
    return false;
  }

  await s3.deleteObject({
    Bucket: bucket,
    Key: key,
  }).promise();

  return true;
};

module.exports = {
  isEnabled,
  uploadFile,
  deleteFileByUrl,
};
