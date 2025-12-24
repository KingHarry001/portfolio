import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react';
import "./index.css";
import App from "./App.jsx";

// 1. Import the provider we just created
import { ThemeProvider } from "./context/ThemeContext"; 

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);