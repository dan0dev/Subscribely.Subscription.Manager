import { FC } from "react";

const SubscriptionsSkeleton: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="p-6 rounded-lg border border-gray-500/30 bg-dark-300/50 flex flex-col h-48 animate-pulse"
          >
            <div className="h-4 bg-gray-600/30 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-600/30 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-600/30 rounded w-5/6 mb-4"></div>
            <div className="mt-auto h-6 bg-gray-600/30 rounded w-1/4"></div>
          </div>
        ))}
    </div>
  );
};

export default SubscriptionsSkeleton;
