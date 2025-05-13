import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { FC } from "react";

const NoSubscriptions: FC = () => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-12">
            <div className="flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="w-8 h-8 text-light-400" />
              <span className="text-light-400 text-lg">No active subscriptions found</span>
              <p className="text-light-600 text-sm max-w-md">
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
