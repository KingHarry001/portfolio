import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-lg text-center">
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-cyan-500/20">404</div>
          <AlertCircle className="w-32 h-32 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 blur-2xl"></div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 text-lg mb-8">
          Oops! The page you're looking for seems to have wandered off into the digital void.
          It might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg font-medium hover:bg-gray-700/50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <a href="mailto:support@example.com" className="text-cyan-400 hover:text-cyan-300">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;