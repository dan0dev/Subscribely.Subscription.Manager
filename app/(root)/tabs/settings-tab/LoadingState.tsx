import { RefreshCw } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex-1 overflow-hidden border-light-600/20 bg-dark-400/50">
      <div className="flex items-center justify-between p-4 border-b border-light-600/20">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary-100" />
          Settings
        </h2>
        <div className="text-sm text-light-400">Loading...</div>
      </div>
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-100 animate-spin" />
        <span className="ml-3 text-light-400">Loading settings...</span>
      </div>
    </div>
  );
};

export default LoadingState;
