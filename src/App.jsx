import React, { useEffect } from "react";
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

// Custom CSS for dark theme buttons and styling
const customStyles = `
  .btn-primary {
    border-radius: 0px;
    padding: 14px 24px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.4s ease-in-out;
    min-height: 56px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    line-height: 1.2;
    letter-spacing: 0;
  }

  .btn-primary:hover {
    background: transparent;
    color: var(--text-foreground);
  }

  .btn-primary:active {
    background: #6FD2C0;
    transform: scale(0.98);
  }

  .btn-secondary {
    border-radius: 10px;
    padding: 14px 24px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.4s ease-in-out;
    min-height: 56px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    line-height: 1.2;
    letter-spacing: 0;
  }

  .btn-secondary:hover {
    background: #FFFFFF;
    color: #000000;
  }

  .btn-secondary:active {
    background: #F0F0F0;
    transform: scale(0.98);
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
  }

  ::-webkit-scrollbar-thumb {
    background: #00FFD1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6FD2C0;
  }

  /* Dark theme by default */
  body {
    background-color: #000000;
    color: #FFFFFF;
  }
`;

const Portfolio = () => {
  useEffect(() => {
    // Add dark theme by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen !bg-background !text-foreground">
      <Header />
      <main>
        <Hero />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
