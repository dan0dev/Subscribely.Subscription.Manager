import { cn } from "@/lib/utils"; // Assuming you have a utils file for class name helpers
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string | React.ReactNode;
  placeholder?: string;
  type?: "text" | "email" | "password" | "file";
  description?: string;
  disabled?: boolean;
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              disabled={disabled}
              className={cn("placeholder:text-gray-400/50", error && "border-red-500 focus-visible:ring-red-500")}
              aria-invalid={!!error}
              suppressHydrationWarning
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
