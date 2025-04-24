/**
 * @file SubscriptionStoreTab.tsx
 * @description This file contains the SubscriptionStoreTab component. It displays all available subscriptions and allows the user to purchase them. This component is almost the same as the ManagementTab.
 */

"use client";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getSubscriptions } from "@/lib/actions/availableSubscription.action";
// Implementing purchase server action
import { purchaseSubscription } from "@/lib/actions/purchase.action";
// IMporting User type
import { User } from "@/types/types";

interface SubscriptionStoreTabProps {
  updateUserData?: () => void;
}

interface Subscription {
  _id: string;
  name: string;
  description: string | undefined;
  price: number;
  renewalInterval: string;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// Helper function to format renewal interval for display
const formatRenewalInterval = (interval: string | undefined): string => {
  if (!interval) return "N/A";

  // Safety check for valid format
  if (interval.length < 2 || !["h", "d", "w", "m", "y"].includes(interval.slice(-1))) {
    return interval;
  }

  const unit = interval.slice(-1);
  const value = interval.slice(0, -1);

  switch (unit) {
    case "h":
      return `${value} hour${value === "1" ? "" : "s"}`;
    case "d":
      return `${value} day${value === "1" ? "" : "s"}`;
    case "w":
      return `${value} week${value === "1" ? "" : "s"}`;
    case "m":
      return `${value} month${value === "1" ? "" : "s"}`;
    case "y":
      return `${value} year${value === "1" ? "" : "s"}`;
    default:
      return interval;
  }
};

const SubscriptionStoreTab: FC<SubscriptionStoreTabProps> = ({ updateUserData }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
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

  const handlePurchase = async () => {
    if (!selectedSubscription || !user) return;

    setIsPurchasing(true);
    try {
      // Use server action
      const result = await purchaseSubscription(selectedSubscription._id, user.id);

      if (result.success) {
        toast.success(result.message);

        // Update user's balance locally
        setUser((prev) => (prev ? { ...prev, accountMoney: result.newBalance } : prev));

        // Refresh user data from server to ensure everything is in sync
        fetchUserData();

        // Call the updateUserData function to refresh user data in parent component
        if (updateUserData) {
          updateUserData();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error purchasing subscription:", error);
      toast.error("Failed to purchase subscription");
    } finally {
      // Reset the purchasing state
      setIsPurchasing(false);
      // Reset the selected subscription
      setSelectedSubscription(null);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto px-5">
      <div className="flex items-center justify-between p-4 border-b border-light-600/20">
        <h2 className="text-2xl font-medium text-white">Available Subscriptions</h2>
      </div>

      {/* Subscription Cards - Full Width */}
      <div className="space-y-4 mt-6">
        {isLoadingSubscriptions ? (
          // Loading state
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="p-6 rounded-lg border border-gray-500/30 bg-dark-300/50 flex flex-col h-24 animate-pulse"
              >
                <div className="h-4 bg-gray-600/30 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-600/30 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-600/30 rounded w-5/6 mb-4"></div>
              </div>
            ))
        ) : subscriptions.length === 0 ? (
          // Empty state
          <div className="text-center py-10 text-gray-400">
            <p>No subscriptions available.</p>
          </div>
        ) : (
          // Subscription cards - full width
          subscriptions.map(
            (subscription) =>
              subscription.active && (
                <div
                  key={subscription._id}
                  className={`dark-gradient p-6 rounded-lg border ${
                    subscription.active ? "border-primary-200/30" : "border-gray-500/30"
                  } bg-dark-300/50 flex flex-row items-center h-full`}
                >
                  {/* Subscription information */}
                  <div className="flex-grow">
                    {/* Card header with name and status */}
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-medium text-white mr-3">{subscription.name}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                          subscription.name.toLowerCase().includes("spotify")
                            ? "bg-yellow-400 text-black" // New color for "Experimental"
                            : "bg-primary-100 text-dark-100" // Default color for "Available"
                        }`}
                      >
                        {subscription.name.toLowerCase().includes("spotify") ? "Experimental" : "Available"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-light-400 text-sm mb-2">
                      {subscription.description || "No description available"}
                    </p>

                    {/* Renewal interval */}
                    <div className="text-sm bg-dark-200 inline-block px-2 py-1 rounded-full text-light-400">
                      {formatRenewalInterval(subscription.renewalInterval)}
                    </div>
                  </div>

                  {/* Price and action button */}
                  <div className="flex flex-col items-end justify-between gap-4">
                    <div className="text-2xl font-bold text-primary-100">${subscription.price.toFixed(2)}</div>

                    {/* Shopping cart button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-2 rounded-full transition-colors cursor-pointer bg-primary-600/20 text-primary-300 hover:text-primary-200"
                          title="Purchase"
                          onClick={() => setSelectedSubscription(subscription)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                          </svg>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="!z-50 !dark-gradient !rounded-2xl !card-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to purchase this subscription?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="btn-secondary">Cancel</AlertDialogCancel>
                          <AlertDialogAction className="btn-primary" onClick={handlePurchase} disabled={isPurchasing}>
                            {isPurchasing ? "Processing..." : "Purchase"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )
          )
        )}
      </div>
    </div>
  );
};

export default SubscriptionStoreTab;
