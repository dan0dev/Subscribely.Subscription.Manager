import nodemailer from "nodemailer";

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  // Add SMTP settings to improve deliverability
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
  // Customize message options for better deliverability
  pool: true, // Use connection pool
  maxConnections: 5, // Maximum number of connections
  rateDelta: 1000, // How many messages per rateDelta
  rateLimit: 5, // Max number of messages in rateDelta
  secure: true, // Use TLS
  dkim: {
    domainName: process.env.GMAIL_USER?.split("@")[1] || "gmail.com",
    keySelector: "default",
    privateKey: "...", // In production, you'd use your actual DKIM private key
  },
});

// Add X-SES headers to emails to help with deliverability
const defaultHeaders = {
  "X-Priority": "3", // Normal priority
  "X-MSMail-Priority": "Normal",
  "X-Mailer": "Subscribely",
  "List-Unsubscribe": "<mailto:unsubscribe@yourdomain.com?subject=unsubscribe>", // Add an unsubscribe header
  Precedence: "bulk", // Indicates automated email
  "X-Auto-Response-Suppress": "OOF, AutoReply", // Prevents auto-replies
  "Feedback-ID": "Subscribely:subscription-emails", // Used for engagement tracking
};

export default transporter;
export { defaultHeaders };
