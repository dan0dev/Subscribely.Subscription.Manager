import { z } from "zod";
export interface Subscription {
  _id: string;
  name: string;
  description: string | undefined;
  price: number;
  renewalInterval: string;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface SubscriptionCardProps {
  subscription: Subscription;
  onPurchaseClick: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  accountMoney: number;
  role?: string;
}

export const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number",
  }),
  renewalInterval: z.string().default("1m"),
  active: z.boolean().default(true),
});

export type FormValues = z.infer<typeof formSchema>;
