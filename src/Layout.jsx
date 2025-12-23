// Layouts.jsx (or in a separate file)
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

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
    <>
      <Outlet />
    </>
  );
};

export const AdminLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};