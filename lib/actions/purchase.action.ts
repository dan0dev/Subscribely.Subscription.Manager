/**
 * @file purchase.action.tsx
 * @description This file contains the server action for purchasing a subscription. It checks if the user has enough money,
 * if the user already has the subscription, and if the user has reached the maximum number of subscriptions.
 * It also calculates the next renewal date and deducts the subscription price from the user's account.
 */

"use server";

import { revalidateTag } from "next/cache";
import connectDB from "../db";
import { sendSubscriptionPurchaseEmail } from "../email/emailService";
import { AvailableSubscription } from "../models/availableSubscription";
import { PurchasedSubscription } from "../models/purchasedSubscription";
import User from "../models/user";

export async function purchaseSubscription(subscriptionId: string, userId: string) {
  try {
    await connectDB();

    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Get the subscription
    const subscription = await AvailableSubscription.findById(subscriptionId);
    if (!subscription) {
      return {
        success: false,
        message: "Subscription not found",
      };
    }

    // Check if user already has THIS subscription
    const existingSubscription = await PurchasedSubscription.findOne({
      user: userId,
      subscriptionType: subscriptionId,
      active: true,
    });

    if (existingSubscription) {
      return {
        success: false,
        message: "You already have this subscription",
      };
    }

    // Check if user has enough money
    if (user.accountMoney < subscription.price) {
      return {
        success: false,
        message: "Insufficient funds",
      };
    }

    // Check if user has reached the maximum number of subscriptions (3)
    const userSubscriptions = await PurchasedSubscription.countDocuments({
      user: userId,
      active: true,
    });

    if (userSubscriptions >= 3) {
      return {
        success: false,
        message: "You can only have up to 3 active subscriptions",
      };
    }

    // Calculate next renewal date based on renewalInterval
    const nextRenewal = calculateNextRenewalDate(subscription.renewalInterval);

    // Deduct the subscription price from user's account
    user.accountMoney -= subscription.price;
    await user.save();

    // Create new purchased subscription
    await PurchasedSubscription.create({
      user: userId,
      subscriptionType: subscriptionId,
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      renewalInterval: subscription.renewalInterval,
      nextRenewal,
      active: true,
    });

    // Send confirmation email
    try {
      const emailSent = await sendSubscriptionPurchaseEmail(
        {
          email: user.email,
          name: user.name,
        },
        {
          name: subscription.name,
          price: subscription.price,
          nextRenewal: nextRenewal.toISOString(),
        }
      );

      if (emailSent) {
        console.log(`🚀 PURCHASE FLOW: Email notification successfully sent to ${user.email}`);
      } else {
        console.log(`⚠️ PURCHASE FLOW: Email delivery failed, but subscription was created successfully`);
      }
    } catch (emailError) {
      // Log the error but don't fail the purchase if email sending fails
      console.error("⚠️ PURCHASE FLOW: Unexpected error during email sending:", emailError);
    }

    // Revalidate cache
    revalidateTag("user");
    revalidateTag("subscriptions");

    return {
      success: true,
      message: `Successfully purchased ${subscription.name}`,
      newBalance: user.accountMoney,
    };
  } catch (error) {
    console.error("Error purchasing subscription:", error);
    return {
      success: false,
      message: "Failed to purchase subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper function to calculate next renewal date
function calculateNextRenewalDate(renewalInterval: string): Date {
  const now = new Date();
  const interval = renewalInterval.slice(0, -1);
  const unit = renewalInterval.slice(-1);
  const value = parseInt(interval);

  switch (unit) {
    case "h": // hours
      now.setHours(now.getHours() + value);
      break;
    case "d": // days
      now.setDate(now.getDate() + value);
      break;
    case "w": // weeks
      now.setDate(now.getDate() + value * 7);
      break;
    case "m": // months
      now.setMonth(now.getMonth() + value);
      break;
    case "y": // years
      now.setFullYear(now.getFullYear() + value);
      break;
    default:
      now.setMonth(now.getMonth() + 1); // default to 1 month
  }

  return now;
}
