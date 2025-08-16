const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // 465 ke liye true, 587 ke liye false
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send summary via email
router.post('/send', async (req, res) => {
  try {
    const { recipients, subject, summary, senderName } = req.body;

    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'At least one recipient email is required' });
    }
    if (!summary || !summary.trim()) {
      return res.status(400).json({ error: 'Summary content is required' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: 'Email subject is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({ error: `Invalid email format: ${invalidEmails.join(', ')}` });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Meeting Summary</h2>
        <p><strong>From:</strong> ${senderName || 'Meeting Notes Summarizer'}</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          ${summary.replace(/\n/g, '<br>')}
        </div>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This summary was generated using AI-powered meeting notes summarizer.
        </p>
      </div>
    `;

    // Send email to all recipients
    const emailPromises = recipients.map(recipient => {
      const mailOptions = {
        from: `"${senderName || 'Meeting Notes Summarizer'}" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: subject,
        html: emailContent,
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `Summary sent successfully to ${recipients.length} recipient(s)`,
      recipients,
    });

  } catch (error) {
    console.error('Error sending email:', error);

    if (error.code === 'EAUTH') {
      return res.status(401).json({ error: 'Email authentication failed. Please check your email credentials.' });
    }
    if (error.code === 'ECONNECTION') {
      return res.status(500).json({ error: 'Failed to connect to email server. Please check your email configuration.' });
    }

    res.status(500).json({ error: 'Failed to send email', message: error.message });
  }
});

// Test email configuration
router.get('/test', async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    res.json({ success: true, message: 'Email configuration is valid' });
  } catch (error) {
    console.error('Email configuration test failed:', error);
    res.status(500).json({ error: 'Email configuration test failed', message: error.message });
  }
});

module.exports = router;

