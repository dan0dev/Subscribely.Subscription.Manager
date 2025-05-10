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
