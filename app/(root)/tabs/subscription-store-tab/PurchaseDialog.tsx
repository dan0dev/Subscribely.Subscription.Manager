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
} from "@/components/ui/alert-dialog";
import { Subscription } from "@/types/types";
import { FC } from "react";
interface PurchaseDialogProps {
  subscription: Subscription | null;
  isOpen: boolean;
  isPurchasing: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const PurchaseDialog: FC<PurchaseDialogProps> = ({ subscription, isOpen, isPurchasing, onClose, onPurchase }) => {
  if (!subscription) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="!z-50 !dark-gradient !rounded-2xl !card-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to purchase {subscription.name} for ${subscription.price.toFixed(2)}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="btn-secondary">Cancel</AlertDialogCancel>
          <AlertDialogAction className="btn-primary" onClick={onPurchase} disabled={isPurchasing}>
            {isPurchasing ? "Processing..." : "Purchase"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PurchaseDialog;
