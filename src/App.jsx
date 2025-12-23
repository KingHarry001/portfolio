import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./index.css";
import Header from "./components/sections/Header";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import ServicesSection from "./components/sections/ServicesSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import BlogSection from "./components/sections/BlogSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/sections/Footer";
import Hero from "./components/sections/Hero";
import { VscHome, VscAccount, VscSettingsGear, VscSend } from "react-icons/vsc";
import Dock from "./components/react-ui/Dock";
import TargetCursor from "./components/react-ui/TargetCursor";
import GraphicsPage from "./pages/GraphicsPage";
import WebDev from "./pages/WebDev";
import CyberSec from "./pages/CyberSec";
import Uidesign from "./pages/Uidesign";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfServices from "./pages/TermsOfServices";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import ScrollToTop from "./components/react-ui/ScrollToTop";
import HireMeButton from "./components/HireMe";
import AppStore from "./pages/AppStore";
import ProtectedRoute from "./components/ProtectedRoute";
import { SignIn, SignUp } from "@clerk/clerk-react";
import AdminDashboard from "./components/admin/AdminDashboard";
import { AdminLayout, AuthLayout, MainLayout } from "./Layout";
import ThemeSelectorModal from "./components/react-ui/ThemeSelectorModal";
import BottomNavigation from "./components/react-ui/BottomNavigation";

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const items = [
  {
    icon: <VscHome size={23} />,
    label: "Home",
    onClick: () => scrollToSection("home"),
  },
  {
    icon: <VscAccount size={23} />,
    label: "About",
    onClick: () => scrollToSection("about"),
  },
  {
    icon: <VscSettingsGear size={23} />,
    label: "Services",
    onClick: () => scrollToSection("services"),
  },
  {
    icon: <span className="material-symbols-outlined">work_history</span>,
    label: "Projects",
    onClick: () => scrollToSection("projects"),
  },
  {
    icon: <VscSend size={23} />,
    label: "Contact",
    onClick: () => scrollToSection("contact"),
  },
];

const customStyles = `
  body {
    overflow-x: hidden;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #121212;
    display:none;
  }

  ::-webkit-scrollbar-thumb {
    background: #00FFD1;
    border: 1px solid #00FFD1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6FD2C0;
  }

  /* Dark theme by default */
  body {
    background-color: #000000;
  }
`;

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Dock items={items} magnification={50} className="border-chart-1" />
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      <main>
        <Hero />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        {/* <BlogSection /> */}
        <TestimonialsSection />
      </main>
    </div>
  );
};

function App() {
  // Global theme modal state at App level
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Make the modal state available globally via window object
  if (typeof window !== "undefined") {
    window.openThemeModal = () => setIsThemeModalOpen(true);
    window.closeThemeModal = () => setIsThemeModalOpen(false);
  }

  return (
    <div className="App">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <BrowserRouter>
        <BottomNavigation />
        {/* <ScrollToTop /> */}
        <Routes>
          {/* Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Portfolio />} />
            <Route path="/graphic-design" element={<GraphicsPage />} />
            <Route path="/web-development" element={<WebDev />} />
            <Route path="/uiux-design" element={<Uidesign />} />
            <Route path="/security-consulting" element={<CyberSec />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfServices />} />
            <Route path="/apps" element={<AppStore />} />
          </Route>

          {/* Routes with Auth Layout (no header/footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>

          {/* Routes with Admin Layout (no header/footer) */}
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>

        {/* Global Theme Modal - Outside all layouts and routes */}
        <ThemeSelectorModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
