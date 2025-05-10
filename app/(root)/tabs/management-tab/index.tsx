"use client";
import {
  createNewSubscription,
  deleteSubscription,
  getSubscriptions,
} from "@/lib/actions/availableSubscription.action";
import { FormValues, Subscription } from "@/types/types";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import SubscriptionModal from "./SubscriptionModal";
import SubscriptionsGrid from "./SubscriptionsGrid";

const ManagementTab: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchSubscriptions = async () => {
    // Check if the subscriptions are cached and the last fetch was less than 30 seconds ago
    const lastFetch = sessionStorage.getItem("subscriptionsFetchedAt");
    const cache = sessionStorage.getItem("subscriptions");

    const now = Date.now();
    const threeMinutes = 30 * 1000;

    if (lastFetch && cache && now - Number(lastFetch) < threeMinutes) {
      setSubscriptions(JSON.parse(cache));
      setIsLoadingSubscriptions(false);
      return;
    }

    // Fetch subscriptions from the server
    setIsLoadingSubscriptions(true);
    try {
      const response = await getSubscriptions();
      if (response.success) {
        setSubscriptions(response.data || []);
        sessionStorage.setItem("subscriptions", JSON.stringify(response.data));
        sessionStorage.setItem("subscriptionsFetchedAt", now.toString());
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

  // Fetch available subscriptions and user data
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

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const response = await createNewSubscription(values);

      if (response.success) {
        toast.success(response.message || "Subscription created successfully");
        closeModal();
        fetchSubscriptions();
      } else {
        if (response.errors) {
          response.errors.forEach((error) => {
            toast.error(error.message);
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
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex items-center justify-between p-4 border-b border-light-600/20 h-[72px]">
        <h2 className="tab-title">Subscription Management</h2>
        <button onClick={openModal} className="btn-secondary">
          Create New
        </button>
      </div>

      <div className="px-5">
        <SubscriptionsGrid
          subscriptions={subscriptions}
          isLoading={isLoadingSubscriptions}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>

      <SubscriptionModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default ManagementTab;
