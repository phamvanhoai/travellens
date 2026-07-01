const https = require('https');
const logger = require('../config/logger');
const paymentModel = require('../models/payment.model');
const bookingModel = require('../models/booking.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const API_BASE_URL = 'https://bot-api.zaloplatforms.com';

const getToken = () => process.env.ZALO_BOT_TOKEN || process.env.BOT_TOKEN || '';

const getNotifyChatIds = () => {
  const rawChatIds = process.env.ZALO_PAYMENT_NOTIFY_CHAT_IDS
    || process.env.ZALO_PAYMENT_NOTIFY_CHAT_ID
    || '';

  return rawChatIds
    .split(',')
    .map((chatId) => chatId.trim())
    .filter(Boolean);
};

const getBookingNotifyChatIds = () => {
  const rawChatIds = process.env.ZALO_BOOKING_NOTIFY_CHAT_IDS
    || process.env.ZALO_BOOKING_NOTIFY_CHAT_ID;

  if (!rawChatIds) return getNotifyChatIds();

  return rawChatIds
    .split(',')
    .map((chatId) => chatId.trim())
    .filter(Boolean);
};

const formatMoney = (amount, currency = 'VND') => {
  const numberAmount = Number(amount || 0);
  return `${numberAmount.toLocaleString('vi-VN')} ${currency || 'VND'}`;
};

const formatDateTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

const pickMessage = (payload = {}) => {
  if (payload?.result?.message) return payload.result.message;
  if (payload?.message) return payload.message;
  if (payload?.chat || payload?.from || payload?.text) return payload;
  return null;
};

const pickEventName = (payload = {}) => {
  return payload?.result?.event_name
    || payload?.event_name
    || payload?.eventName
    || null;
};

const requestJsonWithHttps = (url, payload) => new Promise((resolve, reject) => {
  const body = JSON.stringify(payload || {});
  const request = https.request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  }, (response) => {
    let responseBody = '';

    response.on('data', (chunk) => {
      responseBody += chunk;
    });

    response.on('end', () => {
      try {
        const parsedBody = responseBody ? JSON.parse(responseBody) : {};
        resolve({ status: response.statusCode, body: parsedBody });
      } catch (error) {
        reject(error);
      }
    });
  });

  request.on('error', reject);
  request.write(body);
  request.end();
});

class ZaloBotService {
  isEnabled() {
    return Boolean(getToken());
  }

  verifyWebhookSecret(headers = {}) {
    const expectedSecret = process.env.ZALO_BOT_WEBHOOK_SECRET_TOKEN;
    if (!expectedSecret) {
      return false;
    }

    return headers['x-bot-api-secret-token'] === expectedSecret;
  }

  async request(methodName, payload = {}) {
    const token = getToken();
    if (!token) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Zalo Bot token is not configured');
    }

    const url = `${API_BASE_URL}/bot${token}/${methodName}`;
    const response = typeof fetch === 'function'
      ? await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then(async (fetchResponse) => ({
          status: fetchResponse.status,
          body: await fetchResponse.json(),
        }))
      : await requestJsonWithHttps(url, payload);

    if (!response.body?.ok) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Zalo Bot API ${methodName} failed`,
        response.body
      );
    }

    return response.body.result;
  }

  sendMessage(chatId, text, options = {}) {
    return this.request('sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });
  }

  async notifyPaymentPaid(payment) {
    const chatIds = getNotifyChatIds();
    if (!this.isEnabled() || !chatIds.length || !payment) {
      return { sent: false, reason: 'Zalo payment notification is not configured' };
    }

    let notification = payment;
    try {
      notification = await paymentModel.findNotificationContext(payment.payment_id) || payment;
    } catch (error) {
      logger.error('Failed to load Zalo payment notification context', {
        payment_id: payment.payment_id,
        error: error.message,
      });
    }

    const paidAt = formatDateTime(notification.paid_at);
    const departureAt = formatDateTime(notification.departure_at);
    const message = [
      'Thanh toán thành công',
      `Mã booking: #${notification.booking_id}`,
      notification.tour_name ? `Tour: ${notification.tour_name}` : null,
      departureAt ? `Khởi hành: ${departureAt}` : null,
      notification.passenger_count !== undefined ? `Số khách: ${notification.passenger_count}` : null,
      notification.customer_name ? `Khách hàng: ${notification.customer_name}` : null,
      notification.customer_phone ? `SĐT: ${notification.customer_phone}` : null,
      `Số tiền: ${formatMoney(notification.amount, notification.currency)}`,
      `Mã thanh toán: ${notification.payment_code}`,
      notification.transaction_code ? `Mã giao dịch: ${notification.transaction_code}` : null,
      paidAt ? `Thanh toán lúc: ${paidAt}` : null,
    ].filter(Boolean).join('\n');

    const results = [];
    for (const chatId of chatIds) {
      try {
        const result = await this.sendMessage(chatId, message);
        results.push({ chat_id: chatId, success: true, result });
      } catch (error) {
        logger.error('Failed to send Zalo payment notification', {
          chat_id: chatId,
          payment_id: payment.payment_id,
          error: error.message,
          details: error.details,
        });
        results.push({ chat_id: chatId, success: false, message: error.message });
      }
    }

    return { sent: results.some((result) => result.success), results };
  }

  async notifyBookingCanceled(bookingId, options = {}) {
    const chatIds = getBookingNotifyChatIds();
    if (!this.isEnabled() || !chatIds.length || !bookingId) {
      return { sent: false, reason: 'Zalo booking notification is not configured' };
    }

    let booking;
    try {
      booking = await bookingModel.findNotificationContext(bookingId);
    } catch (error) {
      logger.error('Failed to load Zalo booking notification context', {
        booking_id: bookingId,
        error: error.message,
      });
      return { sent: false, reason: 'Booking notification context is unavailable' };
    }

    if (!booking) {
      return { sent: false, reason: 'Booking not found' };
    }

    const isPending = options.status === 'cancel_pending';
    const departureAt = formatDateTime(booking.departure_at);
    const message = [
      isPending ? 'Yêu cầu hủy booking' : 'Booking đã hủy',
      `Mã booking: #${booking.booking_id}`,
      booking.tour_name ? `Tour: ${booking.tour_name}` : null,
      departureAt ? `Khởi hành: ${departureAt}` : null,
      booking.passenger_count !== undefined ? `Số khách: ${booking.passenger_count}` : null,
      booking.customer_name ? `Khách hàng: ${booking.customer_name}` : null,
      booking.customer_phone ? `SĐT: ${booking.customer_phone}` : null,
      options.refundAmount !== undefined
        ? `Số tiền hoàn dự kiến: ${formatMoney(options.refundAmount, options.currency)}`
        : null,
      options.reason ? `Lý do: ${options.reason}` : null,
    ].filter(Boolean).join('\n');

    const results = [];
    for (const chatId of chatIds) {
      try {
        const result = await this.sendMessage(chatId, message);
        results.push({ chat_id: chatId, success: true, result });
      } catch (error) {
        logger.error('Failed to send Zalo booking notification', {
          chat_id: chatId,
          booking_id: bookingId,
          error: error.message,
          details: error.details,
        });
        results.push({ chat_id: chatId, success: false, message: error.message });
      }
    }

    return { sent: results.some((result) => result.success), results };
  }

  async notifyBookingPaymentStatus(bookingId, status) {
    const chatIds = getBookingNotifyChatIds();
    if (!this.isEnabled() || !chatIds.length || !bookingId) {
      return { sent: false, reason: 'Zalo booking notification is not configured' };
    }

    let booking;
    try {
      booking = await bookingModel.findNotificationContext(bookingId);
    } catch (error) {
      logger.error('Failed to load Zalo booking payment status context', {
        booking_id: bookingId,
        error: error.message,
      });
      return { sent: false, reason: 'Booking notification context is unavailable' };
    }

    if (!booking) return { sent: false, reason: 'Booking not found' };

    const isFree = status === 'free_confirmed';
    const departureAt = formatDateTime(booking.departure_at);
    const message = [
      isFree ? 'Booking 0 VND đã xác nhận' : 'Booking chờ duyệt thanh toán thủ công',
      `Mã booking: #${booking.booking_id}`,
      booking.tour_name ? `Tour: ${booking.tour_name}` : null,
      departureAt ? `Khởi hành: ${departureAt}` : null,
      booking.passenger_count !== undefined ? `Số khách: ${booking.passenger_count}` : null,
      booking.customer_name ? `Khách hàng: ${booking.customer_name}` : null,
      booking.customer_phone ? `SĐT: ${booking.customer_phone}` : null,
      `Số tiền: ${formatMoney(booking.final_amount)}`,
    ].filter(Boolean).join('\n');

    const results = [];
    for (const chatId of chatIds) {
      try {
        const result = await this.sendMessage(chatId, message);
        results.push({ chat_id: chatId, success: true, result });
      } catch (error) {
        logger.error('Failed to send Zalo booking payment status notification', {
          chat_id: chatId,
          booking_id: bookingId,
          error: error.message,
          details: error.details,
        });
        results.push({ chat_id: chatId, success: false, message: error.message });
      }
    }

    return { sent: results.some((result) => result.success), results };
  }

  async handleWebhook(payload, headers = {}) {
    if (!this.verifyWebhookSecret(headers)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Zalo webhook secret token');
    }

    const message = pickMessage(payload);
    const eventName = pickEventName(payload);
    const chatId = message?.chat?.id;
    const text = String(message?.text || '').trim().toLowerCase();

    logger.info('Received Zalo Bot webhook', {
      event_name: eventName,
      chat_id: chatId,
      chat_type: message?.chat?.chat_type,
      from_id: message?.from?.id,
      payload_keys: Object.keys(payload || {}),
    });

    if (chatId && (text === '/start' || text === 'chatid' || text.includes('/chatid'))) {
      await this.sendMessage(chatId, `chat_id của cuộc trò chuyện này là: ${chatId}`);
    }

    return {
      event_name: eventName,
      chat_id: chatId,
      chat_type: message?.chat?.chat_type,
    };
  }
}

module.exports = new ZaloBotService();
