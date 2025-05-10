/**
 * @file adminActions.ts
 * @description Admin-specific actions, for example.: modifying user balance
 */

"use server";

import { revalidateTag } from "next/cache";
import connectDB from "../db";
import User from "../models/user";

interface UserResult {
  id: string;
  name: string;
  email: string;
  accountMoney: number;
  role: string;
}

/**
 * Search for users by email or name
 * @param searchTerm The search term (email or name)
 */
export async function searchUsers(searchTerm: string): Promise<{
  success: boolean;
  message?: string;
  users?: UserResult[];
  error?: string;
}> {
  try {
    await connectDB();

    if (!searchTerm || searchTerm.trim().length < 3) {
      return { success: false, message: "Search term must be at least 3 characters long" };
    }

    // Search by email or name (case insensitive)
    const users = await User.find({
      $or: [{ email: { $regex: searchTerm, $options: "i" } }, { name: { $regex: searchTerm, $options: "i" } }],
    }).select("_id name email accountMoney role");

    if (!users || users.length === 0) {
      return { success: false, message: "No users found with the given search term" };
    }

    // Return formatted user data
    return {
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        accountMoney: user.accountMoney,
        role: user.role,
      })),
    };
  } catch (error) {
    console.error("Error searching for users:", error);
    return {
      success: false,
      message: "An error occurred while searching for users",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update user balance (admin only)
 * @param userId The user's ID
 * @param newBalance The new balance amount
 */
export async function updateUserBalance(userId: string, newBalance: number) {
  try {
    await connectDB();

    // Check if the amount is valid
    if (isNaN(newBalance) || newBalance < 0) {
      return { success: false, message: "Invalid amount. The amount must be a positive number." };
    }

    // Find the user and update their balance
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Update balance
    user.accountMoney = newBalance;
    await user.save();

    // Refresh cache - WIP
    revalidateTag("user");
    revalidateTag("subscriptions");

    return {
      success: true,
      message: `${user.name}'s balance successfully updated to ${newBalance.toLocaleString()}`,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        accountMoney: user.accountMoney,
      },
    };
  } catch (error) {
    console.error("Error updating user balance:", error);
    return {
      success: false,
      message: "An error occurred while updating the user balance",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
