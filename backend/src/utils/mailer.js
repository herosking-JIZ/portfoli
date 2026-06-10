import nodemailer from "nodemailer";

let transporter = null;

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!smtpConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendContactMail({ name, email, message }) {
  const t = getTransporter();
  if (!t) return { sent: false, reason: "SMTP non configuré" };

  const to = process.env.CONTACT_TO || process.env.SMTP_USER;
  const safe = String(message).replace(/</g, "&lt;").replace(/\n/g, "<br>");

  await t.sendMail({
    from: `"Portfolio" <${process.env.SMTP_USER}>`,
    to,
    replyTo: email,
    subject: `📩 Nouveau message de ${name}`,
    text: `${message}\n\n— ${name} (${email})`,
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222">
      <p>${safe}</p>
      <hr style="border:none;border-top:1px solid #eee">
      <p style="color:#666"><b>${name}</b> &lt;${email}&gt;</p>
    </div>`,
  });
  return { sent: true };
}
