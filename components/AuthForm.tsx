"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Logo from "@/app/assets/logo.svg";
import FormField from "@/components/FormField";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormType = "sign-in" | "sign-up";

interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}

const authFormSchema = (type: FormType) => {
  const baseSchema = {
    password: z.string().min(6, "Password must be at least 6 characters").max(50),
  };

  if (type === "sign-up") {
    return z.object({
      ...baseSchema,
      email: z.string().email("Please enter a valid email"),
      name: z.string().min(3, "Name must be at least 3 characters"),
    });
  } else {
    return z.object({
      ...baseSchema,
      email: z.string().min(3, "Please enter a valid email or username"),
    });
  }
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === "sign-up" ? "" : undefined,
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AuthFormValues) {
    setIsLoading(true);

    try {
      let response;

      if (type === "sign-up") {
        // Call register API
        response = await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });
      } else {
        // Call login API
        response = await fetch("/api/auth/sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (type === "sign-up") {
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

      // Error handling
      if (errorMessage.includes("credential")) {
        toast.error(
          type === "sign-in"
            ? "Invalid username/email or password. Please try again."
            : "Invalid email or password. Please try again."
        );
      } else if (errorMessage.includes("exist")) {
        toast.error(
          type === "sign-in"
            ? "User does not exist. Please check your credentials or sign up."
            : "User already exists. Try other credentials or sign in."
        );
      } else if (errorMessage.includes("network") || errorMessage.includes("connect")) {
        toast.error("Network error. Please check your connection and try again.");
      } else if (errorMessage.includes("server")) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(`Authentication failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={Logo} alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Subscribely</h2>
        </div>
        <h3 className="lg:text-center">{isSignIn ? "Welcome back" : "Become a member today"}</h3>

        {isClient ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label={
                    <span>
                      Username{" "}
                      <span className="text-xs text-light-400">
                        (For the best experience, please use a valid email address or a temporary email service)
                      </span>
                    </span>
                  }
                  placeholder="john_doe"
                  disabled={isLoading}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                label={isSignIn ? "Email or Username" : "Email"}
                placeholder={isSignIn ? "your.email@example.com or username" : "your.email@example.com"}
                type={isSignIn ? "text" : "email"}
                disabled={isLoading}
              />

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
        ) : (
          <div className="w-full flex items-center justify-center py-8">
            <span className="text-light-400">Loading form...</span>
          </div>
        )}

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
            {isSignIn ? "Sign Up" : "Sign in"}
          </Link>
        </p>

        <div className="fixed bottom-4 right-4 bg-dark-200/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm border border-primary-200/20">
          <p className="text-sm text-light-400">
            By using this service, you agree to our{" "}
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-primary-200 hover:underline font-medium cursor-pointer"
            >
              Privacy Policy
            </button>{" "}
            and the use of cookies.
          </p>
        </div>
      </div>

      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </div>
  );
};

export default AuthForm;
