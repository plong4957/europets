// src/routes/ProtectedRoute.jsx

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

function ProtectedRoute({ children }) {
  // null = chưa biết, object = đã login, false = chưa login
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged lắng nghe Firebase xác nhận xong
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Cleanup khi component unmount
    return () => unsubscribe();
  }, []);

  // Đang chờ Firebase xác nhận → không render gì cả
  if (loading) {
    return <div style={{ padding: "2rem" }}>Đang kiểm tra đăng nhập...</div>;
  }

  // Firebase xác nhận xong → có user thì cho vào, không thì về login
  return user ? children : <Navigate to="/admin/login" />;
}

export default ProtectedRoute;
