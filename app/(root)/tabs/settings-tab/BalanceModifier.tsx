/**
 * @file BalanceModifier.tsx
 * @description This component allows admins to modify the balance of a selected user in the admin panel.
 */

import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  accountMoney: number;
  role: string;
}

interface BalanceModifierProps {
  selectedUser: UserData | null;
  newBalance: string;
  setNewBalance: (balance: string) => void;
  handleUpdateBalance: () => void;
  updating: boolean;
}

const BalanceModifier = ({
  selectedUser,
  newBalance,
  setNewBalance,
  handleUpdateBalance,
  updating,
}: BalanceModifierProps) => {
  if (!selectedUser) return null;

  return (
    <div className="border border-light-600/20 rounded-md p-4 bg-dark-300/30">
      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-primary-100" />
        Modify Balance: {selectedUser.name}
      </h5>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="newBalance" className="block text-light-100 text-sm font-medium mb-1">
            New Balance Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-light-400">$</span>
            </div>
            <input
              type="number"
              id="newBalance"
              placeholder="5000"
              className="block w-full pl-8 pr-3 py-2 border border-light-600/20 rounded-md bg-dark-200 text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-100/40"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              min="0"
            />
          </div>
        </div>

        <Button
          onClick={handleUpdateBalance}
          disabled={updating || newBalance === "" || parseFloat(newBalance) < 0}
          className="bg-primary-200 text-dark-100 hover:bg-primary-200/80 py-2 px-4 rounded-md flex items-center gap-2"
        >
          {updating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4" />
              Update Balance
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BalanceModifier;
