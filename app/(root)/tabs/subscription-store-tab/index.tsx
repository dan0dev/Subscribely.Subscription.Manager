"use client";
import { getSubscriptions } from "@/lib/actions/availableSubscription.action";
import { Subscription, User } from "@/types/types";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import SubscriptionsList from "./SubscriptionsList";

interface SubscriptionStoreTabProps {
  updateUserData?: () => void;
}

const SubscriptionStoreTab: FC<SubscriptionStoreTabProps> = ({ updateUserData }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data from parent component or context
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/me", {
        next: {
          revalidate: 180, // For 3 minutes do not refetch the user data
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchSubscriptions = async () => {
    // Check if the subscriptions are cached and the last fetch was less than 3 minutes ago
    const lastFetch = sessionStorage.getItem("subscriptionsFetchedAt");
    const cache = sessionStorage.getItem("subscriptions");

    const now = Date.now();
    const threeMinutes = 180 * 1000;

    if (lastFetch && cache && now - Number(lastFetch) < threeMinutes) {
      setSubscriptions(JSON.parse(cache));
      setIsLoadingSubscriptions(false);
      return;
    }

    // Fetch subscriptions from the server
    setIsLoadingSubscriptions(true);
    try {
      const response = await getSubscriptions();
      if (response.success) {
        setSubscriptions(response.data || []);
        sessionStorage.setItem("subscriptions", JSON.stringify(response.data));
        sessionStorage.setItem("subscriptionsFetchedAt", now.toString());
      } else {
        toast.error(response.message || "Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to fetch subscriptions");
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  // Fetch available subscriptions and user data
  useEffect(() => {
    fetchSubscriptions();
    fetchUserData();
  }, []);

  return (
    <div className="flex-1 overflow-x-auto px-5">
      <div className="flex items-center justify-between p-4 border-b border-light-600/20">
        <h2 className="text-2xl font-medium text-white">Available Subscriptions</h2>
      </div>

      <SubscriptionsList
        subscriptions={subscriptions}
        isLoading={isLoadingSubscriptions}
        user={user}
        onPurchaseSuccess={() => {
          fetchUserData();
          if (updateUserData) {
            updateUserData();
          }
        }}
      />
    </div>
  );
};

export default SubscriptionStoreTab;
