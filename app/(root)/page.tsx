"use client";

import Sidebar from "@/components/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";
import { type FC, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Subscription {
  id: string;
  name: string;
  price: number;
  renewalDate: Date;
}

const SubscriptionTracker: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "sub_netflix",
      name: "Netflix Premium",
      price: 19.99,
      renewalDate: new Date("2025-03-30"),
    },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRemove = (id: string): void => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-dark-500">
      <div className="card-border w-full max-w-4xl">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6 border-b border-light-600/20 pb-4">
            <h2 className="text-primary-100 text-xl font-medium">
              Subscription Tracker
            </h2>
            <span className="text-light-100 text-sm font-medium">
              {loading
                ? "Loading..."
                : error
                ? "Error loading user"
                : user?.email}
            </span>
          </div>
          <div className="flex">
            <Sidebar activePage="subscriptions" />

            <div className="flex-1 overflow-x-auto ml-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-light-600/20">
                    <TableHead className="text-light-100 w-16">#</TableHead>
                    <TableHead className="text-light-100">
                      Subscription
                    </TableHead>
                    <TableHead className="text-light-100">Price</TableHead>
                    <TableHead className="text-light-100">
                      Renewal Date
                    </TableHead>
                    <TableHead className="text-center text-light-100 w-24">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription, index) => (
                    <TableRow
                      key={subscription.id}
                      className="border-light-600/20 hover:bg-dark-300/50 animate-fadeIn"
                    >
                      <TableCell className="font-medium text-light-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {subscription.name}
                      </TableCell>
                      <TableCell className="text-light-400">
                        ${subscription.price.toFixed(2)}/month
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            new Date(subscription.renewalDate).getTime() -
                              new Date().getTime() <
                            7 * 24 * 60 * 60 * 1000
                              ? "bg-primary-100/20 text-primary-100"
                              : "bg-primary-200/20 text-primary-200"
                          }`}
                        >
                          {formatDate(subscription.renewalDate)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleRemove(subscription.id)}
                          className="text-light-400 hover:text-destructive-100 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive-100/40 rounded-full p-1"
                          aria-label={`Cancel ${subscription.name} subscription`}
                        >
                          <X size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {subscriptions.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-light-400"
                      >
                        No active subscriptions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTracker;
