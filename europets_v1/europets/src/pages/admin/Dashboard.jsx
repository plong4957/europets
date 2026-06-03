// src/pages/admin/Dashboard.jsx

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "../../styles/admin/Dashboard.css";

function Dashboard() {
  const [productCount,  setProductCount]  = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // ── Lắng nghe products ─────────────────────────────
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      setProductCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  // ── Lắng nghe categories ───────────────────────────
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      setCategoryCount(snapshot.size);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCategories(list);
    });
    return () => unsubscribe();
  }, []);

  // ── Lấy 5 sản phẩm mới nhất ───────────────────────
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Firestore chưa có createdAt → lấy 5 cái đầu tiên
        setRecentProducts(list.slice(0, 5));
      }
    );
    return () => unsubscribe();
  }, []);

  // ── Helper: tên danh mục từ id ─────────────────────
  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "—";
  };

  return (
    <div className="db-container">

      {/* Header */}
      <div className="db-header">
        <h1>Dashboard</h1>
        <span>Tổng quan hệ thống</span>
      </div>

      {/* Stat cards */}
      <div className="db-stats">

        <div className="db-stat-card">
          <p className="db-stat-label">Tổng sản phẩm</p>
          <p className="db-stat-value">{productCount}</p>
        </div>

        <div className="db-stat-card">
          <p className="db-stat-label">Tổng danh mục</p>
          <p className="db-stat-value">{categoryCount}</p>
        </div>

      </div>

      {/* Recent products */}
      <div className="db-table-card">

        <div className="db-table-header">
          <h2>Sản phẩm gần đây</h2>
          <span>{recentProducts.length} sản phẩm</span>
        </div>

        {recentProducts.length === 0 ? (
          <p className="db-empty">Chưa có sản phẩm nào.</p>
        ) : (
          <table className="db-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image
                      ? <img src={p.image} alt={p.name} className="db-thumb" />
                      : <div className="db-thumb-empty">—</div>
                    }
                  </td>
                  <td className="db-product-name">{p.name}</td>
                  <td>
                    <span className="db-badge">{getCategoryName(p.categoryId)}</span>
                  </td>
                  <td className="db-price">{p.price || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}

export default Dashboard;