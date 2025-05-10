"use client";

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
import { cancelUserSubscription, getUserSubscriptions } from "@/lib/actions/userSubscriptions.action";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  name: string;
  price: number;
  renewalDate: Date;
  description?: string;
}

const SubscriptionTab: FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [cancelInProgress, setCancelInProgress] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  // Reference to store the cancel buttons for each dialog
  const cancelButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Add debugging for initial mount
  useEffect(() => {
    console.log("SubscriptionTab component mounted");
    return () => {
      console.log("SubscriptionTab component unmounted");
    };
  }, []);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log("Fetching user data...");
        const response = await fetch("/api/user/me");

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const data = await response.json();
        console.log("User data response:", data);

        // From the API response we can see the user ID is in data.user.id
        if (data.success && data.user && data.user.id) {
          console.log("User ID set:", data.user.id);
          setUserId(data.user.id);
        } else {
          console.error("No valid user ID found in response:", data);
          toast.error("Failed to get your user ID. Please try refreshing.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Please try again.");
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Fetch user subscriptions
  useEffect(() => {
    async function fetchSubscriptions() {
      if (!userId) return;

      try {
        console.log("Fetching subscriptions for user:", userId);
        const data = await getUserSubscriptions(userId);
        console.log("Subscription data received:", data);

        const typedData: Subscription[] = data as Subscription[];
        setSubscriptions(typedData);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        toast.error("Failed to fetch your subscriptions. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchSubscriptions();
    }
  }, [userId]);

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
        setSubscriptions((prevSubscriptions) => prevSubscriptions.filter((sub) => sub.id !== subscriptionId));

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

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-hidden border-light-600/20 bg-dark-400/50">
        <div className="flex items-center justify-between p-4 border-b border-light-600/20">
          <h2 className="text-xl font-semibold text-white">My Subscriptions</h2>
          <div className="text-sm text-light-400">Loading...</div>
        </div>
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 text-primary-100 animate-spin" />
          <span className="ml-3 text-light-400">Loading subscription data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden border-light-600/20 bg-dark-400/50 px-5">
      <div className="flex items-center justify-between p-4 border-b border-light-600/20">
        <h2 className="text-2xl font-medium text-white">My Subscriptions</h2>
        <div className="text-sm text-light-400">{subscriptions.length} / 3 Active Subscriptions</div>
      </div>

      <div className="overflow-x-auto">
        <Table className="border-collapse w-full">
          <TableHeader>
            <TableRow className="bg-dark-300/70 border-b border-light-600/20">
              <TableHead className="text-light-100 w-20 font-medium">#</TableHead>
              <TableHead className="text-light-100 font-medium">Subscription</TableHead>
              <TableHead className="text-light-100 font-medium">Price</TableHead>
              <TableHead className="text-light-100 font-medium">Renewal Date</TableHead>
              <TableHead className="text-center text-light-100 w-28 font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription, index) => (
              <TableRow
                key={subscription.id}
                className="border-b border-light-600/20 hover:bg-dark-300/50 animate-fadeIn"
              >
                <TableCell className="font-medium text-light-400">{index + 1}</TableCell>
                <TableCell className="font-medium text-white">{subscription.name}</TableCell>
                <TableCell>
                  <span className="font-mono bg-dark-300/60 px-2 py-1 rounded text-primary-100">
                    ${subscription.price.toFixed(2)}/mo
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 w-fit ${
                      new Date(subscription.renewalDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                        ? "bg-primary-100/15 text-primary-100"
                        : "bg-primary-200/15 text-primary-200"
                    }`}
                  >
                    {formatDate(subscription.renewalDate)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
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
                          className="text-light-400 hover:text-destructive-100 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive-100/40 rounded-full p-1.5"
                          aria-label={`Cancel ${subscription.name} subscription`}
                          disabled={cancelInProgress === subscription.id}
                        >
                          {cancelInProgress === subscription.id ? (
                            <RefreshCw size={22} className="animate-spin" />
                          ) : (
                            <X size={22} />
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="!z-50 !dark-gradient !rounded-2xl !card-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Cancel Subscription</AlertDialogTitle>
                          <AlertDialogDescription className="text-light-400">
                            Are you sure you want to cancel your {subscription.name} subscription? This action cannot be
                            undone, and refunds are not available at this time.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel
                            className="bg-dark-300 text-light-100 hover:bg-dark-200 hover:text-white border-light-600/20"
                            ref={(element) => {
                              cancelButtonRefs.current[subscription.id] = element;
                            }}
                          >
                            No, keep subscription
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive-100 text-white hover:bg-destructive-200"
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
            {subscriptions.length === 0 && (
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
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubscriptionTab;
