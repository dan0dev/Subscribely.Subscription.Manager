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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FC } from "react";

const SettingsTab: FC = () => {
  return (
    <div className="flex-1 overflow-x-auto ml-5 px-2">
      <h2 className="text-2xl font-medium text-white mb-5">Settings</h2>

      {/* Divider */}
      <div className="h-px w-full bg-light-600/20 my-5" />

      {/* Automatic Renewal */}
      <div className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <p className="text-light-300 text-base mb-1">Subscription Auto-Renewal</p>
          <p className="text-light-400 text-sm">
            Enable or disable automatic renewal of your subscription. (This feature is currently disabled).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Switch disabled className="shrink-0 cursor-not-allowed" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-light-600/20 my-5" />

      {/* Automatic Email Messages */}
      <div className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <p className="text-light-300 text-base mb-1">Automatic Email Messages</p>
          <p className="text-light-400 text-sm">
            Enable or disable automatic email messages from the app. (This feature is currently enabled).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={true} className="shrink-0 cursor-not-allowed" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-light-600/20 my-5" />

      {/* Delete Account */}
      <div className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <p className="text-light-300 text-base mb-1">Done with the app? Time to ghost us?</p>
          <p className="text-light-400 text-sm">
            If you signed up with your real email, you can delete yourself from our database here.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="shrink-0 !rounded-full cursor-pointer">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="!z-50 !dark-gradient !rounded-2xl !card-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn-secondary">Cancel</AlertDialogCancel>
              <AlertDialogAction className="w-fit !bg-red-500 !text-white hover:!bg-red-500/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-light-600/20 my-5" />
    </div>
  );
};

export default SettingsTab;
