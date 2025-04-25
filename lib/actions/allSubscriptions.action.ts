/**
 * @file allSubscriptions.action.ts
 * @description This file contains the server side actions for the subscriptions.
 */

"use server";

import { PurchasedSubscription } from "../models/purchasedSubscription";

/**
 * @function getAllSubscriptions
 * @description Fetches all subscriptions from the database.
 * @returns {Promise<Subscription[]>} A promise that resolves to an array of subscriptions.
 */
export async function getAllSubscriptions() {
  try {
    // Fetch subscriptions and populate the associated user data (name, email)
    // The "lean()" method returns objects instead of MongoDB documents
    const subscriptions = await PurchasedSubscription.find().populate("user", "name email").lean();

    return subscriptions.map((sub) => {
      const populatedUser = sub.user as unknown as { _id: { toString: () => string }; name: string; email: string };

      // Create a new object that only contains the necessary data
      // and convert special types (ObjectId, Date) to strings
      return {
        id: sub._id.toString(), // MongoDB ID as a string
        userId: populatedUser._id.toString(), // User ID as a string
        username: populatedUser.name, // User name
        name: sub.name, // Subscription name
        description: sub.description || "", // Description (empty string if not available)
        price: sub.price, // Subscription price
        renewalInterval: sub.renewalInterval, // Renewal interval
        nextRenewal: sub.nextRenewal.toISOString(), // Next renewal date as an ISO string
        active: sub.active, // Is the subscription active?
        createdAt: sub.createdAt ? sub.createdAt.toISOString() : null, // Creation date (if exists)
        updatedAt: sub.updatedAt ? sub.updatedAt.toISOString() : null, // Last update date (if exists)
      };
    });
  } catch (error) {
    // Handle the error and log it, then throw it to the calling function
    console.error("Failed to fetch subscriptions:", error);
    throw error;
  }
}

/**
 * @function cancelSubscription
 * @description This function handles the cancellation of a subscription, but actually only makes it inactive,
 * it does not delete it from the database. This allows for tracking previous subscriptions
 * and creating statistics for future use.
 *
 * @param {string} subscriptionId - The unique identifier of the subscription to be cancelled
 * @returns {Promise<{success: boolean}>} - Returns {success: true} if the operation is successful
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    // Find the subscription in the database by ID
    const subscription = await PurchasedSubscription.findById(subscriptionId);

    // If the subscription is not found, throw an error
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Instead of deleting, make the subscription inactive
    subscription.active = false;

    // Save the modified subscription to the database
    await subscription.save();

    // Return a success message
    return { success: true };
  } catch (error) {
    // Handle the error and log it, then throw it to the calling function
    console.error("Failed to cancel subscription:", error);
    throw error;
  }
}
