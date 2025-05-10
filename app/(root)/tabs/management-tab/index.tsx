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
    <div className="flex-1 overflow-x-auto px-5">
      <div className="flex items-center justify-between p-4 border-b border-light-600/20">
        <h2 className="text-2xl font-medium text-white">Subscription Management</h2>
        <button onClick={openModal} className="btn-secondary">
          Create New
        </button>
      </div>

      <SubscriptionsGrid
        subscriptions={subscriptions}
        isLoading={isLoadingSubscriptions}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <SubscriptionModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default ManagementTab;
