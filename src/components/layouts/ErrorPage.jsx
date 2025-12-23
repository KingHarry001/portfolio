import { useRouteError, useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  
  console.error("Application Error:", error);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <AlertTriangle className="w-24 h-24 text-red-500" />
            <div className="absolute inset-0 bg-red-500/20 blur-2xl"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Something Went Wrong</h1>
          <p className="text-gray-400 text-lg mb-8">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>

        {/* Error Details (Collapsible) */}
        <details className="mb-8 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <summary className="p-4 bg-gray-900/80 cursor-pointer flex items-center justify-between">
            <span className="font-medium text-white flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Technical Details
            </span>
            <span className="text-gray-400 text-sm">Click to expand</span>
          </summary>
          <div className="p-4 bg-black/50">
            <pre className="text-sm text-gray-300 overflow-x-auto p-4 bg-gray-900/50 rounded-lg">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </details>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => window.location.reload()}
            className="flex flex-col items-center justify-center p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group"
          >
            <RefreshCw className="w-8 h-8 text-cyan-400 mb-3 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-medium text-white">Refresh Page</span>
            <span className="text-sm text-gray-400 mt-1">Reload the application</span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group"
          >
            <Home className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-white">Go Home</span>
            <span className="text-sm text-gray-400 mt-1">Return to homepage</span>
          </button>

          <a
            href="mailto:support@example.com"
            className="flex flex-col items-center justify-center p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group"
          >
            <AlertTriangle className="w-8 h-8 text-yellow-400 mb-3 group-hover:animate-pulse" />
            <span className="font-medium text-white">Report Issue</span>
            <span className="text-sm text-gray-400 mt-1">Contact support team</span>
          </a>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/20 rounded-xl p-6">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Need Immediate Assistance?
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Try refreshing the page</li>
            <li>• Clear your browser cache</li>
            <li>• Check your internet connection</li>
            <li>• Try using a different browser</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-cyan-500/20">
            <p className="text-sm text-gray-400">
              If the problem persists, please contact support with the error details above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;