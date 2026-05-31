const BaseService = require('./base.service');
const paymentModel = require('../models/payment.model');
const bookingModel = require('../models/booking.model');

class PaymentService extends BaseService {
  async create(payload) {
    const payment = await this.model.create({
      ...payload,
      payment_date: payload.payment_date || new Date(),
      currency: payload.currency || 'VND',
    });

    if (payment.status === 'paid') {
      await bookingModel.update(payment.booking_id, { payment_status: 'paid', status: 'confirmed' });
    }

    return payment;
  }

  async refund(id, payload = {}) {
    const payment = await this.model.update(id, {
      status: 'refunded',
      amount: payload.amount,
      transaction_code: payload.transaction_code,
    });
    await bookingModel.update(payment.booking_id, { payment_status: 'refunded' });
    return payment;
  }

  async updateStatus(id, status) {

    const payment = await this.model.update(
      id,
      {
        status,
        payment_date: new Date(),
      }
    );

    if (status === 'paid') {

      await bookingModel.update(
        payment.booking_id,
        {
          payment_status: 'paid',
          status: 'confirmed',
        }
      );
    }

    if (status === 'refunded') {

      await bookingModel.update(
        payment.booking_id,
        {
          payment_status: 'refunded',
        }
      );
    }

    return payment;
  }
}

module.exports = new PaymentService(paymentModel);

