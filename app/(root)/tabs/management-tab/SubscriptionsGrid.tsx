import { FC } from "react";
import SubscriptionCard from "./SubscriptionCard";
import SubscriptionsEmptyState from "./SubscriptionsEmptyState";
import SubscriptionsSkeleton from "./SubscriptionsSkeleton";
import { Subscription } from "./types";

interface SubscriptionsGridProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

const SubscriptionsGrid: FC<SubscriptionsGridProps> = ({ subscriptions, isLoading, onDelete, isDeleting }) => {
  if (isLoading) {
    return <SubscriptionsSkeleton />;
  }

  if (subscriptions.length === 0) {
    return <SubscriptionsEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription._id}
          subscription={subscription}
          onDelete={onDelete}
          isDeleting={isDeleting === subscription._id}
        />
      ))}
    </div>
  );
};

export default SubscriptionsGrid;
