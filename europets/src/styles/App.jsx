import { Routes, Route } from "react-router-dom";

// Layouts
import CustomerLayout from "./layouts/CustomerLayout";

// Customer pages
import HomePage from "./pages/customer/HomePage";
import ProductsPage from "./pages/customer/ProductsPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import AboutPage from "./pages/customer/AboutPage";
import ContactPage from "./pages/customer/ContactPage";

// Admin pages (KHÔNG CHỈNH SỬA)
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/admin/ProductManager";
import CategoryManager from "./pages/admin/CategoryManager";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ── Customer website ── */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ── Admin panel (KHÔNG CHỈNH SỬA) ── */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute><CategoryManager /></ProtectedRoute>} />

    </Routes>
  );
}

export default App;