/**
 * @file userSubscriptions.action.ts
 * @description This file contains actions related to user's purchased subscriptions
 */

"use server";

import { revalidateTag } from "next/cache";
import connectDB from "../db";
import { sendSubscriptionCancellationEmail } from "../email/emailService";
import { PurchasedSubscription } from "../models/purchasedSubscription";

/**
 * Fetches all active subscriptions for a specific user
 * @param userId The ID of the user
 * @returns List of user's active subscriptions with formatted data
 */
export async function getUserSubscriptions(userId: string) {
  console.log(`Server: Fetching subscriptions for user ID: ${userId}`);

  if (!userId) {
    console.error("Server: Invalid user ID provided");
    return [];
  }

  try {
    await connectDB();
    console.log("Server: Connected to database");

    // Find all active subscriptions for the specified user
    const subscriptions = await PurchasedSubscription.find({
      user: userId,
      active: true,
    }).lean();

    console.log(`Server: Found ${subscriptions.length} subscriptions for user`);

    if (!subscriptions || subscriptions.length === 0) {
      return [];
    }

    // Format subscription data for frontend use
    return subscriptions
      .map((sub) => {
        // Ensure we have valid data
        if (!sub || !sub._id) {
          console.error("Server: Invalid subscription data", sub);
          return null;
        }

        return {
          id: sub._id.toString(),
          name: sub.name || "Unnamed Subscription",
          price: sub.price || 0,
          renewalDate: sub.nextRenewal || new Date(),
          description: sub.description || "",
          renewalInterval: sub.renewalInterval || "1m",
        };
      })
      .filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error("Server: Error fetching user subscriptions:", error);
    // Return empty array instead of throwing, to prevent UI from getting stuck
    return [];
  }
}

/**
 * Cancel a user's subscription and ensure all caches are revalidated
 * @param subscriptionId The ID of the subscription to cancel
 * @returns Result of the cancellation operation
 */
export async function cancelUserSubscription(subscriptionId: string) {
  console.log(`Server: Cancelling subscription with ID: ${subscriptionId}`);

  if (!subscriptionId) {
    console.error("Server: Invalid subscription ID provided");
    return { success: false, message: "Invalid subscription ID" };
  }

  try {
    await connectDB();
    console.log("Server: Connected to database for cancellation");

    // Find the subscription in the database by ID
    const subscription = await PurchasedSubscription.findById(subscriptionId).populate("user");

    // If the subscription is not found, return an error
    if (!subscription) {
      console.error(`Server: Subscription with ID ${subscriptionId} not found`);
      return { success: false, message: "Subscription not found" };
    }

    console.log(`Server: Found subscription: ${subscription.name}, current active status: ${subscription.active}`);

    // Make the subscription inactive
    subscription.active = false;

    // Save the modified subscription to the database
    await subscription.save();
    console.log(`Server: Successfully saved subscription with active=false`);

    // Get user information for the email
    const user = subscription.user as unknown as { email: string; name: string };

    // Send cancellation email
    try {
      const emailSent = await sendSubscriptionCancellationEmail(
        {
          email: user.email,
          name: user.name,
        },
        {
          name: subscription.name,
          price: subscription.price,
        },
        false // Not cancelled by admin
      );

      if (emailSent) {
        console.log(`🚀 USER CANCELLATION: Email notification successfully sent to ${user.email}`);
      } else {
        console.log(`⚠️ USER CANCELLATION: Email delivery failed, but subscription was cancelled successfully`);
      }
    } catch (emailError) {
      // Log the error but don't fail the cancellation if email sending fails
      console.error("⚠️ USER CANCELLATION: Unexpected error during email sending:", emailError);
    }

    // Revalidate caches to ensure data is fresh
    revalidateTag("user");
    revalidateTag("subscriptions");
    console.log("Server: Revalidated caches");

    // Return a success message
    return {
      success: true,
      message: `Successfully cancelled ${subscription.name} subscription`,
    };
  } catch (error) {
    console.error("Server: Error cancelling subscription:", error);
    return {
      success: false,
      message: "Failed to cancel subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
