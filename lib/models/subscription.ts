import mongoose from "mongoose";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  purchaseDate: Date;
  renewalDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    renewalDate: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.models?.Subscription || mongoose.model("Subscription", subscriptionSchema);
