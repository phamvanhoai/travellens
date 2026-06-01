const crypto = require('crypto');

const prefix = process.env.PAYMENT_CODE_PREFIX || 'TVL';

const normalizeAuthorization = (value = '') => value.trim();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractPaymentCode = (payload = {}) => {
  const candidates = [payload.code, payload.content, payload.transferContent]
    .filter(Boolean)
    .map((value) => String(value).toUpperCase());
  const pattern = new RegExp(`${escapeRegex(prefix)}[A-Z0-9]+`, 'i');

  for (const candidate of candidates) {
    const match = candidate.match(pattern);
    if (match) {
      return match[0].toUpperCase();
    }
  }

  return null;
};

module.exports = {
  verifyApiKey(headers = {}) {
    const expected = process.env.SEPAY_WEBHOOK_API_KEY;
    if (!expected) {
      return process.env.NODE_ENV !== 'production';
    }

    const authorization = normalizeAuthorization(headers.authorization || headers.Authorization);
    const expectedHeader = `Apikey ${expected}`;

    const left = Buffer.from(authorization);
    const right = Buffer.from(expectedHeader);
    return left.length === right.length && crypto.timingSafeEqual(left, right);
  },

  extractPaymentCode,
};
