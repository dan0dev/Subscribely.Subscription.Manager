import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { FormValues, formSchema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface SubscriptionFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const SubscriptionForm: FC<SubscriptionFormProps> = ({ onSubmit, onCancel, isLoading }) => {
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

  return (
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
          <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Creating..." : "Create Subscription"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubscriptionForm;
