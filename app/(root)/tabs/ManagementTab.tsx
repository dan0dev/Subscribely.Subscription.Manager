"use client";
import Modal from "@/components/DynamicModal";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createNewSubscription,
  deleteSubscription,
  getSubscriptions,
} from "@/lib/actions/availableSubscription.action";
import { FC } from "react";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number",
  }),
  renewalInterval: z.string().default("1m"),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface Subscription {
  _id: string;
  name: string;
  description: string | undefined;
  price: number;
  renewalInterval: string;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// Helper function to format renewal interval for display
const formatRenewalInterval = (interval: string | undefined): string => {
  if (!interval) return "N/A";

  // Safety check for valid format
  if (interval.length < 2 || !["h", "d", "w", "m", "y"].includes(interval.slice(-1))) {
    return interval;
  }

  const unit = interval.slice(-1);
  const value = interval.slice(0, -1);

  switch (unit) {
    case "h":
      return `${value} hour${value === "1" ? "" : "s"}`;
    case "d":
      return `${value} day${value === "1" ? "" : "s"}`;
    case "w":
      return `${value} week${value === "1" ? "" : "s"}`;
    case "m":
      return `${value} month${value === "1" ? "" : "s"}`;
    case "y":
      return `${value} year${value === "1" ? "" : "s"}`;
    default:
      return interval;
  }
};

const ManagementTab: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      renewalInterval: "1m",
      active: true,
    },
  });

  const fetchSubscriptions = async () => {
    setIsLoadingSubscriptions(true);
    try {
      const response = await getSubscriptions();
      if (response.success) {
        setSubscriptions(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to fetch subscriptions");
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await deleteSubscription(id);
      if (response.success) {
        toast.success("Subscription deleted successfully");
        fetchSubscriptions();
      } else {
        toast.error(response.message || "Failed to delete subscription");
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription");
    } finally {
      setIsDeleting(null);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const response = await createNewSubscription(values);

      if (response.success) {
        toast.success(response.message || "Subscription created successfully");
        closeModal();
        form.reset();
        fetchSubscriptions(); // Refresh the list after creating
      } else {
        if (response.errors) {
          response.errors.forEach((error) => {
            form.setError(error.path as keyof FormValues, {
              message: error.message,
            });
          });
        }
        toast.error(response.message || "Failed to create subscription");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Failed to create subscription");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 overflow-x-auto ml-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-white mb-5">Subscription Management</h2>
        <button onClick={openModal} className="btn-secondary">
          Create New
        </button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="pt-4">
            <h2 className="mb-4 text-xl font-semibold text-light-100">Create New Subscription</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" label="Name" placeholder="Netflix" disabled={isLoading} />

                <FormField
                  control={form.control}
                  name="description"
                  label="Description"
                  placeholder="Streaming service"
                  disabled={isLoading}
                />

                <FormField control={form.control} name="price" label="Price" placeholder="9.99" disabled={isLoading} />

                <div className="space-y-2">
                  <Label htmlFor="renewalInterval">Renewal Interval</Label>
                  <select
                    id="renewalInterval"
                    className="w-full p-2 rounded-lg bg-dark-200 text-light-100 border border-input"
                    value={form.watch("renewalInterval")}
                    onChange={(e) => form.setValue("renewalInterval", e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="1h">1 hour</option>
                    <option value="8h">8 hours</option>
                    <option value="1d">1 day</option>
                    <option value="7d">7 days</option>
                    <option value="14d">14 days</option>
                    <option value="1m">1 month</option>
                    <option value="2m">2 months</option>
                    <option value="3m">3 months</option>
                    <option value="6m">6 months</option>
                    <option value="1y">1 year</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={form.watch("active")}
                    onChange={(e) => form.setValue("active", e.target.checked)}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal} className="cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="cursor-pointer">
                    {isLoading ? "Creating..." : "Create Subscription"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Modal>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {isLoadingSubscriptions ? (
          // Loading state
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="p-6 rounded-lg border border-gray-500/30 bg-dark-300/50 flex flex-col h-48 animate-pulse"
              >
                <div className="h-4 bg-gray-600/30 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-600/30 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-600/30 rounded w-5/6 mb-4"></div>
                <div className="mt-auto h-6 bg-gray-600/30 rounded w-1/4"></div>
              </div>
            ))
        ) : subscriptions.length === 0 ? (
          // Empty state
          <div className="col-span-3 text-center py-10 text-gray-400">
            <p>No subscriptions found. Create a new one!</p>
          </div>
        ) : (
          // Subscription cards
          subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className={`dark-gradient p-6 rounded-lg border ${
                subscription.active ? "border-primary-200/30" : "border-gray-500/30"
              } bg-dark-300/50 flex flex-col h-full`}
            >
              {/* Card header with name and status */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-white truncate mr-2">{subscription.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                    subscription.active ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {subscription.active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Description */}
              <p className="text-light-400 text-[0.7rem] mb-3 flex-grow">(Check the description within the database)</p>

              {/* Price and renewal interval */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg text-primary-100">${subscription.price.toFixed(2)}</div>
                <div className="text-sm bg-dark-200 px-2 py-1 rounded-full text-light-400">
                  {formatRenewalInterval(subscription.renewalInterval)}
                </div>
              </div>

              {/* Action buttons container at the bottom */}
              <div className="flex justify-end items-center gap-2 mt-auto pt-2 border-t border-gray-700/30">
                {/* Reserve space for future icons */}
                <div className="flex-grow"></div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(subscription._id)}
                  disabled={isDeleting === subscription._id}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isDeleting === subscription._id
                      ? "bg-red-500/10 text-red-300/50"
                      : "bg-red-500/10 text-red-300 hover:bg-red-500/20"
                  }`}
                  title="Delete subscription"
                >
                  {isDeleting === subscription._id ? (
                    <div className="h-4 w-4 border-2 border-red-300/50 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagementTab;
