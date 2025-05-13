import { RefreshCw, X } from "lucide-react";
import { FC, useRef, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cancelUserSubscription } from "@/lib/actions/userSubscriptions.action";
import { Subscription } from "./index";
import NoSubscriptions from "./NoSubscriptions";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  cancelInProgress: string | null;
  setCancelInProgress: (id: string | null) => void;
  onSubscriptionCancelled: (id: string) => void;
}

const SubscriptionTable: FC<SubscriptionTableProps> = ({
  subscriptions,
  cancelInProgress,
  setCancelInProgress,
  onSubscriptionCancelled,
}) => {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const cancelButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    setCancelInProgress(subscriptionId);

    try {
      console.log("Frontend: Cancelling subscription:", subscriptionId);
      const result = await cancelUserSubscription(subscriptionId);
      console.log("Frontend: Cancel result:", result);

      if (result.success) {
        // Get the subscription name for the toast message
        const cancelledSub = subscriptions.find((sub) => sub.id === subscriptionId);
        const successMessage = `Successfully cancelled ${cancelledSub?.name || "subscription"}`;
        console.log(`Frontend: ${successMessage}`);

        // Show success toast
        toast.success(successMessage);

        // Remove the cancelled subscription from the list
        onSubscriptionCancelled(subscriptionId);

        // Close the dialog
        if (cancelButtonRefs.current[subscriptionId]) {
          cancelButtonRefs.current[subscriptionId]?.click();
        }
        setDialogOpen(null);
      } else {
        // Show error toast
        toast.error(result.message || "Failed to cancel subscription");
        console.error("Frontend: Failed to cancel subscription:", result);
      }
    } catch (error) {
      console.error("Frontend: Error in cancel subscription:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setCancelInProgress(null);
    }
  };

  if (subscriptions.length === 0) {
    return <NoSubscriptions />;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse w-full min-w-[650px]">
        <TableHeader>
          <TableRow className="bg-dark-300/70 border-b border-light-600/20">
            <TableHead className="text-light-100 w-14 sm:w-20 font-medium text-xs sm:text-sm">#</TableHead>
            <TableHead className="text-light-100 font-medium text-xs sm:text-sm">Subscription</TableHead>
            <TableHead className="text-light-100 font-medium text-xs sm:text-sm">Price</TableHead>
            <TableHead className="text-light-100 font-medium text-xs sm:text-sm">Renewal Date</TableHead>
            <TableHead className="text-center text-light-100 w-20 sm:w-28 font-medium text-xs sm:text-sm">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription, index) => (
            <TableRow key={subscription.id} className="border-b border-light-600/20 hover:bg-dark-300/50">
              <TableCell className="font-medium text-light-400 text-xs sm:text-sm py-3 sm:py-4">{index + 1}</TableCell>
              <TableCell className="font-medium text-white text-xs sm:text-sm py-3 sm:py-4">
                {subscription.name}
              </TableCell>
              <TableCell className="py-3 sm:py-4">
                <span className="font-mono bg-dark-300/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-primary-100 text-xs sm:text-sm">
                  ${subscription.price.toFixed(2)}/mo
                </span>
              </TableCell>
              <TableCell className="py-3 sm:py-4">
                <span
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 w-fit ${
                    new Date(subscription.renewalDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                      ? "bg-primary-100/15 text-primary-100"
                      : "bg-primary-200/15 text-primary-200"
                  }`}
                >
                  {formatDate(subscription.renewalDate)}
                </span>
              </TableCell>
              <TableCell className="text-center py-3 sm:py-4">
                <div className="flex justify-center space-x-2">
                  <AlertDialog
                    open={dialogOpen === subscription.id}
                    onOpenChange={(open) => {
                      if (open) {
                        setDialogOpen(subscription.id);
                      } else if (dialogOpen === subscription.id) {
                        setDialogOpen(null);
                      }
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        className="text-light-400 hover:text-destructive-100 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive-100/40 rounded-full p-1.5 cursor-pointer"
                        aria-label={`Cancel ${subscription.name} subscription`}
                        disabled={cancelInProgress === subscription.id}
                      >
                        {cancelInProgress === subscription.id ? (
                          <RefreshCw size={18} className="animate-spin sm:size-[22px]" />
                        ) : (
                          <X size={18} className="sm:size-[22px]" />
                        )}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="!z-50 !dark-gradient !rounded-2xl !card-border max-w-[90vw] sm:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white text-lg sm:text-xl">
                          Cancel Subscription
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-light-400 text-sm sm:text-base">
                          Are you sure you want to cancel your {subscription.name} subscription? This action cannot be
                          undone, and refunds are not available at this time.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4 flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <AlertDialogCancel
                          className="bg-dark-300 text-light-100 hover:bg-dark-200 hover:text-white border-light-600/20 text-xs sm:text-sm w-full sm:w-auto"
                          ref={(element) => {
                            cancelButtonRefs.current[subscription.id] = element;
                          }}
                        >
                          No, keep subscription
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive-100 text-white hover:bg-destructive-200 text-xs sm:text-sm w-full sm:w-auto"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default action from closing dialog immediately
                            handleCancelSubscription(subscription.id);
                          }}
                          disabled={cancelInProgress === subscription.id}
                        >
                          {cancelInProgress === subscription.id ? "Cancelling..." : "Yes, cancel"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscriptionTable;
