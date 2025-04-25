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
import { AlertCircle, X } from "lucide-react";
import { FC, useState } from "react";

interface Subscription {
  id: string;
  name: string;
  price: number;
  renewalDate: Date;
}

const SubscriptionTab: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "sub_netflix",
      name: "Netflix Premium",
      price: 19.99,
      renewalDate: new Date("2025-03-30"),
    },
  ]);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="text-light-400 hover:text-destructive-100 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive-100/40 rounded-full p-1.5"
                          aria-label={`Cancel ${subscription.name} subscription`}
                        >
                          <X size={22} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="!z-50 !dark-gradient !rounded-2xl !card-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Cancel Subscription</AlertDialogTitle>
                          <AlertDialogDescription className="text-light-400">
                            Are you sure you want to cancel your {subscription.name} subscription? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel className="bg-dark-300 text-light-100 hover:bg-dark-200 hover:text-white border-light-600/20">
                            No, keep subscription
                          </AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive-100 text-white hover:bg-destructive-200">
                            Yes, cancel
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
