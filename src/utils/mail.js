import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransport() {
  if (!env.smtpHost || !env.adminNotifyEmail) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth:
        env.smtpUser && env.smtpPass
          ? { user: env.smtpUser, pass: env.smtpPass }
          : undefined,
    });
  }
  return transporter;
}

/**
 * @param {{ subject: string; text: string; html?: string }} opts
 */
export async function notifyAdmin(opts) {
  const transport = getTransport();
  if (!transport || !env.adminNotifyEmail) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[notify] Skipping email (set SMTP_HOST + ADMIN_NOTIFY_EMAIL)");
    }
    return;
  }
  const from = env.smtpFrom || env.smtpUser || env.adminNotifyEmail;
  await transport.sendMail({
    from,
    to: env.adminNotifyEmail,
    subject: opts.subject,
    text: opts.text,
    html: opts.html || opts.text.replace(/\n/g, "<br/>"),
  });
}
