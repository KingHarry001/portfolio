import React from "react";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Dock from "../components/react-ui/Dock";

const WebDev = () => {
  return (
    <div>
      <Header />
      <Dock />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default WebDev;
