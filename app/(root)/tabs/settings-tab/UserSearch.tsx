/**
 * @file UserSearch.tsx
 * @description This component provides a search input and button for searching users in the admin panel (frontend only)
 */

import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  searching: boolean;
}

const UserSearch = ({ searchTerm, setSearchTerm, handleSearch, searching }: UserSearchProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-light-400" />
        </div>
        <input
          type="text"
          placeholder="Search for users by name or email..."
          className="block w-full pl-10 pr-3 py-2 border border-light-600/20 rounded-md bg-dark-200 text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-100/40"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <Button
        onClick={handleSearch}
        disabled={searching || searchTerm.trim().length < 3}
        className="bg-primary-200 text-dark-100 hover:bg-primary-200/80 font-medium py-2 px-4 rounded-md flex items-center gap-2"
      >
        {searching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        Search
      </Button>
    </div>
  );
};

export default UserSearch;
