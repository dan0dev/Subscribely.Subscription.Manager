import { FC } from "react";

const SubscriptionsEmptyState: FC = () => {
  return (
    <div className="col-span-3 text-center py-10 text-gray-400">
      <p>No subscriptions found. Create a new one!</p>
    </div>
  );
};

export default SubscriptionsEmptyState;
