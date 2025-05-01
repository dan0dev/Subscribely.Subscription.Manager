/**
 * @file purchasedSubscription.ts
 * @description This file contains the schema for the purchased subscriptions.
 */

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPurchasedSubscription extends Document {
  user: mongoose.Types.ObjectId;
  subscriptionType: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  renewalInterval: string;
  nextRenewal: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// PurchasedSubscription Schema
const PurchasedSubscriptionSchema = new Schema<IPurchasedSubscription>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    subscriptionType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AvailableSubscription",
      required: [true, "Subscription type ID is required"],
    },
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price cannot be negative"],
    },
    renewalInterval: {
      type: String,
      required: [true, "Renewal interval is required"],
      default: "1m",
    },
    nextRenewal: {
      type: Date,
      required: [true, "Next renewal date is required"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PurchasedSubscription: Model<IPurchasedSubscription> =
  mongoose.models.PurchasedSubscription ||
  mongoose.model<IPurchasedSubscription>("PurchasedSubscription", PurchasedSubscriptionSchema);
