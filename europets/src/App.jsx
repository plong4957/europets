// src/App.jsx

import { Routes, Route } from "react-router-dom";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/admin/ProductManager";
import CategoryManager from "./pages/admin/CategoryManager";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import ContentManager from "./pages/admin/ContentManager";

function App() {
  return (
    <Routes>

      {/* ── Customer website ── */}
      <Route path="/"           element={<h1>Trang chủ (sẽ làm sau)</h1>} />
      <Route path="/products"   element={<h1>Danh sách sản phẩm (sẽ làm sau)</h1>} />
      <Route path="/products/:id" element={<h1>Chi tiết sản phẩm (sẽ làm sau)</h1>} />

      {/* ── Admin login (không cần auth) ── */}
      <Route path="/admin/login" element={<Login />} />

      {/* ── Admin panel (cần auth + có sidebar) ── */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="products"   element={<ProductManager />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="content" element={<ContentManager />} />
      </Route>

    </Routes>
  );
}

export default App;

