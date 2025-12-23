// Layouts.jsx (or in a separate file)
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/sections/Header";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/sections/Footer";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <ContactSection />
      <Footer />
    </>
  );
};

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export const AdminLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
