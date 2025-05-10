"use client";

import { RefreshCw } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

import { getUserSubscriptions } from "@/lib/actions/userSubscriptions.action";
import NoSubscriptions from "./NoSubscriptions";
import SubscriptionHeader from "./SubscriptionHeader";
import SubscriptionTable from "./SubscriptionTable";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  renewalDate: Date;
  description?: string;
}

const SubscriptionTab: FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [cancelInProgress, setCancelInProgress] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log("Fetching user data...");
        const response = await fetch("/api/user/me");

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const data = await response.json();
        console.log("User data response:", data);

        if (data.success && data.user && data.user.id) {
          console.log("User ID set:", data.user.id);
          setUserId(data.user.id);
        } else {
          console.error("No valid user ID found in response:", data);
          toast.error("Failed to get your user ID. Please try refreshing.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Please try again.");
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Fetch user subscriptions
  useEffect(() => {
    async function fetchSubscriptions() {
      if (!userId) return;

      try {
        console.log("Fetching subscriptions for user:", userId);
        const data = await getUserSubscriptions(userId);
        console.log("Subscription data received:", data);

        const typedData: Subscription[] = data as Subscription[];
        setSubscriptions(typedData);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        toast.error("Failed to fetch your subscriptions. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchSubscriptions();
    }
  }, [userId]);

  const removeSubscription = (subscriptionId: string) => {
    setSubscriptions((prevSubscriptions) => prevSubscriptions.filter((sub) => sub.id !== subscriptionId));
  };

  return (
    <div className="flex-1 overflow-hidden border-light-600/20 bg-dark-400/50">
      <SubscriptionHeader subscriptionsCount={subscriptions.length} />

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 text-primary-100 animate-spin" />
            <span className="ml-3 text-light-400">Loading subscription data...</span>
          </div>
        ) : subscriptions.length > 0 ? (
          <SubscriptionTable
            subscriptions={subscriptions}
            cancelInProgress={cancelInProgress}
            setCancelInProgress={setCancelInProgress}
            onSubscriptionCancelled={removeSubscription}
          />
        ) : (
          <NoSubscriptions />
        )}
      </div>
    </div>
  );
};

export default SubscriptionTab;
