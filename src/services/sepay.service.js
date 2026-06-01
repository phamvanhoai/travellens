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

const buildQrUrl = ({ amount, transfer_content: transferContent } = {}) => {
  const account = process.env.SEPAY_BANK_ACCOUNT;
  const bank = process.env.SEPAY_BANK_NAME;

  if (!account || !bank || amount === undefined || !transferContent) {
    return null;
  }

  const params = new URLSearchParams({
    acc: account,
    bank,
    amount: String(amount),
    des: transferContent,
  });

  return `https://qr.sepay.vn/img?${params.toString()}`;
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
  buildQrUrl,
};
