import { Routes, Route } from "react-router-dom";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/admin/ProductManager";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />

      <Route path="/products" element={<h1>Products</h1>} />

      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/products" element={<ProductManager />} />
    </Routes>
  );
}

export default App;