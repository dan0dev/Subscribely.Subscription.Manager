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

const alertWindow = () => {
  alert("Deleted - this is a demo");
};

const DangerZone = () => {
  return (
    <div className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      <div>
        <p className="text-light-300 text-base mb-1">Done with the app? Time to ghost us?</p>
        <p className="text-light-400 text-sm">
          If you signed up with your real email, you can delete yourself from our database here.
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="shrink-0 !rounded-md cursor-pointer ">
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
            <AlertDialogAction
              className="w-fit !bg-red-500 !text-white hover:!bg-red-500/80 !rounded-md !font-bold px-5 cursor-pointer min-h-10"
              onClick={alertWindow}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DangerZone;
