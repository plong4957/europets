import { Routes, Route } from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/customer/HomePage";
import AboutPage from "./pages/customer/AboutPage";
import ProductsPage from "./pages/customer/ProductsPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import FAQPage from "./pages/customer/FAQPage";
import ContactPage from "./pages/customer/ContactPage";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/admin/ProductManager";
import CategoryManager from "./pages/admin/CategoryManager";
import ContentManager from "./pages/admin/ContentManager";

function App() {
  return (
    <Routes>
      {/* Customer */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="content" element={<ContentManager />} />
      </Route>
    </Routes>
  );
}

export default App;