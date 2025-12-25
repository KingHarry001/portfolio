import React, { useState, Suspense, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { VscHome, VscAccount, VscSettingsGear, VscSend } from "react-icons/vsc";
import { Briefcase } from "lucide-react";

// --- Components ---
import Dock from "./components/react-ui/Dock";
import TargetCursor from "./components/react-ui/TargetCursor";
import ThemeSelectorModal from "./components/react-ui/ThemeSelectorModal";
import BottomNavigation from "./components/react-ui/BottomNavigation";
import LoadingSpinner3D from "./components/LoadingSpinner3D"; // Assume this exists

// --- Layouts ---
import { AdminLayout, AuthLayout, MainLayout } from "./Layout";

// --- Contexts ---
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// --- Lazy Load Pages for Performance ---
const Hero = React.lazy(() => import("./components/sections/Hero"));
const HeroSection = React.lazy(() =>
  import("./components/sections/HeroSection")
);
const AboutSection = React.lazy(() =>
  import("./components/sections/AboutSection")
);
const ServicesSection = React.lazy(() =>
  import("./components/sections/ServicesSection")
);
const ProjectsSection = React.lazy(() =>
  import("./components/sections/ProjectsSection")
);
const BlogSection = React.lazy(() =>
  import("./components/sections/BlogSection")
);
const ContactSection = React.lazy(() =>
  import("./components/sections/ContactSection")
);
const ExperienceSection = React.lazy(() =>
  import("./components/sections/ExperienceSection")
);
const TestimonialsSection = React.lazy(() =>
  import("./components/sections/TestimonialsSection")
);
const StatsSection = React.lazy(() =>
  import("./components/sections/StatsSection")
);

const AppStore = React.lazy(() => import("./pages/AppStore"));
const AppDetail = React.lazy(() => import("./pages/AppDetail"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const SignIn = React.lazy(() =>
  import("@clerk/clerk-react").then((module) => ({ default: module.SignIn }))
);
const SignUp = React.lazy(() =>
  import("@clerk/clerk-react").then((module) => ({ default: module.SignUp }))
);
const AdminDashboard = React.lazy(() =>
  import("./components/admin/AdminDashboard")
);
const AdminPanel = React.lazy(() => import("./components/admin/AdminPanel"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));

import "./index.css";
import ScrollToTop from "./components/react-ui/ScrollToTop";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";

// --- Config ---
const dockItems = [
  {
    icon: <VscHome size={22} />,
    label: "Home",
    onClick: () => scrollToSection("hero"),
  },
  {
    icon: <VscAccount size={22} />,
    label: "About",
    onClick: () => scrollToSection("about"),
  },
  {
    icon: <VscSettingsGear size={22} />,
    label: "Services",
    onClick: () => scrollToSection("services"),
  },
  {
    icon: <Briefcase size={22} />,
    label: "Projects",
    onClick: () => scrollToSection("projects"),
  },
  {
    icon: <VscSend size={22} />,
    label: "Contact",
    onClick: () => scrollToSection("contact"),
  },
];

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
};

// --- Page Components ---
const PortfolioHome = () => (
  <div className="min-h-screen bg-black text-white selection:bg-chart-1/30">
    <Dock
      items={dockItems}
      magnification={60}
      distance={100}
      className="border-chart-1/30"
    />
    <TargetCursor className="sm-hidden" />
    <main className="space-y-0">
      <Hero />
      <HeroSection />
      <ExperienceSection />
      <TestimonialsSection />
      <StatsSection />
      <ProjectsSection />
      <ServicesSection />
      <AboutSection />
      <BlogSection />
      <ContactSection />
    </main>
  </div>
);

// --- Context Provider (Create this file if needed, or define here for simplicity) ---
const ThemeContext = createContext();

export const ThemeProviderComponent = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Expose to window for legacy components if absolutely necessary
  if (typeof window !== "undefined") {
    window.openThemeModal = () => setIsModalOpen(true);
  }

  return (
    <ThemeContext.Provider
      value={{
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
      }}
    >
      {children}
      <ThemeSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </ThemeContext.Provider>
  );
};

// --- Main App ---
function App() {
  return (
    <ThemeProviderComponent>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #333",
            },
          }}
        />

        {/* Global Styles Fallback */}
        <style>{`
          html { scroll-behavior: smooth; }
          body { background-color: #000; overflow-x: hidden; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #000; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #555; }
        `}</style>

        <BottomNavigation />

        <Suspense
          fallback={
            <div className="h-screen w-full flex items-center justify-center bg-black">
              {/* 2. FIXED: Using the 3D Spinner here */}
              <LoadingSpinner3D />
            </div>
          }
        >
          <Routes>
            {/* Main Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<PortfolioHome />} />
              <Route path="/apps" element={<AppStore />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/apps/:slug" element={<AppDetail />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
            </Route>            

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProviderComponent>
  );
}

export default App;
