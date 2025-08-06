import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ProjectsSection from "./components/ProjectsSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import "./index.css";
import { VscHome, VscAccount, VscSettingsGear, VscSend } from "react-icons/vsc";
import Dock from "./components/react-ui/Dock";
import TargetCursor from "./components/react-ui/TargetCursor";
import GraphicsPage from "./pages/GraphicsPage";
import WebDev from "./pages/WebDev";
import CyberSec from "./pages/CyberSec";
import Uidesign from "./pages/Uidesign";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfServices from "./pages/TermsOfServices";
import TestimonialsSection from "./components/TestimonialsSection";

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
    label: "Gallery",
    onClick: () => scrollToSection("projects"),
  },
  {
    icon: <VscSend size={23} />,
    label: "Contact",
    onClick: () => scrollToSection("contact"),
  },
];

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      <main>
        <Dock items={items} magnification={50} className="border-chart-1" />
        <div id="home">
          <Hero />
        </div>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <BlogSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/graphic-design" element={<GraphicsPage />} />
          <Route path="/web-development" element={<WebDev />} />
          <Route path="/uiux-design" element={<Uidesign />} />
          <Route path="/security-consulting" element={<CyberSec />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfServices />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
