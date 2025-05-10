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
import { cancelSubscription, getAllSubscriptions } from "@/lib/actions/allSubscriptions.action";
import { AlertCircle, Lock, RefreshCw, Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface Subscription {
  id: string;
  userId: string;
  username: string;
  name: string;
  price: number;
  nextRenewal: string;
  active: boolean;
}

const SubscriptionTab: FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelInProgress, setCancelInProgress] = useState<string | null>(null);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        } else {
          throw new Error(data.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again.");
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchSubscriptions() {
      if (!user) return;

      if (user.role !== "admin") {
        setLoading(false);
        return;
      }

      try {
        const data = await getAllSubscriptions();
        // Sort subscriptions - active ones first, then inactive ones
        const sortedData = [...data].sort((a, b) => {
          if (a.active === b.active) return 0;
          return a.active ? -1 : 1;
        });
        setSubscriptions(sortedData);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        setError("Failed to fetch subscriptions. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isUpcomingRenewal = (date: string): boolean => {
    return new Date(date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    setCancelInProgress(subscriptionId);
    try {
      await cancelSubscription(subscriptionId);
      // Update the UI after successful cancellation and resort the list
      const updatedSubscriptions = subscriptions.map((sub) =>
        sub.id === subscriptionId ? { ...sub, active: false } : sub
      );
      // Sort again - active ones first, then inactive ones
      const sortedData = [...updatedSubscriptions].sort((a, b) => {
        if (a.active === b.active) return 0;
        return a.active ? -1 : 1;
      });
      setSubscriptions(sortedData);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      setError("Failed to cancel subscription. Please try again.");
    } finally {
      setCancelInProgress(null);
    }
  };

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-hidden border-light-600/20 bg-dark-400/50">
        <div className="flex items-center justify-between p-4 border-b border-light-600/20 h-[72px]">
          <h2 className="tab-title">Subscription Management</h2>
          <div className="text-sm text-light-400">
            {subscriptions.filter((sub) => sub.active).length} Active Subscriptions
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 text-primary-100 animate-spin" />
          <span className="ml-3 text-light-400">Loading subscription data...</span>
        </div>
      </div>
    );
  }

  // If user is not admin, show access denied
  if (user && user.role !== "admin") {
    return (
      <div className="flex-1 overflow-hidden border-light-600/20 bg-dark-400/50">
        <div className="flex items-center justify-between p-4 border-b border-light-600/20">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-100" />
            Restricted Area
          </h2>
        </div>
        <div className="flex flex-col justify-center items-center h-64">
          <Lock className="w-16 h-16 text-light-400 mb-4" />
          <h3 className="text-xl font-medium text-light-100 mb-2">Access Denied</h3>
          <p className="text-light-400 text-center max-w-md">
            You need administrator privileges to view and manage all subscriptions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden border-light-600/20 bg-dark-400/50">
      <div className="flex items-center justify-between p-4 border-b border-light-600/20 h-[72px]">
        <h2 className="tab-title">Subscription Management</h2>
        <div className="text-sm text-light-400">
          {subscriptions.filter((sub) => sub.active).length} Active Subscriptions
        </div>
      </div>

      {error && (
        <div className="bg-destructive-100/10 border border-destructive-100/20 text-destructive-100 p-3 m-4 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 text-primary-100 animate-spin" />
            <span className="ml-3 text-light-400">Loading subscription data...</span>
          </div>
        ) : (
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-dark-300/70 border-b border-light-600/20">
                <TableHead className="text-light-100 w-20 font-medium">#</TableHead>
                <TableHead className="text-light-100 font-medium py-3">
                  <div className="flex items-center gap-2">
                    <span>User</span>
                  </div>
                </TableHead>
                <TableHead className="text-light-100 font-medium">
                  <div className="flex items-center gap-2">
                    <span>Subscription</span>
                  </div>
                </TableHead>
                <TableHead className="text-light-100 font-medium">
                  <div className="flex items-center gap-2">
                    <span>Price</span>
                  </div>
                </TableHead>
                <TableHead className="text-light-100 font-medium">
                  <div className="flex items-center gap-2">
                    <span>Renewal Date</span>
                  </div>
                </TableHead>
                <TableHead className="text-center text-light-100 w-28 font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length > 0 ? (
                subscriptions.map((subscription, index) => (
                  <TableRow
                    key={subscription.id}
                    className={`border-b border-light-600/20 transition-all duration-200 hover:bg-dark-300/50 ${
                      !subscription.active ? "bg-dark-400/30 text-light-400" : ""
                    }`}
                  >
                    <TableCell className="font-medium text-light-400">{index + 1}</TableCell>
                    <TableCell className="font-medium text-white">
                      <span>{subscription.username}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`font-medium ${subscription.active ? "text-white" : "text-light-400"}`}>
                          {subscription.name}
                        </span>
                        {!subscription.active && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-destructive-100/20 text-destructive-100">
                            Inactive
                          </span>
                        )}
                        {subscription.price > 50 && subscription.active && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
                            Premium
                          </span>
                        )}
                        {subscription.price > 20 && subscription.price <= 50 && subscription.active && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
                            Standard
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono bg-dark-300/60 px-2 py-1 rounded text-primary-100">
                        ${subscription.price.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {subscription.active ? (
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 w-fit ${
                            isUpcomingRenewal(subscription.nextRenewal)
                              ? "bg-primary-100/15 text-primary-100"
                              : "bg-primary-200/15 text-primary-200"
                          }`}
                        >
                          {formatDate(subscription.nextRenewal)}
                        </span>
                      ) : (
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 w-fit bg-primary-200/15`}
                        >
                          <span className="line-through text-light-600">{formatDate(subscription.nextRenewal)}</span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {subscription.active && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="flex items-center justify-center space-x-1 text-light-400 hover:text-destructive-100 hover:bg-destructive-100/10 transition-colors px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-destructive-100/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Cancel ${subscription.name} subscription`}
                                disabled={cancelInProgress === subscription.id}
                              >
                                {cancelInProgress === subscription.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Trash2 className="w-4 h-4" />
                                  </>
                                )}
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="!z-50 !dark-gradient !rounded-2xl !card-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Cancel Subscription</AlertDialogTitle>
                                <AlertDialogDescription className="text-light-400">
                                  Are you sure you want to cancel {subscription.name} subscription for{" "}
                                  {subscription.username}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel className="bg-dark-300 text-light-100 hover:bg-dark-200 hover:text-white border-light-600/20">
                                  No, keep subscription
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelSubscription(subscription.id)}
                                  className="bg-destructive-100 text-white hover:bg-destructive-200"
                                >
                                  Yes, cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-light-400" />
                      <span className="text-light-400 text-lg">No active subscriptions found</span>
                      <p className="text-light-600 text-sm max-w-md">
                        When users subscribe to your service, their subscription details will appear here.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default SubscriptionTab;
