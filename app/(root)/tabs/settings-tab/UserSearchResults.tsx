/**
 * @file UserSearchResults.tsx
 * @description This component displays the search results for users in the admin panel.
 */

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  accountMoney: number;
  role: string;
}

interface UserSearchResultsProps {
  searchResults: UserData[];
  selectedUser: UserData | null;
  setSelectedUser: (user: UserData) => void;
  setNewBalance: (balance: string) => void;
}

const UserSearchResults = ({ searchResults, selectedUser, setSelectedUser, setNewBalance }: UserSearchResultsProps) => {
  if (searchResults.length === 0) return null;

  return (
    <div className="border border-light-600/20 rounded-md overflow-hidden mb-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-dark-300/70 border-b border-light-600/20">
            <tr>
              <th className="px-4 py-3 text-light-100 font-medium">Name</th>
              <th className="px-4 py-3 text-light-100 font-medium">Email</th>
              <th className="px-4 py-3 text-light-100 font-medium">Balance</th>
              <th className="px-4 py-3 text-light-100 font-medium">Role</th>
              <th className="px-4 py-3 text-light-100 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((user) => (
              <tr
                key={user.id}
                className={`border-b border-light-600/20 hover:bg-dark-300/50 cursor-pointer ${
                  selectedUser?.id === user.id ? "bg-dark-300/70" : ""
                }`}
                onClick={() => {
                  setSelectedUser(user);
                  setNewBalance(user.accountMoney.toString());
                }}
              >
                <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-light-400" />
                  {user.name}
                </td>
                <td className="px-4 py-3 text-light-100">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="font-mono bg-dark-300/60 px-2 py-1 rounded text-primary-100">
                    ${user.accountMoney.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      user.role === "admin"
                        ? "bg-purple-500/20 text-purple-300"
                        : user.role === "tester"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    className="bg-primary-200 text-dark-100 hover:bg-primary-200/80 py-1 px-3 rounded-md text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                      setNewBalance(user.accountMoney.toString());
                    }}
                  >
                    Select
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSearchResults;
