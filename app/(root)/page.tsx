"use client";

import Sidebar from "@/components/Sidebar";
import { LogOut } from "lucide-react";
import { type FC, useEffect, useState } from "react";

// Import the tab components
import AllSubscriptionsTab from "./tabs/AllSubscriptionsTab";
import ManagementTab from "./tabs/ManagementTab";
import SettingsTab from "./tabs/SettingsTab";
import SubscriptionStoreTab from "./tabs/SubscriptionStoreTab";
import SubscriptionTab from "./tabs/SubscriptionTab";

interface User {
  id: string;
  name: string;
  email: string;
  accountMoney: number;
  role?: string;
}

const SubscriptionTracker: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("subscriptions");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        setUser(data.user as User);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Add signOut handler
  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Redirect to home/login page
        window.location.href = "/";
      } else {
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "subscriptions":
        return <SubscriptionTab />;
      case "subscription-store":
        return <SubscriptionStoreTab />;
      case "management":
        return <ManagementTab />;
      case "all-subscriptions":
        return <AllSubscriptionsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <SubscriptionTab />;
    }
  };

  return (
    <div className="min-h-screen p-10 pb-28 md:pb-10 flex items-center justify-center bg-dark-500">
      <div className="card-border w-full max-w-5xl h-[calc(60vh-5rem)]">
        <div className="card p-7 h-full flex flex-col">
          <div className="flex justify-between items-center mb-7 border-b border-light-600/20 pb-5">
            <button
              onClick={handleSignOut}
              className="flex items-center text-light-100 text-base font-medium cursor-pointer"
              aria-label="Sign Out"
            >
              <LogOut size={22} className="mr-3" />
              <span className="text-base font-medium">Sign Out</span>
            </button>
            <div className="flex space-x-3">
              <span className="text-light-100 text-base font-medium flex items-center">
                {loading ? (
                  "Loading..."
                ) : error ? (
                  "Error loading user"
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {user?.name
                      ? (() => {
                          return user.name.length > 10 ? `${user.name.substring(0, 10)}...` : user.name;
                        })()
                      : ""}
                  </>
                )}
              </span>
              <span className="text-light-100 text-base font-medium flex items-center">
                {loading ? (
                  "Loading..."
                ) : error ? (
                  "Error loading user's money"
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    $
                    {user?.accountMoney?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden mt-2">
            <Sidebar activePage={activeTab} onTabChange={handleTabChange} />
            <div className="flex-1 overflow-y-auto pr-2">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTracker;
