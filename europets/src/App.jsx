// src/App.jsx

import { Routes, Route } from "react-router-dom";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/admin/ProductManager";
import ProtectedRoute from "./routes/ProtectedRoute";

// Customer pages — sẽ tạo ở các bước tiếp theo
// import ProductsPage from "./pages/customer/ProductsPage";
// import ProductDetail from "./pages/customer/ProductDetail";

function App() {
  return (
    <Routes>

      {/* ── Customer website ── */}
      <Route path="/" element={<h1>Trang chủ (sẽ làm sau)</h1>} />
      <Route path="/products" element={<h1>Danh sách sản phẩm (sẽ làm sau)</h1>} />
      <Route path="/products/:id" element={<h1>Chi tiết sản phẩm (sẽ làm sau)</h1>} />

      {/* ── Admin panel ── */}
      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ Fix: thêm ProtectedRoute cho trang này */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <ProductManager />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
