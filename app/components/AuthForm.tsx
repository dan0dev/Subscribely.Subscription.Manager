"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormType = "sign-in" | "sign-up";

// Define a type that includes all possible fields
interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}

const authFormSchema = (type: FormType) => {
  const baseSchema = {
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50),
  };

  return type === "sign-up"
    ? z.object({
        ...baseSchema,
        name: z.string().min(3, "Name must be at least 3 characters"),
      })
    : z.object(baseSchema);
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === "sign-up" ? "" : undefined,
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit() {
    setIsLoading(true);
    setError(null);

    try {
      // Here you would typically make an API call
      // Simulating API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (type === "sign-up") {
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(`Authentication failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Sub Manager</h2>
        </div>
        <h3 className="lg:text-center">
          {isSignIn ? "Welcome back" : "Become a member today"}
        </h3>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              // name
              <FormField
                control={form.control}
                name="name"
                label="Username"
                placeholder="john_doe"
                disabled={isLoading}
              />
            )}

            {/* email */}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="your.email@example.com"
              type="email"
              disabled={isLoading}
            />

            {/* password */}
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
              disabled={isLoading}
            />

            <Button className="btn w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isSignIn ? "Signing in..." : "Creating account..."}
                </span>
              ) : isSignIn ? (
                "Sign in"
              ) : (
                "Create an Account"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
