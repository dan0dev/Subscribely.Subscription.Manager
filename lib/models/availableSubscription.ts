// lib/models/availableSubscription.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAvailableSubscription extends Document {
  name: string;
  description?: string;
  price: number;
  active: boolean;
  renewalInterval: string;
  createdAt: Date;
  updatedAt: Date;
}

// AvailableSubscription Schema
const AvailableSubscriptionSchema = new Schema<IAvailableSubscription>(
  {
    name: {
      type: String,
      required: [true, "Az előfizetés neve kötelező"],
      trim: true,
      minlength: [3, "Az előfizetés neve legalább 3 karakter hosszú legyen"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Az előfizetés ára kötelező"],
      min: [0, "Az ár nem lehet negatív"],
    },
    renewalInterval: {
      type: String,
      required: [true, "A megújítási időköz kötelező"],
      default: "1m",
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

export const AvailableSubscription: Model<IAvailableSubscription> =
  mongoose.models.AvailableSubscription ||
  mongoose.model<IAvailableSubscription>("AvailableSubscription", AvailableSubscriptionSchema);
