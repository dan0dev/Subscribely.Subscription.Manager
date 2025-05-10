import Modal from "@/components/DynamicModal";
import { FC } from "react";
import SubscriptionForm from "./SubscriptionForm";
import { FormValues } from "./types";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  isLoading: boolean;
}

const SubscriptionModal: FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="pt-4">
        <h2 className="mb-4 text-xl font-semibold text-light-100">Create New Subscription</h2>
        <SubscriptionForm onSubmit={onSubmit} onCancel={onClose} isLoading={isLoading} />
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
