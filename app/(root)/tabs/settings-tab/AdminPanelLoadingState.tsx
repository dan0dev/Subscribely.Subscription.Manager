import { Lock, RefreshCw } from "lucide-react";

const AdminPanelLoadingState = () => {
  return (
    <div className="mt-8 flex flex-col">
      <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
        <Lock className="w-5 h-5 text-primary-100" />
        Admin Panel
      </h3>
      <p className="text-light-400 text-sm mb-5">Special functions for admin users. Be careful with these settings!</p>
      <div className="bg-dark-300/50 rounded-lg p-4 border border-light-600/20">
        <div className="flex justify-center items-center h-32">
          <RefreshCw className="w-6 h-6 text-primary-100 animate-spin" />
          <span className="ml-3 text-light-400">Loading admin panel...</span>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelLoadingState;
