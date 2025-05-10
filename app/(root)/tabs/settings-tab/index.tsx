"use client";

import { searchUsers, updateUserBalance } from "@/lib/actions/adminActions";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import AdminPanel from "./AdminPanel";
import AdminPanelLoadingState from "./AdminPanelLoadingState";
import DangerZone from "./DangerZone";
import Divider from "./Divider";
import SettingsToggle from "./SettingsToggle";

interface UserData {
  id: string;
  name: string;
  email: string;
  accountMoney: number;
  role: string;
}

interface SettingsTabProps {
  updateUserData?: () => void;
}

const SettingsTab: FC<SettingsTabProps> = ({ updateUserData }) => {
  const [user, setUser] = useState<{ role: string; id?: string } | null>(null);
  const [adminPanelLoading, setAdminPanelLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [newBalance, setNewBalance] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/user/me");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          // Set adminPanelLoading to false regardless of role
          // The admin panel will only be shown if user.role === "admin"
          setAdminPanelLoading(false);
        } else {
          throw new Error(data.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
        setAdminPanelLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Search for users
  const handleSearch = async () => {
    if (searchTerm.trim().length < 3) {
      toast.error("Search term must be at least 3 characters long.");
      return;
    }

    setSearching(true);
    try {
      const result = await searchUsers(searchTerm);
      if (result.success && result.users) {
        setSearchResults(result.users);
      } else {
        toast.error(result.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching for users:", error);
      toast.error("An unexpected error occurred during the search.");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Update balance
  const handleUpdateBalance = async () => {
    if (!selectedUser) return;

    const balanceValue = parseFloat(newBalance);
    if (isNaN(balanceValue) || balanceValue < 0) {
      toast.error("Invalid amount. The amount must be a positive number.");
      return;
    }

    setUpdating(true);
    try {
      const result = await updateUserBalance(selectedUser.id, balanceValue);
      if (result.success) {
        toast.success(result.message);

        // Update the user in the list with the new balance
        setSearchResults((prev) =>
          prev.map((user) => (user.id === selectedUser.id ? { ...user, accountMoney: balanceValue } : user))
        );

        // Update the selected user
        setSelectedUser((prev) => (prev ? { ...prev, accountMoney: balanceValue } : null));
        setNewBalance("");

        // If the modified user is the same as the logged-in user, update the navigation bar as well
        if (user?.id === selectedUser.id && updateUserData) {
          updateUserData();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating user balance:", error);
      toast.error("An unexpected error occurred while updating the balance.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex items-center justify-between p-4 border-b border-light-600/20 h-[72px]">
        <h2 className="tab-title">Settings</h2>
      </div>

      <div className="px-5">
        {/* Admin Panel section - only visible to admins */}
        {user && user.role === "admin" && (
          <>
            {adminPanelLoading ? (
              <AdminPanelLoadingState />
            ) : (
              <AdminPanel
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                searching={searching}
                searchResults={searchResults}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                newBalance={newBalance}
                setNewBalance={setNewBalance}
                handleUpdateBalance={handleUpdateBalance}
                updating={updating}
              />
            )}
            <Divider />
          </>
        )}

        {/* Settings Toggles */}
        <SettingsToggle
          title="Subscription Auto-Renewal"
          description="Enable or disable automatic renewal of your subscription. (This feature is currently disabled)."
          disabled={true}
        />
        <Divider />

        <SettingsToggle
          title="Automatic Email Messages"
          description="Enable or disable automatic email messages from the app. (This feature is currently enabled)."
          checked={true}
          disabled={true}
        />
        <Divider />

        {/* Danger Zone */}
        <DangerZone />
        <Divider />
      </div>
    </div>
  );
};

export default SettingsTab;
