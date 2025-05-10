import { FC } from "react";

interface SubscriptionHeaderProps {
  subscriptionsCount: number;
}

const SubscriptionHeader: FC<SubscriptionHeaderProps> = ({ subscriptionsCount }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-light-600/20 h-[72px]">
      <h2 className="tab-title">My Subscriptions</h2>
      <div className="text-sm text-light-400">{subscriptionsCount} / 3 Active Subscriptions</div>
    </div>
  );
};

export default SubscriptionHeader;
