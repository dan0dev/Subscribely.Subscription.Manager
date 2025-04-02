import mongoose from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  name: string;
  price: number;
  purchaseDate: Date;
  renewalDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new mongoose.Schema<ISubscription>({
  userId: { ref: "User", required: true },
  name: { required: true },
  price: { required: true },
  purchaseDate: { default: Date.now },
  renewalDate: { required: true },
  active: { default: true },
});

export const Subscription = mongoose.models?.Subscription || mongoose.model("Subscription", subscriptionSchema);
