import { FC } from "react";
import { Subscription } from "./types";

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: string) => void;
  isDeleting: boolean;
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

const SubscriptionCard: FC<SubscriptionCardProps> = ({ subscription, onDelete, isDeleting }) => {
  return (
    <div
      className={`dark-gradient p-6 rounded-lg border ${
        subscription.active ? "border-primary-200/30" : "border-gray-500/30"
      } bg-dark-300/50 flex flex-col h-full`}
    >
      {/* Card header with name and status */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-white truncate mr-2">{subscription.name}</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
            subscription.active ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {subscription.active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Description */}
      <p className="text-light-400 text-[0.7rem] mb-3 flex-grow">(Check the description within the database)</p>

      {/* Price and renewal interval */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg text-primary-100">${subscription.price.toFixed(2)}</div>
        <div className="text-sm bg-dark-200 px-2 py-1 rounded-full text-light-400">
          {formatRenewalInterval(subscription.renewalInterval)}
        </div>
      </div>

      {/* Action buttons container at the bottom */}
      <div className="flex justify-end items-center gap-2 mt-auto pt-2 border-t border-gray-700/30">
        {/* Reserve space for future icons */}
        <div className="flex-grow"></div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(subscription._id)}
          disabled={isDeleting}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isDeleting ? "bg-red-500/10 text-red-300/50" : "bg-red-500/10 text-red-300 hover:bg-red-500/20"
          }`}
          title="Delete subscription"
        >
          {isDeleting ? (
            <div className="h-4 w-4 border-2 border-red-300/50 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
