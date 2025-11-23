const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"QRify" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Welcome to QRify!',
    html: `
      <h1>Welcome to QRify, ${name}!</h1>
      <p>Thank you for signing up. You can now create and track QR codes with analytics.</p>
      <p>Your free plan includes:</p>
      <ul>
        <li>5 QR codes per month</li>
        <li>Basic analytics</li>
        <li>Download in PNG format</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Go to Dashboard</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Welcome email failed:', error);
  }
};

// Send subscription confirmation email
const sendSubscriptionEmail = async (email, name, plan) => {
  const transporter = createTransporter();
  
  const planFeatures = {
    pro: ['Unlimited QR codes', 'Advanced analytics', 'Custom designs', 'API access'],
    enterprise: ['Everything in Pro', 'Team collaboration', 'Custom domains', 'Priority support']
  };

  const mailOptions = {
    from: `"QRify" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `Welcome to QRify ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`,
    html: `
      <h1>Subscription Confirmed!</h1>
      <p>Hi ${name},</p>
      <p>Your ${plan} subscription is now active. You now have access to:</p>
      <ul>
        ${planFeatures[plan].map(feature => `<li>${feature}</li>`).join('')}
      </ul>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Go to Dashboard</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Subscription email failed:', error);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"QRify" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Password reset email failed:', error);
  }
};

export default {
  sendWelcomeEmail,
  sendSubscriptionEmail,
  sendPasswordResetEmail
};
