"use client";

import Sidebar from "@/components/Sidebar";
import { LogOut } from "lucide-react";
import { type FC, useEffect, useState } from "react";

// Import the type definition for the User object.
import { User } from "@/types/types";

import AllSubscriptionsTab from "./tabs/AllSubscriptionsTab";
import ManagementTab from "./tabs/ManagementTab";
import SettingsTab from "./tabs/SettingsTab";
import SubscriptionStoreTab from "./tabs/SubscriptionStoreTab";
import SubscriptionTab from "./tabs/SubscriptionTab";

const SubscriptionTracker: FC = () => {
  // State variable to store the fetched user data. Initialized to null.
  const [user, setUser] = useState<User | null>(null);

  // State variable to track the loading status of user data fetching. Initialized to true.
  const [loading, setLoading] = useState(true);

  // State variable to store any error message during data fetching. Initialized to null.
  const [error, setError] = useState<string | null>(null);

  // State variable to keep track of the currently active tab. Initialized to 'subscriptions'.
  const [activeTab, setActiveTab] = useState<string>("subscriptions");

  // State variable to trigger user data refetching. Stores a timestamp.
  // Initialized with the current time. Changing this value triggers the useEffect hook.
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  /**
   * @effect useEffect hook to fetch user data on component mount and when `lastUpdated` changes.
   * This hook defines an async function `fetchUserData` to make an API call
   * to retrieve the current user's information.
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

        // Update the user state with the fetched user data.
        setUser(data.user as User);
        // Clear any previous error messages.
        setError(null);
      } catch (err) {
        // Debugging error.
        console.error("Error fetching user data:", err);
        // Update the error state with the error message.
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        // Set user state back to null in case of an error.
        setUser(null);
      } finally {
        // Set loading state to false once the fetch attempt is complete (success or failure).
        setLoading(false);
      }
    };

    fetchUserData();
    // []: This effect runs when the component mounts and whenever `lastUpdated` changes.
  }, [lastUpdated]);

  /**
   * @function handleTabChange
   * @description Updates the active tab state when a user clicks on a different tab in the Sidebar.
   * It also triggers a user data refresh specifically when switching to the 'subscription-store' tab.
   * @param {string} tab - The identifier of the tab to switch to.
   */
  const handleTabChange = (tab: string) => {
    // Update the state variable that controls which tab is currently displayed.
    setActiveTab(tab);

    // When switching specifically to the 'subscription-store' tab,
    // update `lastUpdated` to trigger the useEffect hook and refetch user data.
    // Ensures the user's current money is up-to-date before they try to buy a subscription.
    if (tab === "subscription-store") {
      setLastUpdated(Date.now());
    }
  };

  /**
   * @function updateUserData
   * @description Provides a way for child components (like SubscriptionStoreTab)
   * to trigger a refresh of the user data in this parent component.
   * It works by updating the `lastUpdated` state variable, which causes the
   * useEffect hook responsible for fetching user data to run again.
   */
  const updateUserData = () => {
    setLastUpdated(Date.now());
  };

  /**
   * @function handleSignOut
   * @description Handles the user sign-out process by making an API call
   * to the logout endpoint and redirecting the user upon success.
   */
  const handleSignOut = async () => {
    try {
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
    }
  };

  /**
   * @function renderTabContent
   * @description Determines which tab component to render based on the `activeTab` state.
   * @returns {JSX.Element} The component corresponding to the active tab.
   */
  const renderTabContent = () => {
    // Use a switch statement to select the component based on the active tab's identifier.
    // a későbbiekben State Design Pattern implementálásával a switch statement helyett State objektumot használunk

    switch (activeTab) {
      case "subscriptions":
        return <SubscriptionTab />;
      case "subscription-store":
        // Pass the `updateUserData` function as a prop to allow the store tab
        // to trigger data refreshes (e.g., after purchasing a subscription).
        return <SubscriptionStoreTab updateUserData={updateUserData} />;
      case "management":
        return <ManagementTab />;
      case "all-subscriptions":
        return <AllSubscriptionsTab />;
      case "settings":
        return <SettingsTab />;
      // Default case renders the main 'subscriptions' tab if the activeTab value is unrecognized.
      default:
        return <SubscriptionTab />;
    }
  };

  return (
    <div className="min-h-screen p-10 pb-28 md:pb-10 flex items-center justify-center bg-dark-500">
      <div className="card-border w-full max-w-5xl h-[calc(60vh-5rem)]">
        <div className="card p-7 h-full flex flex-col">
          <div className="flex justify-between items-center mb-7 border-b border-light-600/20 pb-5">
            {/* Sign Out button */}
            <button
              onClick={handleSignOut}
              className="flex items-center text-light-100 text-base font-medium cursor-pointer"
              aria-label="Sign Out"
            >
              <LogOut size={22} className="mr-3" /> {/* Sign out icon */}
              <span className="text-base font-medium">Sign Out</span>
            </button>
            {/* User information display (Name and Account Money) */}
            <div className="flex space-x-3">
              <span className="text-light-100 text-base font-medium flex items-center">
                {/* Conditional rendering based on loading and error states */}
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
                    {/* Display user name, truncated if longer than 10 characters. */}
                    {user?.name
                      ? (() => {
                          return user.name.length > 10 ? `${user.name.substring(0, 10)}...` : user.name;
                        })()
                      : ""}
                  </>
                )}
              </span>
              {/* User Account Money Display */}
              <span className="text-light-100 text-base font-medium flex items-center">
                {/* Conditional rendering based on loading and error states */}
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
                    ${/* Format the account money as a US dollar amount with two decimal places. */}
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
          <div className="flex flex-1 overflow-hidden mt-2">
            {/* Sidebar component */}
            <Sidebar activePage={activeTab} onTabChange={handleTabChange} />
            {/* Container for the active tab's content */}
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Render the content of the currently selected tab */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTracker;
