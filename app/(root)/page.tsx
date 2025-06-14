"use client";

import Sidebar from "@/components/Sidebar";
import { LogOut } from "lucide-react";
import { type FC, useEffect, useState } from "react";

// Import for User type definition
import { User } from "@/types/types";

import AllSubscriptionsTab from "./tabs/AllSubscriptionsTab";
import ManagementTab from "./tabs/management-tab";
import SettingsTab from "./tabs/settings-tab";
import SubscriptionStoreTab from "./tabs/subscription-store-tab";
import SubscriptionTab from "./tabs/subscription-tab";

const SubscriptionTracker: FC = () => {
  // Store user data
  const [user, setUser] = useState<User | null>(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error message storage
  const [error, setError] = useState<string | null>(null);

  // Track active tab
  const [activeTab, setActiveTab] = useState<string>("subscriptions");

  // Timestamp used to trigger data refresh
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Logout loading state
  const [logoutLoading, setLogoutLoading] = useState(false);

  /**
   * Fetch user data when component mounts or lastUpdated changes
   */
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/me");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        // Update user data
        setUser(data.user as User);
        // Clear any errors
        setError(null);
      } catch (err) {
        // Log error for debugging
        console.error("Error fetching user data:", err);
        // Set error message
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        // Reset user data
        setUser(null);
      } finally {
        // End loading state
        setLoading(false);
      }
    };

    fetchUserData();
    // Run when component mounts and when lastUpdated changes
  }, [lastUpdated]);

  /**
   * Handle tab changes when user clicks different navigation items
   * Refreshes user data when switching to subscription store
   */
  const handleTabChange = (tab: string) => {
    // Update active tab
    setActiveTab(tab);

    // Refresh user data when opening store tab
    // Makes sure we have current balance before purchases
    if (tab === "subscription-store") {
      setLastUpdated(Date.now());
    }
  };

  /**
   * Function for child components to trigger user data refresh
   */
  const updateUserData = () => {
    setLastUpdated(Date.now());
  };

  /**
   * Handle user logout
   */
  const handleSignOut = async () => {
      try {
        setLogoutLoading(true);
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (response.ok) {
          window.location.href = "/";
        } else {
          console.error("Failed to sign out");
        }
      } catch (error) {
        console.error("Error signing out:", error);
      }finally{
        setLogoutLoading(false);
      }
    };

  /**
   * Renders the appropriate component based on active tab
   * Will be replaced with State pattern in future refactoring
   */
  const renderTabContent = () => {
    // Choose component based on active tab
    // This will be replaced with State Design Pattern in the future
    switch (activeTab) {
      case "subscriptions":
        return <SubscriptionTab />;
      case "subscription-store":
        // Pass update function to allow refresh after purchases
        return <SubscriptionStoreTab updateUserData={updateUserData} />;
      case "management":
        return <ManagementTab />;
      case "all-subscriptions":
        return <AllSubscriptionsTab />;
      case "settings":
        // Pass update function
        return <SettingsTab updateUserData={updateUserData} />;
      // Default to subscriptions tab
      default:
        return <SubscriptionTab />;
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:p-8 md:p-10 pb-28 md:pb-10 flex items-center justify-center bg-dark-500">
      <div className="card-border w-full max-w-5xl min-h-[500px] max-h-[800px] h-[min(calc(100vh-4rem),900px)] sm:h-[min(calc(80vh-4rem),800px)] md:h-[min(calc(70vh-4rem),700px)] lg:h-[min(calc(60vh-4rem),700px)]">
        <div className="card p-3 sm:p-5 md:p-7 h-full flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-7 border-b border-light-600/20 pb-3 sm:pb-5 gap-3 sm:gap-0">
            {/* Sign Out button */}
            <button
              onClick={handleSignOut}
              className="flex items-center text-light-100 text-sm sm:text-base font-medium cursor-pointer hover:bg-light-600/20 rounded-md px-2 py-1 "
              aria-label="Sign Out"
              disabled={logoutLoading}
            >
             {/* Loader for logout */}
              {logoutLoading ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-light-100"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut size={20} className="mr-2 sm:mr-3" />
                  <span className="text-sm sm:text-base font-medium">Sign Out</span>
                </>
              )}
            </button>
            {/* User information display (Name and Account Money) */}
            <div className="flex space-x-3 w-full sm:w-auto justify-end">
              <span className="text-light-100 text-sm sm:text-base font-medium flex items-center">
                {/* Show different content based on loading state */}
                {loading ? (
                  "Loading..."
                ) : error ? (
                  "Error loading user"
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-1.5"
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
                    {/* Truncate long usernames */}
                    {user?.name
                      ? (() => {
                          return user.name.length > 10 ? `${user.name.substring(0, 10)}...` : user.name;
                        })()
                      : ""}
                  </>
                )}
              </span>
              {/* Account balance display */}
              <span className="text-light-100 text-sm sm:text-base font-medium flex items-center">
                {/* Show different content based on loading state */}
                {loading ? (
                  "Loading..."
                ) : error ? (
                  "Error loading user's money"
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-1.5"
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
                    ${/* Format money with 2 decimal places */}
                    {user?.accountMoney?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </>
                )}
              </span>
            </div>
          </div>
          {/* Main content area with Sidebar and Tab Content */}
          <div className="flex flex-1 overflow-hidden mt-1 sm:mt-2">
            {/* Sidebar navigation */}
            <Sidebar activePage={activeTab} onTabChange={handleTabChange} />
            {/* Tab content container */}
            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
              {/* Display active tab content */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTracker;
