import cron from "node-cron";
import connectDB from "../db";
import { PurchasedSubscription } from "../models/purchasedSubscription";

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("⏰ CRON JOB: Checking for expired subscriptions");

    try {
        await connectDB();

        const now = new Date();

        // Find all active subscriptions past their nextRenewal date
        const expiredSubs = await PurchasedSubscription.find({
        active: true,
        nextRenewal: { $lt: now },
        }).populate("user");

        for (const sub of expiredSubs) {
        sub.active = false;
        await sub.save();
        }

        console.log(`Processed ${expiredSubs.length} expired subscriptions`);
    } catch (error) {
        console.error("Failed to process expired subscriptions", error);
    }
});
