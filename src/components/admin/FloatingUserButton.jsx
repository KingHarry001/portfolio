// components/admin/FloatingUserButton.jsx
import { UserButton } from '@clerk/clerk-react';
import { LogOut, User, Settings } from 'lucide-react';

const FloatingUserButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        {/* Floating indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>

        {/* Button with glass morphism effect */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-full shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:border-cyan-500/50">
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                rootBox: "",
                userButtonBox: "flex-row-reverse",
                userButtonTrigger: "bg-transparent hover:bg-gray-700/50 p-2 rounded-full transition-all duration-300",
                userButtonOuterIdentifier: "hidden",
                avatarBox: "w-11 h-11 border-2 border-cyan-500/80 hover:border-cyan-400 transition-colors ring-2 ring-gray-900/50",
                userButtonPopoverCard: "bg-gray-900 border border-gray-800 shadow-2xl",
                userButtonPopoverActions: "border-t border-gray-800",
                userButtonPopoverActionButton: "hover:bg-gray-800",
              },
              variables: {
                colorPrimary: "#06b6d4", // cyan-500
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingUserButton;