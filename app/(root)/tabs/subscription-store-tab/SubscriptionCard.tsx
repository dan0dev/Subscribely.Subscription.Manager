"use client";
import { Subscription } from "@/types/types";
import { FC } from "react";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPurchaseClick: () => void;
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

const SubscriptionCard: FC<SubscriptionCardProps> = ({ subscription, onPurchaseClick }) => {
  return (
    <div
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
        <p className="text-light-400 text-sm mb-2">{subscription.description || "No description available"}</p>

        {/* Renewal interval */}
        <div className="text-sm bg-dark-200 inline-block px-2 py-1 rounded-full text-light-400">
          {formatRenewalInterval(subscription.renewalInterval)}
        </div>
      </div>

      {/* Price and action button */}
      <div className="flex flex-col items-end justify-between gap-4">
        <div className="text-2xl font-bold text-primary-100">${subscription.price.toFixed(2)}</div>

        {/* Shopping cart button */}
        <button
          className="p-2 rounded-full transition-colors cursor-pointer bg-primary-600/20 text-primary-300 hover:text-primary-200"
          title="Purchase"
          onClick={onPurchaseClick}
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
      </div>
    </div>
  );
};

export default SubscriptionCard;
