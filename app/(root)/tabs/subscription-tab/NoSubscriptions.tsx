import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { FC } from "react";

const NoSubscriptions: FC = () => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8 sm:py-12">
            <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2">
              <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-light-400" />
              <span className="text-light-400 text-base sm:text-lg">No active subscriptions found</span>
              <p className="text-light-600 text-xs sm:text-sm max-w-xs sm:max-w-md px-4 sm:px-0">
                Browse the subscription store to find services you can subscribe to.
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default NoSubscriptions;
