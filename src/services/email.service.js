const nodemailer = require('nodemailer');

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

    async sendMail({ to, subject, html, text }) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP_USER and SMTP_PASS must be configured before sending email');
        }

        return this.transporter.sendMail({
            from: `"${process.env.APP_NAME || 'TravelLens'}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            text,
        });
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

    async verifyConnection() {
        return this.transporter.verify();
    }
}

module.exports = new EmailService();