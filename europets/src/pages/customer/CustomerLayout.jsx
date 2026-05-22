// src/layouts/CustomerLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import "../styles/customer/layout.css";

function CustomerLayout() {
  return (
    <div className="customer-layout">
      <Navbar />
      <main className="customer-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default CustomerLayout;