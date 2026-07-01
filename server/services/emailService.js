const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

// Generic send email
exports.sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Priyansh Rajput" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
  return info;
};

// Contact form notification email to admin
exports.sendContactNotification = async (contact) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; padding: 30px; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="color: #00d4ff; margin-bottom: 20px;">📬 New Contact Message</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; color: #94a3b8; width: 140px;">Name:</td><td style="padding: 8px; color: #e2e8f0;"><strong>${contact.name}</strong></td></tr>
        <tr><td style="padding: 8px; color: #94a3b8;">Email:</td><td style="padding: 8px; color: #00d4ff;"><a href="mailto:${contact.email}" style="color:#00d4ff;">${contact.email}</a></td></tr>
        ${contact.phone ? `<tr><td style="padding: 8px; color: #94a3b8;">Phone:</td><td style="padding: 8px;">${contact.phone}</td></tr>` : ''}
        <tr><td style="padding: 8px; color: #94a3b8;">Subject:</td><td style="padding: 8px;">${contact.subject}</td></tr>
        ${contact.projectType ? `<tr><td style="padding: 8px; color: #94a3b8;">Project Type:</td><td style="padding: 8px;">${contact.projectType}</td></tr>` : ''}
        ${contact.budget ? `<tr><td style="padding: 8px; color: #94a3b8;">Budget:</td><td style="padding: 8px;">${contact.budget}</td></tr>` : ''}
        ${contact.timeline ? `<tr><td style="padding: 8px; color: #94a3b8;">Timeline:</td><td style="padding: 8px;">${contact.timeline}</td></tr>` : ''}
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #1e293b; border-radius: 8px; border-left: 4px solid #00d4ff;">
        <p style="color: #94a3b8; margin: 0 0 8px;">Message:</p>
        <p style="color: #e2e8f0; margin: 0;">${contact.message}</p>
      </div>
      <p style="color: #475569; font-size: 12px; margin-top: 20px;">Received: ${new Date().toLocaleString()}</p>
    </div>
  `;

  return exports.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `📬 New Contact: ${contact.subject}`,
    html,
    text: `New contact from ${contact.name} (${contact.email}): ${contact.message}`,
  });
};

// Hire request notification email
exports.sendHireNotification = async (hire) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; padding: 30px; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="color: #a855f7; margin-bottom: 20px;">🚀 New Hire Request!</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; color: #94a3b8; width: 140px;">Name:</td><td style="padding: 8px;"><strong>${hire.name}</strong></td></tr>
        <tr><td style="padding: 8px; color: #94a3b8;">Email:</td><td style="padding: 8px; color: #a855f7;"><a href="mailto:${hire.email}" style="color:#a855f7;">${hire.email}</a></td></tr>
        ${hire.phone ? `<tr><td style="padding: 8px; color: #94a3b8;">Phone:</td><td style="padding: 8px;">${hire.phone}</td></tr>` : ''}
        ${hire.company ? `<tr><td style="padding: 8px; color: #94a3b8;">Company:</td><td style="padding: 8px;">${hire.company}</td></tr>` : ''}
        <tr><td style="padding: 8px; color: #94a3b8;">Project Type:</td><td style="padding: 8px;">${hire.projectType}</td></tr>
        <tr><td style="padding: 8px; color: #94a3b8;">Budget:</td><td style="padding: 8px; color: #22c55e;">${hire.budget}</td></tr>
        <tr><td style="padding: 8px; color: #94a3b8;">Timeline:</td><td style="padding: 8px;">${hire.timeline}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #1e293b; border-radius: 8px; border-left: 4px solid #a855f7;">
        <p style="color: #94a3b8; margin: 0 0 8px;">Message:</p>
        <p style="color: #e2e8f0; margin: 0;">${hire.message}</p>
      </div>
      <p style="color: #475569; font-size: 12px; margin-top: 20px;">Received: ${new Date().toLocaleString()}</p>
    </div>
  `;

  return exports.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🚀 Hire Request from ${hire.name}`,
    html,
    text: `Hire request from ${hire.name} (${hire.email}) - Budget: ${hire.budget}, Timeline: ${hire.timeline}`,
  });
};

// Auto-reply to sender
exports.sendAutoReply = async ({ name, email, subject }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; padding: 30px; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="color: #00d4ff; margin-bottom: 10px;">Thanks for reaching out, ${name}! 👋</h2>
      <p style="color: #94a3b8;">I've received your message regarding "<strong style="color:#e2e8f0;">${subject}</strong>" and will get back to you within <strong style="color:#00d4ff;">24–48 hours</strong>.</p>
      <p style="color: #94a3b8;">In the meantime, feel free to check out my <a href="https://github.com/priyanshrajput" style="color:#00d4ff;">GitHub</a> or <a href="https://linkedin.com/in/priyanshrajput" style="color:#00d4ff;">LinkedIn</a>.</p>
      <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 8px; border-top: 2px solid #00d4ff;">
        <p style="margin: 0; color: #e2e8f0;"><strong>Priyansh Rajput</strong></p>
        <p style="margin: 4px 0; color: #94a3b8; font-size: 14px;">Full Stack MERN Developer</p>
        <p style="margin: 4px 0; color: #00d4ff; font-size: 14px;">priyanshrajput@gmail.com</p>
      </div>
    </div>
  `;

  return exports.sendEmail({
    to: email,
    subject: `✅ Got your message — I'll be in touch soon!`,
    html,
    text: `Hi ${name}, I received your message and will reply within 24-48 hours. - Priyansh Rajput`,
  });
};
