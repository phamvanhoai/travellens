const nodemailer = require('nodemailer');
const logger = require('../config/logger');
const userModel = require('../models/user.model');
const paymentModel = require('../models/payment.model');
const bookingModel = require('../models/booking.model');

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDateTime = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMail({ to, bcc, subject, html, text }) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP_USER and SMTP_PASS must be configured before sending email');
        }

        return this.transporter.sendMail({
            from: `"${process.env.APP_NAME || 'TravelLens'}" <${process.env.SMTP_USER}>`,
            to,
            bcc,
            subject,
            html,
            text,
        });
    }

    parseEmailList(value) {
        return String(value || '')
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean);
    }

    async getRefundNotificationRecipients() {
        const configured = this.parseEmailList(process.env.REFUND_NOTIFY_EMAILS);
        if (configured.length) {
            return configured;
        }

        const users = await userModel.findActiveStaffAndAdmins();
        return users.map((user) => user.email).filter(Boolean);
    }

    async sendBestEffort(task, logger = console) {
        try {
            return await task();
        } catch (error) {
            logger.error('Failed to send email notification:', error);
            return null;
        }
    }

    getBaseTemplate({ title, subtitle, content, footerText }) {
        const appName = process.env.APP_NAME || 'TravelLens';

        return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${title}</title>
        </head>

        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6; padding:32px 12px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(15,23,42,0.08);">

                  <tr>
                    <td style="background:linear-gradient(135deg,#2563eb,#14b8a6); padding:34px 32px; text-align:center;">
                      <div style="font-size:14px; color:#dbeafe; letter-spacing:2px; text-transform:uppercase; font-weight:700;">
                        ${appName}
                      </div>
                      <h1 style="margin:12px 0 0; color:#ffffff; font-size:28px; line-height:1.25; font-weight:800;">
                        ${title}
                      </h1>
                      <p style="margin:10px 0 0; color:#e0f2fe; font-size:15px; line-height:1.6;">
                        ${subtitle}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:34px 32px;">
                      ${content}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:22px 32px; background-color:#f8fafc; border-top:1px solid #e5e7eb;">
                      <p style="margin:0; color:#64748b; font-size:13px; line-height:1.6; text-align:center;">
                        ${footerText || `This email was sent by ${appName}. If you did not request this action, you can safely ignore this email.`}
                      </p>
                    </td>
                  </tr>

                </table>

                <p style="margin:20px 0 0; color:#94a3b8; font-size:12px; text-align:center;">
                  © ${new Date().getFullYear()} ${appName}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
    }

    async sendEmailVerification({ to, name, otp }) {
        const subject = 'Verify your TravelLens account';

        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${name}</strong>,
      </p>

      <p style="margin:0 0 22px; color:#334155; font-size:15px; line-height:1.7;">
        Thank you for creating your TravelLens account. To activate your account and start exploring travel experiences, please verify your email address using the verification code below.
      </p>

      <div style="margin:30px 0; text-align:center;">
        <div style="display:inline-block; background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; padding:18px 28px;">
          <div style="color:#64748b; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; margin-bottom:8px;">
            Verification OTP
          </div>
          <div style="color:#1d4ed8; font-size:34px; line-height:1; letter-spacing:8px; font-weight:800;">
            ${otp}
          </div>
        </div>
      </div>

      <p style="margin:22px 0 0; color:#64748b; font-size:14px; line-height:1.7;">
        This verification code is valid for <strong>15 minutes</strong>. Do not share this code with anyone.
      </p>
    `;

        const html = this.getBaseTemplate({
            title: 'Verify your email',
            subtitle: 'Use this secure code to activate your TravelLens account.',
            content,
            footerText: 'If you did not create a TravelLens account, please ignore this email.',
        });

        const text = `Hi ${name}, verify your TravelLens account with code: ${otp}`;

        return this.sendMail({
            to,
            subject,
            html,
            text,
        });
    }

    async sendPasswordResetCode({ to, name, code }) {
        const subject = 'Your TravelLens password reset code';

        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${name}</strong>,
      </p>

      <p style="margin:0 0 22px; color:#334155; font-size:15px; line-height:1.7;">
        We received a request to reset your TravelLens password. Use the verification code below to continue.
      </p>

      <div style="margin:30px 0; text-align:center;">
        <div style="display:inline-block; background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; padding:18px 28px;">
          <div style="color:#64748b; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; margin-bottom:8px;">
            Verification Code
          </div>
          <div style="color:#1d4ed8; font-size:34px; line-height:1; letter-spacing:8px; font-weight:800;">
            ${code}
          </div>
        </div>
      </div>

      <p style="margin:0 0 12px; color:#334155; font-size:15px; line-height:1.7;">
        This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
      </p>

      <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:12px; padding:14px; margin-top:22px;">
        <p style="margin:0; color:#9a3412; font-size:14px; line-height:1.6;">
          If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
        </p>
      </div>
    `;

        const html = this.getBaseTemplate({
            title: 'Reset your password',
            subtitle: 'Use this secure code to continue your password reset.',
            content,
            footerText: 'For your security, this password reset code will expire shortly.',
        });

        const text = `Hi ${name}, your TravelLens password reset code is: ${code}. This code expires in 10 minutes.`;

        return this.sendMail({
            to,
            subject,
            html,
            text,
        });
    }

    async sendAdminCreatedAccount({ to, name, password, isTemporaryPassword }) {
        const subject = 'Your TravelLens account has been created';
        const passwordLabel = isTemporaryPassword ? 'Temporary Password' : 'Password';
        const safeName = escapeHtml(name);
        const safePassword = escapeHtml(password);

        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${safeName}</strong>,
      </p>

      <p style="margin:0 0 22px; color:#334155; font-size:15px; line-height:1.7;">
        An administrator has created a TravelLens account for you. You can sign in using the password below.
      </p>

      <div style="margin:30px 0; text-align:center;">
        <div style="display:inline-block; background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; padding:18px 28px;">
          <div style="color:#64748b; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; margin-bottom:8px;">
            ${passwordLabel}
          </div>
          <div style="color:#1d4ed8; font-size:24px; line-height:1.3; font-weight:800;">
            ${safePassword}
          </div>
        </div>
      </div>

      <p style="margin:22px 0 0; color:#64748b; font-size:14px; line-height:1.7;">
        ${isTemporaryPassword ? 'Please change this temporary password after signing in.' : 'Please keep this password secure.'}
      </p>
    `;

        const html = this.getBaseTemplate({
            title: 'Your account is ready',
            subtitle: 'Use the password below to sign in to TravelLens.',
            content,
            footerText: 'If you did not expect this account, please contact the administrator.',
        });

        const text = `Hi ${name}, your TravelLens account has been created. ${passwordLabel}: ${password}`;

        return this.sendMail({
            to,
            subject,
            html,
            text,
        });
    }

    async sendPaymentPaid(payment) {
        if (!payment?.payment_id) return null;

        const notification = await paymentModel.findNotificationContext(payment.payment_id);
        if (!notification?.customer_email) return null;

        const amount = Number(notification.amount || 0).toLocaleString('vi-VN');
        const currency = notification.currency || 'VND';
        const paidAt = formatDateTime(notification.paid_at);
        const departureAt = formatDateTime(notification.departure_at);
        const subject = `Payment confirmed for booking #${notification.booking_id}`;
        const safeName = escapeHtml(notification.customer_name || 'Customer');

        const details = [
            ['Booking', `#${notification.booking_id}`],
            ['Tour', notification.tour_name],
            ['Departure', departureAt],
            ['Passengers', notification.passenger_count],
            ['Payment code', notification.payment_code],
            ['Amount', `${amount} ${currency}`],
            ['Transaction code', notification.transaction_code],
            ['Paid at', paidAt],
        ].filter(([, value]) => value);

        const detailRows = details.map(([label, value]) => `
          <tr>
            <td style="padding:8px 12px; color:#64748b; border-bottom:1px solid #e5e7eb;">${escapeHtml(label)}</td>
            <td style="padding:8px 12px; color:#0f172a; font-weight:600; border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td>
          </tr>
        `).join('');

        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${safeName}</strong>,
      </p>
      <p style="margin:0 0 20px; color:#334155; font-size:15px; line-height:1.7;">
        Your payment was successful and your booking has been confirmed.
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb; border-radius:8px; border-collapse:separate; overflow:hidden;">
        ${detailRows}
      </table>
    `;

        const html = this.getBaseTemplate({
            title: 'Payment successful',
            subtitle: `Booking #${notification.booking_id} is confirmed.`,
            content,
            footerText: 'Please keep this email as your payment confirmation.',
        });
        const text = `Hi ${notification.customer_name || 'Customer'}, payment for booking #${notification.booking_id} was successful. Payment code: ${notification.payment_code}. Amount: ${amount} ${currency}.${notification.tour_name ? ` Tour: ${notification.tour_name}.` : ''}`;

        return this.sendMail({
            to: notification.customer_email,
            subject,
            html,
            text,
        });
    }

    async sendBookingPaymentStatus({ bookingId, status }) {
        const booking = await bookingModel.findNotificationContext(bookingId);
        if (!booking?.customer_email) {
            logger.warn('Skipped booking payment status email because customer email is missing', {
                booking_id: bookingId,
                status,
            });
            return null;
        }

        const isFree = status === 'free_confirmed';
        const safeName = escapeHtml(booking.customer_name || 'Customer');
        const departureAt = formatDateTime(booking.departure_at);
        const amount = `${Number(booking.final_amount || 0).toLocaleString('vi-VN')} VND`;
        const title = isFree ? 'Booking confirmed' : 'Waiting for payment confirmation';
        const subject = isFree
            ? `Booking #${booking.booking_id} confirmed`
            : `Booking #${booking.booking_id} is waiting for confirmation`;
        const message = isFree
            ? 'Your booking costs 0 VND, so it has been confirmed automatically. No payment is required.'
            : 'Your booking amount requires manual confirmation. Our staff will review it and notify you when it is confirmed.';

        const details = [
            ['Booking', `#${booking.booking_id}`],
            ['Tour', booking.tour_name || 'Tour'],
            ['Departure', departureAt],
            ['Passengers', booking.passenger_count],
            ['Amount', amount],
        ].filter(([, value]) => value !== null && value !== undefined);
        const detailRows = details.map(([label, value]) => `
          <tr>
            <td style="padding:8px 12px; color:#64748b; border-bottom:1px solid #e5e7eb;">${escapeHtml(label)}</td>
            <td style="padding:8px 12px; color:#0f172a; font-weight:600; border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td>
          </tr>
        `).join('');

        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${safeName}</strong>,
      </p>
      <p style="margin:0 0 18px; color:#334155; font-size:15px; line-height:1.7;">
        ${message}
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb; border-radius:8px; border-collapse:separate; overflow:hidden;">
        ${detailRows}
      </table>
    `;

        const html = this.getBaseTemplate({
            title,
            subtitle: `Booking #${booking.booking_id}`,
            content,
        });
        const text = `Hi ${booking.customer_name || 'Customer'}, ${message} Booking #${booking.booking_id}, tour: ${booking.tour_name || 'Tour'}, departure: ${departureAt || 'not specified'}, passengers: ${booking.passenger_count || 0}, amount: ${amount}.`;

        return this.sendMail({
            to: booking.customer_email,
            subject,
            html,
            text,
        });
    }

    async sendCancellationRequested({ booking, refundRequest }) {
        if (!booking?.customer_email) return null;

        const amount = Number(refundRequest.refund_amount || 0).toLocaleString('vi-VN');
        const departureAt = formatDateTime(booking.departure_at);
        const subject = `Cancellation request received for booking #${booking.booking_id}`;
        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${escapeHtml(booking.customer_name || 'Customer')}</strong>,
      </p>
      <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.7;">
        We received your cancellation request. Your booking is waiting for staff review and is not canceled yet.
      </p>
      <ul style="margin:0; padding-left:18px; color:#334155; font-size:15px; line-height:1.8;">
        <li>Booking: <strong>#${booking.booking_id}</strong></li>
        ${booking.tour_name ? `<li>Tour: <strong>${escapeHtml(booking.tour_name)}</strong></li>` : ''}
        ${departureAt ? `<li>Departure: <strong>${escapeHtml(departureAt)}</strong></li>` : ''}
        <li>Expected refund: <strong>${amount} VND</strong></li>
        ${refundRequest.reason ? `<li>Reason: <strong>${escapeHtml(refundRequest.reason)}</strong></li>` : ''}
      </ul>
    `;
        const html = this.getBaseTemplate({
            title: 'Cancellation request received',
            subtitle: `Booking #${booking.booking_id} is waiting for review.`,
            content,
        });
        const text = `Hi ${booking.customer_name || 'Customer'}, we received your cancellation request for booking #${booking.booking_id}. It is waiting for staff review and is not canceled yet. Expected refund: ${amount} VND.`;

        return this.sendMail({
            to: booking.customer_email,
            subject,
            html,
            text,
        });
    }

    async sendBookingCanceled({ to, name, booking, refundRequest }) {
        const subject = `Booking #${booking.booking_id} has been canceled`;
        const safeName = escapeHtml(name || 'Customer');
        const refundText = refundRequest
            ? `A manual refund request for ${Number(refundRequest.refund_amount || 0).toLocaleString('vi-VN')} VND has been created and is waiting for staff processing.`
            : 'No manual refund is required for this cancellation.';
        const departureAt = formatDateTime(booking.departure_at);
        const reason = booking.cancel_reason || refundRequest?.reason;

        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${safeName}</strong>,
      </p>
      <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.7;">
        Your booking <strong>#${booking.booking_id}</strong> has been canceled.
      </p>
      <p style="margin:0; color:#334155; font-size:15px; line-height:1.7;">
        ${escapeHtml(refundText)}
      </p>
      <ul style="margin:16px 0 0; padding-left:18px; color:#334155; font-size:15px; line-height:1.8;">
        ${booking.tour_name ? `<li>Tour: <strong>${escapeHtml(booking.tour_name)}</strong></li>` : ''}
        ${departureAt ? `<li>Departure: <strong>${escapeHtml(departureAt)}</strong></li>` : ''}
        ${reason ? `<li>Reason: <strong>${escapeHtml(reason)}</strong></li>` : ''}
      </ul>
    `;

        const html = this.getBaseTemplate({
            title: 'Booking canceled',
            subtitle: `Booking #${booking.booking_id}`,
            content,
        });

        const text = `Hi ${name || 'Customer'}, booking #${booking.booking_id} has been canceled. ${refundText}${booking.tour_name ? ` Tour: ${booking.tour_name}.` : ''}${departureAt ? ` Departure: ${departureAt}.` : ''}${reason ? ` Reason: ${reason}.` : ''}`;

        return this.sendMail({ to, subject, html, text });
    }

    async sendRefundRequestCreated({ recipients, booking, refundRequest }) {
        const emails = recipients || await this.getRefundNotificationRecipients();
        if (!emails.length) return null;

        const subject = `New manual refund request for booking #${booking.booking_id}`;
        const departureAt = formatDateTime(booking.departure_at);
        const content = `
      <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.7;">
        A paid booking was canceled and needs manual refund processing.
      </p>
      <ul style="margin:0; padding-left:18px; color:#334155; font-size:15px; line-height:1.8;">
        <li>Booking ID: <strong>#${booking.booking_id}</strong></li>
        <li>Refund request ID: <strong>#${refundRequest.refund_request_id}</strong></li>
        ${booking.tour_name ? `<li>Tour: <strong>${escapeHtml(booking.tour_name)}</strong></li>` : ''}
        ${departureAt ? `<li>Departure: <strong>${escapeHtml(departureAt)}</strong></li>` : ''}
        ${booking.customer_name ? `<li>Customer: <strong>${escapeHtml(booking.customer_name)}</strong></li>` : ''}
        ${booking.customer_phone ? `<li>Phone: <strong>${escapeHtml(booking.customer_phone)}</strong></li>` : ''}
        <li>Refund amount: <strong>${Number(refundRequest.refund_amount || 0).toLocaleString('vi-VN')} VND</strong></li>
        ${refundRequest.reason ? `<li>Reason: <strong>${escapeHtml(refundRequest.reason)}</strong></li>` : ''}
      </ul>
    `;

        const html = this.getBaseTemplate({
            title: 'Manual refund needed',
            subtitle: 'A paid booking cancellation is waiting for staff action.',
            content,
        });

        const text = `Manual refund needed for booking #${booking.booking_id}. Refund request #${refundRequest.refund_request_id}, amount ${refundRequest.refund_amount} VND.`;

        return this.sendMail({
            to: process.env.SMTP_USER,
            bcc: emails,
            subject,
            html,
            text,
        });
    }

    async sendRefundCompleted({ to, name, booking, refundRequest }) {
        const subject = `Refund completed for booking #${booking.booking_id}`;
        const safeName = escapeHtml(name || 'Customer');
        const amount = Number(refundRequest.refund_amount || 0).toLocaleString('vi-VN');

        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${safeName}</strong>,
      </p>
      <p style="margin:0; color:#334155; font-size:15px; line-height:1.7;">
        Your manual refund for booking <strong>#${booking.booking_id}</strong> has been completed.
        Refund amount: <strong>${amount} VND</strong>.
      </p>
    `;

        const html = this.getBaseTemplate({
            title: 'Refund completed',
            subtitle: `Booking #${booking.booking_id}`,
            content,
        });

        const text = `Hi ${name || 'Customer'}, your refund for booking #${booking.booking_id} has been completed. Refund amount: ${amount} VND.`;

        return this.sendMail({ to, subject, html, text });
    }

    async sendRefundRejected({ to, name, booking, refundRequest }) {
        const subject = `Cancellation request rejected for booking #${booking.booking_id}`;
        const safeName = escapeHtml(name || 'Customer');
        const staffNote = refundRequest.staff_note
            ? `<p style="margin:16px 0 0; color:#334155; font-size:15px; line-height:1.7;">
        Staff note: <strong>${escapeHtml(refundRequest.staff_note)}</strong>
      </p>`
            : '';

        const content = `
      <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.7;">
        Hi <strong>${safeName}</strong>,
      </p>
      <p style="margin:0; color:#334155; font-size:15px; line-height:1.7;">
        Your cancellation/refund request for booking <strong>#${booking.booking_id}</strong> has been rejected.
        Your booking remains confirmed.
      </p>
      ${staffNote}
    `;

        const html = this.getBaseTemplate({
            title: 'Cancellation request rejected',
            subtitle: `Booking #${booking.booking_id}`,
            content,
        });

        const text = `Hi ${name || 'Customer'}, your cancellation/refund request for booking #${booking.booking_id} has been rejected. Your booking remains confirmed.${refundRequest.staff_note ? ` Staff note: ${refundRequest.staff_note}` : ''}`;

        return this.sendMail({ to, subject, html, text });
    }

    async verifyConnection() {
        return this.transporter.verify();
    }
}

module.exports = new EmailService();
