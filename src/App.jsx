import "./index.css";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/layouts/NotFoundPage";
import ErrorPage from "./components/layouts/ErrorPage";
import { VscHome, VscAccount, VscSettingsGear, VscSend } from "react-icons/vsc";
import { SignIn, SignUp } from "@clerk/clerk-react";

// Lazy load heavy components
const ProjectsSection = lazy(() => import("./components/sections/ProjectsSection"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const GraphicsPage = lazy(() => import("./pages/GraphicsPage"));
const WebDev = lazy(() => import("./pages/WebDev"));
const CyberSec = lazy(() => import("./pages/CyberSec"));
const Uidesign = lazy(() => import("./pages/Uidesign"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfServices = lazy(() => import("./pages/TermsOfServices"));
const AppStore = lazy(() => import("./pages/AppStore"));

// Keep light components as normal imports
import Header from "./components/sections/Header";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import ServicesSection from "./components/sections/ServicesSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/sections/Footer";
import Hero from "./components/sections/Hero";
import Dock from "./components/react-ui/Dock";
import TargetCursor from "./components/react-ui/TargetCursor";
import ScrollToTop from "./components/react-ui/ScrollToTop";
import BlogSection from "./components/sections/BlogSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import ProtectedRoute from "./components/ProtectedRoute";
import { AdminLayout, AuthLayout, MainLayout } from "./Layout";
import Loading from "./components/layouts/loading";

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
        <Suspense fallback={
          <div className="py-20 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ProjectsSection />
        </Suspense>
        <BlogSection />
        <TestimonialsSection />
      </main>
    </div>
  );
};

// Custom SignIn with centered styling
const CustomSignIn = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8",
              card: "bg-transparent shadow-none",
              headerTitle: "text-2xl font-bold text-white text-center",
              headerSubtitle: "text-gray-400 text-center",
              socialButtonsBlockButton: "bg-gray-800 hover:bg-gray-700 text-white border-gray-700 rounded-lg",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-800 border-gray-700 text-white rounded-lg focus:border-cyan-500",
              formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-lg",
              footerActionLink: "text-cyan-400 hover:text-cyan-300",
            }
          }}
        />
      </div>
    </div>
  );
};

// Custom SignUp with centered styling
const CustomSignUp = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8",
              card: "bg-transparent shadow-none",
              headerTitle: "text-2xl font-bold text-white text-center",
              headerSubtitle: "text-gray-400 text-center",
              socialButtonsBlockButton: "bg-gray-800 hover:bg-gray-700 text-white border-gray-700 rounded-lg",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-800 border-gray-700 text-white rounded-lg focus:border-cyan-500",
              formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-lg",
              footerActionLink: "text-cyan-400 hover:text-cyan-300",
            }
          }}
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Routes with Main Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Portfolio />} />
              
              <Route path="/graphic-design" element={
                <Suspense fallback={
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Graphic Design...</p>
                  </div>
                }>
                  <GraphicsPage />
                </Suspense>
              } />
              
              <Route path="/web-development" element={
                <Suspense fallback={
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Web Development...</p>
                  </div>
                }>
                  <WebDev />
                </Suspense>
              } />
              
              <Route path="/uiux-design" element={
                <Suspense fallback={
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading UI/UX Design...</p>
                  </div>
                }>
                  <Uidesign />
                </Suspense>
              } />
              
              <Route path="/security-consulting" element={
                <Suspense fallback={
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Security Consulting...</p>
                  </div>
                }>
                  <CyberSec />
                </Suspense>
              } />
              
              <Route path="/privacy-policy" element={
                <Suspense fallback={
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Privacy Policy...</p>
                  </div>
                }>
                  <PrivacyPolicy />
                </Suspense>
              } />
              
              <Route path="/terms-of-service" element={
                <Suspense fallback={
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Terms of Service...</p>
                  </div>
                }>
                  <TermsOfServices />
                </Suspense>
              } />
              
              <Route path="/apps" element={
                <Suspense fallback={
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading App Store...</p>
                  </div>
                }>
                  <AppStore />
                </Suspense>
              } />
            </Route>

            {/* Routes with Auth Layout (centered) */}
            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<CustomSignIn />} />
              <Route path="/sign-up" element={<CustomSignUp />} />
            </Route>

            {/* Routes with Admin Layout */}
            <Route element={<AdminLayout />}>
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <Suspense fallback={
                      <div className="min-h-screen bg-black flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-400">Loading Admin Dashboard...</p>
                        </div>
                      </div>
                    }>
                      <AdminDashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Page - Catch all unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;