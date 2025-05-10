"use client";
import { purchaseSubscription } from "@/lib/actions/purchase.action";
import { Subscription, User } from "@/types/types";
import { FC, useState } from "react";
import { toast } from "sonner";
import PurchaseDialog from "./PurchaseDialog";
import SubscriptionCard from "./SubscriptionCard";

interface SubscriptionsListProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  user: User | null;
  onPurchaseSuccess: () => void;
}

const SubscriptionsList: FC<SubscriptionsListProps> = ({ subscriptions, isLoading, user, onPurchaseSuccess }) => {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {Array(3)
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
          ))}
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p>No subscriptions available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {subscriptions.map(
        (subscription) =>
          subscription.active && (
            <SubscriptionCard
              key={subscription._id}
              subscription={subscription}
              onPurchaseClick={() => setSelectedSubscription(subscription)}
            />
          )
      )}

      <PurchaseDialog
        subscription={selectedSubscription}
        isOpen={!!selectedSubscription}
        isPurchasing={isPurchasing}
        onClose={() => setSelectedSubscription(null)}
        onPurchase={async () => {
          if (!selectedSubscription || !user) return;
          setIsPurchasing(true);
          try {
            const result = await purchaseSubscription(selectedSubscription._id, user.id);
            if (result.success) {
              toast.success(`Successfully purchased ${selectedSubscription.name}!`);
              onPurchaseSuccess();
            } else {
              toast.error(result.message || "Failed to purchase subscription");
            }
          } catch (error) {
            toast.error(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
          } finally {
            setIsPurchasing(false);
            setSelectedSubscription(null);
          }
        }}
      />
    </div>
  );
};

export default SubscriptionsList;
