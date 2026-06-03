import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import "../styles/customer/layout.css";

function CustomerLayout() {
  const { pathname } = useLocation();

  return (
    <div className="customer-layout">
      <Navbar activePath={pathname} />
      <main className="customer-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default CustomerLayout;