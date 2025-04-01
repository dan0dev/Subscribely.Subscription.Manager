import mongoose from "mongoose";

// Nagyon rövid példa
const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  renewalDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

export const Subscription = mongoose.models?.Subscription || mongoose.model("Subscription", subscriptionSchema);
