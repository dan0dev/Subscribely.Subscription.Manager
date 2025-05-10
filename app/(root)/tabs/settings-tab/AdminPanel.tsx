/**
 * @file AdminPanel.tsx
 * @description This component provides an admin panel for modifying user balances and searching for users.
 */
import { Lock } from "lucide-react";
import BalanceModifier from "./BalanceModifier";
import UserSearch from "./UserSearch";
import UserSearchResults from "./UserSearchResults";

/**
 * @interface UserData
 * @description Represents user information displayed in the admin panel.
 */
interface UserData {
  id: string;
  name: string;
  email: string;
  accountMoney: number;
  role: string;
}

/**
 * @interface AdminPanelProps
 * @description Props required by the AdminPanel component.
 */
interface AdminPanelProps {
  /** Search term string entered by the user */
  searchTerm: string;
  /** Function to update search term */
  setSearchTerm: (term: string) => void;
  /** Function to execute user search */
  handleSearch: () => void;
  /** Flag indicating if search is in progress */
  searching: boolean;
  /** List of users matching the search query */
  searchResults: UserData[];
  /** Currently selected user or null if none selected */
  selectedUser: UserData | null;
  /** Function to update selected user */
  setSelectedUser: (user: UserData) => void;
  /** New balance value as string */
  newBalance: string;
  /** Function to update the new balance value */
  setNewBalance: (balance: string) => void;
  /** Function to handle balance update operation */
  handleUpdateBalance: () => void;
  /** Flag indicating if balance update is in progress */
  updating: boolean;
}

/**
 * AdminPanel component that provides user management capabilities for admin users.
 * Includes functionality for searching users and modifying their account balances.
 *
 * @param {AdminPanelProps} props - Component props
 * @returns {JSX.Element} The rendered AdminPanel component
 */
const AdminPanel = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  searching,
  searchResults,
  selectedUser,
  setSelectedUser,
  newBalance,
  setNewBalance,
  handleUpdateBalance,
  updating,
}: AdminPanelProps) => {
  return (
    <div className="mt-8 flex flex-col">
      <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
        <Lock className="w-5 h-5 text-primary-100" />
        Admin Panel
      </h3>
      <p className="text-light-400 text-sm mb-5">Special functions for admin users. Be careful with these settings!</p>
      <div className="bg-dark-300/50 rounded-lg p-4 border border-light-600/20">
        <h4 className="text-lg font-medium text-white mb-3">Modify User Balance</h4>
        <UserSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          searching={searching}
        />
        <UserSearchResults
          searchResults={searchResults}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setNewBalance={setNewBalance}
        />
        <BalanceModifier
          selectedUser={selectedUser}
          newBalance={newBalance}
          setNewBalance={setNewBalance}
          handleUpdateBalance={handleUpdateBalance}
          updating={updating}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
