'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RefreshCcw, X } from 'lucide-react';
import { FC, useState } from 'react';

interface Subscription {
  id: string;
  name: string;
  price: number;
  renewalDate: Date;
}

const SubscriptionTab: FC = () => {
  const [subscriptions, _setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub_netflix',
      name: 'Netflix Premium',
      price: 19.99,
      renewalDate: new Date('2025-03-30'),
    },
  ]);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex-1 overflow-x-auto ml-5">
      <Table>
        <TableHeader>
          <TableRow className="border-light-600/20">
            <TableHead className="text-light-100 w-20 text-base">#</TableHead>
            <TableHead className="text-light-100 text-base">Subscription</TableHead>
            <TableHead className="text-light-100 text-base">Price</TableHead>
            <TableHead className="text-light-100 text-base">Renewal Date</TableHead>
            <TableHead className="text-center text-light-100 w-28 text-base">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription, index) => (
            <TableRow
              key={subscription.id}
              className="border-light-600/20 hover:bg-dark-300/50 animate-fadeIn"
            >
              <TableCell className="font-medium text-light-400 text-base">{index + 1}</TableCell>
              <TableCell className="font-medium text-white text-base">
                {subscription.name}
              </TableCell>
              <TableCell className="text-light-400 text-base">
                ${subscription.price.toFixed(2)}/month
              </TableCell>
              <TableCell>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    new Date(subscription.renewalDate).getTime() - new Date().getTime() <
                    7 * 24 * 60 * 60 * 1000
                      ? 'bg-primary-100/20 text-primary-100'
                      : 'bg-primary-200/20 text-primary-200'
                  }`}
                >
                  {formatDate(subscription.renewalDate)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    className="text-light-400 hover:text-destructive-100 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive-100/40 rounded-full p-1.5"
                    aria-label={`Cancel ${subscription.name} subscription`}
                  >
                    <X size={22} />
                  </button>
                  <button
                    className="text-light-400 hover:text-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100/40 rounded-full p-1.5"
                    aria-label={`Refund ${subscription.name} subscription`}
                  >
                    <RefreshCcw size={22} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {subscriptions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-light-400 text-base">
                No active subscriptions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscriptionTab;
