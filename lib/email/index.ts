/**
 * Email utilities index file
 */

export { default as transporter } from "./emailConfig";
export { sendSubscriptionCancellationEmail, sendSubscriptionPurchaseEmail } from "./emailService";
export { generateCancellationEmailTemplate, generatePurchaseEmailTemplate } from "./templates";
