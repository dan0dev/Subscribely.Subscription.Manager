export interface Subscription {
  id: string;
  name: string;
  price: number;
  renewalDate: Date;
}
export interface User {
  id: string;
  name: string;
  email: string;
  accountMoney: number;
  role?: string;
}
