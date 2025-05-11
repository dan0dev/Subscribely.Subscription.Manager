import transporter, { defaultHeaders } from "./emailConfig";
import { generateCancellationEmailTemplate, generatePurchaseEmailTemplate } from "./templates";

interface SubscriptionInfo {
  name: string;
  price: number;
  nextRenewal?: string;
  username?: string;
}

interface UserInfo {
  email: string;
  name: string;
}

/**
 * Send a subscription purchase confirmation email
 * @param user User information including email and name
 * @param subscription Subscription details
 * @returns Promise with the result of the email sending operation
 */
export async function sendSubscriptionPurchaseEmail(user: UserInfo, subscription: SubscriptionInfo): Promise<boolean> {
  try {
    // Generate the email HTML content
    const htmlContent = generatePurchaseEmailTemplate(subscription, user.name);

    // Set up email options
    const mailOptions = {
      from: {
        name: "Subscribely",
        address: process.env.GMAIL_USER || "",
      },
      replyTo: process.env.GMAIL_USER || "",
      to: user.email,
      subject: `Subscription Confirmation: ${subscription.name}`,
      html: htmlContent,
      // Adding a text alternative for email clients that don't support HTML
      text: `Hello ${user.name},
      Thank you for your purchase. Your subscription ${subscription.name} for $${subscription.price.toFixed(2)} has been successfully activated.
      The next renewal date is ${subscription.nextRenewal ? new Date(subscription.nextRenewal).toLocaleDateString() : "N/A"}.

      If you have any questions, please contact our support team.

      Subscribely Team`,
      // Include anti-spam headers
      headers: {
        ...defaultHeaders,
        "X-Entity-Ref-ID": `purchase-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`, // Unique ID for each email
      },
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Log success with details
    console.log(`✅ EMAIL SENT SUCCESSFULLY ✅`);
    console.log(`→ Type: Purchase confirmation`);
    console.log(`→ Recipient: ${user.email}`);
    console.log(`→ Subscription: ${subscription.name}`);
    console.log(`→ Message ID: ${info.messageId}`);

    return true;
  } catch (error) {
    // Log failure with error details
    console.error(`❌ EMAIL SENDING FAILED ❌`);
    console.error(`→ Type: Purchase confirmation`);
    console.error(`→ Recipient: ${user.email}`);
    console.error(`→ Subscription: ${subscription.name}`);
    console.error(`→ Error:`, error);

    return false;
  }
}

/**
 * Send a subscription cancellation email
 * @param user User information including email and name
 * @param subscription Subscription details
 * @param cancelledByAdmin Whether the subscription was cancelled by an admin
 * @returns Promise with the result of the email sending operation
 */
export async function sendSubscriptionCancellationEmail(
  user: UserInfo,
  subscription: SubscriptionInfo,
  cancelledByAdmin: boolean = false
): Promise<boolean> {
  try {
    // Generate the email HTML content
    const htmlContent = generateCancellationEmailTemplate(subscription, user.name, cancelledByAdmin);

    // Set up email options
    const mailOptions = {
      from: {
        name: "Subscribely",
        address: process.env.GMAIL_USER || "",
      },
      replyTo: process.env.GMAIL_USER || "",
      to: user.email,
      subject: `Subscription Cancelled: ${subscription.name}`,
      html: htmlContent,
      // Adding a text alternative for email clients that don't support HTML
      text: `Hello ${user.name},
      Your subscription ${subscription.name} for $${subscription.price.toFixed(2)} has been ${cancelledByAdmin ? "cancelled by an administrator" : "cancelled"} successfully.

      We're sorry to see you go. If you change your mind, you can always subscribe again from your account dashboard.

      If you have any questions, please contact our support team.

      Subscribely Team`,
      // Include anti-spam headers
      headers: {
        ...defaultHeaders,
        "X-Entity-Ref-ID": `cancel-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`, // Unique ID for each email
      },
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Log success with details
    console.log(`✅ EMAIL SENT SUCCESSFULLY ✅`);
    console.log(`→ Type: Cancellation notification${cancelledByAdmin ? " (by admin)" : ""}`);
    console.log(`→ Recipient: ${user.email}`);
    console.log(`→ Subscription: ${subscription.name}`);
    console.log(`→ Message ID: ${info.messageId}`);

    return true;
  } catch (error) {
    // Log failure with error details
    console.error(`❌ EMAIL SENDING FAILED ❌`);
    console.error(`→ Type: Cancellation notification${cancelledByAdmin ? " (by admin)" : ""}`);
    console.error(`→ Recipient: ${user.email}`);
    console.error(`→ Subscription: ${subscription.name}`);
    console.error(`→ Error:`, error);

    return false;
  }
}
