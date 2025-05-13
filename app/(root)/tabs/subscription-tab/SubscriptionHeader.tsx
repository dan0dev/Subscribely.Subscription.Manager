import { FC } from "react";

interface SubscriptionHeaderProps {
  subscriptionsCount: number;
}

const SubscriptionHeader: FC<SubscriptionHeaderProps> = ({ subscriptionsCount }) => {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-light-600/20 h-[60px] sm:h-[72px]">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white">My Subscriptions</h2>
      <div className="text-xs sm:text-sm text-light-400">{subscriptionsCount} / 3 Active Subscriptions</div>
    </div>
  );
};

export default SubscriptionHeader;
