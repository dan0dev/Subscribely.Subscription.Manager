/**
 * Email templates for subscription notifications.
 * Professional, accessible templates with clean design to avoid spam filters.
 */

interface SubscriptionDetails {
  name: string;
  price: number;
  nextRenewal?: string;
  username?: string;
  planFeatures?: string[];
  companyName?: string;
  supportEmail?: string;
  unsubscribeUrl?: string;
  logoUrl?: string;
  specialOffers?: {
    code: string;
    discount: string;
    expiryDays: number;
  };
  gettingStartedSteps?: string[];
}

/**
 * Generate the HTML template for subscription purchase confirmation
 */
export const generatePurchaseEmailTemplate = (subscription: SubscriptionDetails, userName: string): string => {
  const formattedPrice = subscription.price.toFixed(2);
  const formattedDate = subscription.nextRenewal
    ? new Date(subscription.nextRenewal).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const companyName = subscription.companyName || "Subscribely";
  const supportEmail = subscription.supportEmail || "support@subscribely.com";
  const logoUrl = subscription.logoUrl || "https://via.placeholder.com/150x50.png?text=Your+Logo";
  const currentYear = new Date().getFullYear();

  // Generate feature list if available
  const featuresList = subscription.planFeatures
    ? `
      <div class="feature-list">
        <p class="section-title">Plan Features:</p>
        <ul>
          ${subscription.planFeatures.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>
    `
    : "";

  // Generate getting started steps if available
  const gettingStartedSection = subscription.gettingStartedSteps
    ? `
      <div class="getting-started">
        <p class="section-title">Getting Started</p>
        <ol>
          ${subscription.gettingStartedSteps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </div>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>Subscription Confirmation</title>
      <style>
        :root {
          color-scheme: light;
        }
        body {
          font-family: Verdana, Geneva, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 25px;
          border-bottom: 1px solid #eeeeee;
        }
        .logo {
          max-width: 180px;
          margin-bottom: 20px;
        }
        h1 {
          color: #333333;
          margin-top: 0;
          font-weight: 600;
          font-size: 22px;
        }
        .content {
          padding: 25px 0;
        }
        .subscription-details {
          background-color: #f7f9fc;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
          border-left: 3px solid #4a7aaa;
        }
        .detail-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 15px;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 15px;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #555555;
          min-width: 120px;
          flex-shrink: 0;
        }
        .detail-value {
          color: #333333;
          font-weight: 500;
        }
        .accent {
          color: #4a7aaa;
          font-weight: 600;
        }
        .feature-list {
          margin-top: 20px;
        }
        .feature-list ul {
          padding-left: 20px;
          margin-top: 10px;
        }
        .feature-list li {
          margin-bottom: 8px;
          color: #555555;
        }
        .getting-started {
          background-color: #f0f5fa;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 3px solid #4a7aaa;
        }
        .section-title {
          margin-top: 0;
          color: #4a7aaa;
          font-weight: 600;
          font-size: 18px;
        }
        .getting-started ol {
          padding-left: 20px;
          margin-top: 15px;
        }
        .getting-started li {
          margin-bottom: 12px;
          color: #333333;
        }
        .button {
          display: inline-block;
          background-color: #4a7aaa;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 6px;
          margin-top: 25px;
          font-weight: 600;
          font-size: 15px;
        }
        .footer {
          text-align: center;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #eeeeee;
          color: #777777;
          font-size: 0.9em;
        }
        .contact-info {
          margin-top: 15px;
        }
        .contact-info a {
          color: #4a7aaa;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            padding: 20px 15px;
            border-radius: 0;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .detail-value {
            margin-top: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="${companyName}" class="logo">
          <h1>Your Subscription is Active</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Thank you for subscribing to ${companyName}. Your subscription has been successfully activated and is ready to use.</p>

          <div class="subscription-details">
            <div class="detail-row">
              <span class="detail-label">Plan:</span>
              <span class="detail-value accent">${subscription.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value accent">$${formattedPrice}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Next Billing:</span>
              <span class="detail-value accent">${formattedDate}</span>
            </div>
            ${featuresList}
          </div>

          ${gettingStartedSection}

          <p>You now have full access to all the features included in your subscription plan. You can manage your subscription settings, update payment information, or view billing history from your account dashboard.</p>

          <center>
            <a href="#" class="button">Manage My Subscription</a>
          </center>
        </div>
        <div class="footer">
          <p>If you have any questions or need assistance, our support team is here to help.</p>
          <div class="contact-info">
            <a href="mailto:${supportEmail}">${supportEmail}</a>
          </div>
          <p>&copy; ${currentYear} ${companyName}. All rights reserved.</p>
          ${
            subscription.unsubscribeUrl
              ? `<p><small><a href="${subscription.unsubscribeUrl}" style="color: #777777;">Manage email preferences</a></small></p>`
              : ""
          }
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate the HTML template for subscription cancellation
 */
export const generateCancellationEmailTemplate = (
  subscription: SubscriptionDetails,
  userName: string,
  cancelledByAdmin: boolean = false
): string => {
  const formattedPrice = subscription.price.toFixed(2);
  const companyName = subscription.companyName || "Subscribely";
  const supportEmail = subscription.supportEmail || "support@subscribely.com";
  const logoUrl = subscription.logoUrl || "https://via.placeholder.com/150x50.png?text=Your+Logo";
  const currentYear = new Date().getFullYear();

  // Determine cancellation message based on who cancelled
  const cancellationMessage = cancelledByAdmin
    ? "Your subscription has been cancelled by an administrator."
    : "Your subscription has been cancelled successfully.";

  // Determine follow-up message based on who cancelled
  const followUpMessage = cancelledByAdmin
    ? "If you believe this was done in error or have any questions about this action, please contact our support team."
    : "We value your feedback and would appreciate knowing how we could improve our service.";

  // Special offer section for win-back (only for user-initiated cancellations)
  const specialOfferSection =
    !cancelledByAdmin && subscription.specialOffers
      ? `
      <div class="special-offer">
        <p class="section-title">Special Offer For You</p>
        <p>We'd love to have you back! Use the code below to get ${subscription.specialOffers.discount} off when you resubscribe:</p>
        <div class="promo-code">
          <span>${subscription.specialOffers.code}</span>
        </div>
        <p><small>This offer expires in ${subscription.specialOffers.expiryDays} days.</small></p>
      </div>
    `
      : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>Subscription Cancelled</title>
      <style>
        :root {
          color-scheme: light;
        }
        body {
          font-family: Verdana, Geneva, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 25px;
          border-bottom: 1px solid #eeeeee;
        }
        .logo {
          max-width: 180px;
          margin-bottom: 20px;
        }
        h1 {
          color: #333333;
          margin-top: 0;
          font-weight: 600;
          font-size: 22px;
        }
        .content {
          padding: 25px 0;
        }
        .subscription-details {
          background-color: #f7f9fc;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
          border-left: 3px solid #777777;
        }
        .detail-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 15px;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 15px;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #555555;
          min-width: 120px;
          flex-shrink: 0;
        }
        .detail-value {
          color: #333333;
          font-weight: 500;
        }
        .accent {
          color: #777777;
          font-weight: 600;
        }
        .special-offer {
          background-color: #f7f7f0;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 3px solid #aa7a4a;
          text-align: center;
        }
        .section-title {
          margin-top: 0;
          color: #555555;
          font-weight: 600;
          font-size: 18px;
        }
        .special-offer .section-title {
          color: #aa7a4a;
        }
        .promo-code {
          background-color: #fff;
          border: 1px solid #aa7a4a;
          border-radius: 6px;
          padding: 15px;
          margin: 15px auto;
          max-width: 200px;
          font-size: 18px;
          font-weight: bold;
          color: #aa7a4a;
          letter-spacing: 1px;
        }
        .feedback-section {
          background-color: #f0f7f5;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 3px solid #4a9a7a;
        }
        .feedback-section .section-title {
          color: #4a9a7a;
        }
        .button {
          display: inline-block;
          background-color: #4a7aaa;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 6px;
          margin-top: 25px;
          font-weight: 600;
          font-size: 15px;
        }
        .feedback-button {
          display: inline-block;
          background-color: #4a9a7a;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 6px;
          margin-top: 25px;
          margin-left: 10px;
          font-weight: 600;
          font-size: 15px;
        }
        .button-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 15px;
        }
        .footer {
          text-align: center;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #eeeeee;
          color: #777777;
          font-size: 0.9em;
        }
        .contact-info {
          margin-top: 15px;
        }
        .contact-info a {
          color: #4a7aaa;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            padding: 20px 15px;
            border-radius: 0;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .detail-value {
            margin-top: 5px;
          }
          .button-container {
            flex-direction: column;
            align-items: center;
          }
          .feedback-button {
            margin-left: 0;
            margin-top: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="${companyName}" class="logo">
          <h1>Subscription Cancelled</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>${cancellationMessage}</p>

          <div class="subscription-details">
            <div class="detail-row">
              <span class="detail-label">Plan:</span>
              <span class="detail-value accent">${subscription.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">$${formattedPrice}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value accent">Cancelled</span>
            </div>
          </div>

          <p>${followUpMessage}</p>

          ${
            !cancelledByAdmin
              ? `
          <div class="feedback-section">
            <p class="section-title">We Value Your Feedback</p>
            <p>Your opinion matters to us. Please take a moment to share why you decided to cancel your subscription. Your feedback helps us improve our service for everyone.</p>
          </div>
          `
              : ""
          }

          ${specialOfferSection}

          <div class="button-container">
            ${
              cancelledByAdmin
                ? `<a href="#" class="button">Contact Support</a>`
                : `<a href="#" class="button">Resubscribe</a>
               <a href="#" class="feedback-button">Share Feedback</a>`
            }
          </div>
        </div>
        <div class="footer">
          <p>If you have any questions or need assistance, our support team is here to help.</p>
          <div class="contact-info">
            <a href="mailto:${supportEmail}">${supportEmail}</a>
          </div>
          <p>&copy; ${currentYear} ${companyName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate the HTML template for subscription renewal reminder
 */
export const generateRenewalReminderEmailTemplate = (
  subscription: SubscriptionDetails,
  userName: string,
  daysUntilRenewal: number
): string => {
  const formattedPrice = subscription.price.toFixed(2);
  const formattedDate = subscription.nextRenewal
    ? new Date(subscription.nextRenewal).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const companyName = subscription.companyName || "Subscribely";
  const supportEmail = subscription.supportEmail || "support@subscribely.com";
  const logoUrl = subscription.logoUrl || "https://via.placeholder.com/150x50.png?text=Your+Logo";
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>Subscription Renewal Reminder</title>
      <style>
        :root {
          color-scheme: light;
        }
        body {
          font-family: Verdana, Geneva, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 25px;
          border-bottom: 1px solid #eeeeee;
        }
        .logo {
          max-width: 180px;
          margin-bottom: 20px;
        }
        h1 {
          color: #333333;
          margin-top: 0;
          font-weight: 600;
          font-size: 22px;
        }
        .content {
          padding: 25px 0;
        }
        .subscription-details {
          background-color: #f7f9fc;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
          border-left: 3px solid #aa7a4a;
        }
        .detail-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 15px;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 15px;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #555555;
          min-width: 120px;
          flex-shrink: 0;
        }
        .detail-value {
          color: #333333;
          font-weight: 500;
        }
        .accent {
          color: #aa7a4a;
          font-weight: 600;
        }
        .button {
          display: inline-block;
          background-color: #4a7aaa;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 6px;
          margin-top: 25px;
          font-weight: 600;
          font-size: 15px;
        }
        .footer {
          text-align: center;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #eeeeee;
          color: #777777;
          font-size: 0.9em;
        }
        .contact-info {
          margin-top: 15px;
        }
        .contact-info a {
          color: #4a7aaa;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            padding: 20px 15px;
            border-radius: 0;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .detail-value {
            margin-top: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="${companyName}" class="logo">
          <h1>Subscription Renewal Reminder</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>This is a friendly reminder that your subscription will renew automatically in <span class="accent">${daysUntilRenewal} day${
            daysUntilRenewal === 1 ? "" : "s"
          }</span>.</p>

          <div class="subscription-details">
            <div class="detail-row">
              <span class="detail-label">Plan:</span>
              <span class="detail-value">${subscription.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">$${formattedPrice}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Renewal Date:</span>
              <span class="detail-value accent">${formattedDate}</span>
            </div>
          </div>

          <p>To ensure uninterrupted service, please make sure your payment information is up to date. You can manage your subscription settings, update payment details, or cancel your subscription from your account dashboard.</p>

          <center>
            <a href="#" class="button">Manage My Subscription</a>
          </center>
        </div>
        <div class="footer">
          <p>If you have any questions or need assistance, our support team is here to help.</p>
          <div class="contact-info">
            <a href="mailto:${supportEmail}">${supportEmail}</a>
          </div>
          <p>&copy; ${currentYear} ${companyName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate the HTML template for payment failure notification
 */
export const generatePaymentFailureEmailTemplate = (
  subscription: SubscriptionDetails,
  userName: string,
  retryAttempts: number = 3,
  nextRetryDate?: string
): string => {
  const formattedPrice = subscription.price.toFixed(2);
  const companyName = subscription.companyName || "Subscribely";
  const supportEmail = subscription.supportEmail || "support@subscribely.com";
  const logoUrl = subscription.logoUrl || "https://via.placeholder.com/150x50.png?text=Your+Logo";
  const currentYear = new Date().getFullYear();

  const formattedNextRetryDate = nextRetryDate
    ? new Date(nextRetryDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "soon";

  // Timeline visualization with text-based approach to avoid spam triggers
  const timelineSteps = [
    {
      date: "Today",
      status: "Payment Unsuccessful",
      active: true,
    },
    {
      date: formattedNextRetryDate,
      status: "Next Attempt",
      active: false,
    },
    {
      date: "After Final Attempt",
      status: "Service Paused",
      active: false,
    },
  ];

  const timelineHtml = `
    <div class="timeline">
      <p class="section-title">What Happens Next</p>
      <table class="timeline-table" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          ${timelineSteps
            .map(
              (step) => `
            <td class="timeline-step ${step.active ? "active" : ""}">
              <div class="timeline-date">${step.date}</div>
              <div class="timeline-status">${step.status}</div>
            </td>
          `
            )
            .join("")}
        </tr>
      </table>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>Payment Unsuccessful</title>
      <style>
        :root {
          color-scheme: light;
        }
        body {
          font-family: Verdana, Geneva, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 25px;
          border-bottom: 1px solid #eeeeee;
        }
        .logo {
          max-width: 180px;
          margin-bottom: 20px;
        }
        h1 {
          color: #333333;
          margin-top: 0;
          font-weight: 600;
          font-size: 22px;
        }
        .content {
          padding: 25px 0;
        }
        .subscription-details {
          background-color: #f7f9fc;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
          border-left: 3px solid #777777;
        }
        .detail-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 15px;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 15px;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #555555;
          min-width: 120px;
          flex-shrink: 0;
        }
        .detail-value {
          color: #333333;
          font-weight: 500;
        }
        .accent {
          color: #777777;
          font-weight: 600;
        }
        .timeline {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 3px solid #777777;
        }
        .section-title {
          margin-top: 0;
          color: #555555;
          font-weight: 600;
          font-size: 18px;
        }
        .timeline-table {
          width: 100%;
          margin-top: 20px;
          table-layout: fixed;
        }
        .timeline-step {
          text-align: center;
          padding: 10px;
          vertical-align: top;
        }
        .timeline-date {
          font-weight: 600;
          font-size: 14px;
          color: #555555;
          margin-bottom: 8px;
        }
        .timeline-status {
          font-size: 13px;
          color: #777777;
        }
        .timeline-step.active .timeline-date {
          color: #777777;
        }
        .timeline-step.active .timeline-status {
          color: #777777;
          font-weight: 600;
        }
        .button {
          display: inline-block;
          background-color: #4a7aaa;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 6px;
          margin-top: 25px;
          font-weight: 600;
          font-size: 15px;
        }
        .footer {
          text-align: center;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #eeeeee;
          color: #777777;
          font-size: 0.9em;
        }
        .contact-info {
          margin-top: 15px;
        }
        .contact-info a {
          color: #4a7aaa;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            padding: 20px 15px;
            border-radius: 0;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .detail-value {
            margin-top: 5px;
          }
          .timeline-table {
            display: block;
          }
          .timeline-step {
            display: block;
            width: 100%;
            margin-bottom: 15px;
            text-align: left;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="${companyName}" class="logo">
          <h1>Payment Unsuccessful</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>We were unable to process your payment for your subscription. This could be due to expired card details, insufficient funds, or a temporary issue with your payment method.</p>

          <div class="subscription-details">
            <div class="detail-row">
              <span class="detail-label">Plan:</span>
              <span class="detail-value">${subscription.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">$${formattedPrice}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value accent">Payment Unsuccessful</span>
            </div>
          </div>

          ${timelineHtml}

          <p>We'll automatically retry the payment ${retryAttempts} more time${
            retryAttempts === 1 ? "" : "s"
          }. To avoid any interruption to your service, please update your payment information as soon as possible.</p>

          <center>
            <a href="#" class="button">Update Payment Method</a>
          </center>
        </div>
        <div class="footer">
          <p>If you have any questions or need assistance, our support team is here to help.</p>
          <div class="contact-info">
            <a href="mailto:${supportEmail}">${supportEmail}</a>
          </div>
          <p>&copy; ${currentYear} ${companyName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
