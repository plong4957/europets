import { useState, useEffect } from "react";
import "./ProductManager.css";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

function ProductManager() {
  // ── Form state ─────────────────────────────────────
  const [name, setName]               = useState("");
  const [price, setPrice]             = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage]             = useState("");

  // ── UI state ───────────────────────────────────────
  const [products, setProducts]       = useState([]);
  const [editingId, setEditingId]     = useState(null); // null = đang thêm mới
  const [alert, setAlert]             = useState(null); // { type, msg }

  // ── Realtime listener ──────────────────────────────
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    });
    return () => unsubscribe();
  }, []);

  // ── Helper: hiện thông báo rồi tự tắt ─────────────
  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  };

  // ── Reset form ─────────────────────────────────────
  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImage("");
    setEditingId(null);
  };

  // ── ADD hoặc UPDATE ────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description) {
      showAlert("error", "Vui lòng nhập đầy đủ Tên, Giá và Mô tả.");
      return;
    }

    const data = { name, price, description, image };

    try {
      if (editingId) {
        // UPDATE
        await updateDoc(doc(db, "products", editingId), data);
        showAlert("success", "Cập nhật sản phẩm thành công!");
      } else {
        // ADD — BUG FIX: thêm đủ 4 field bao gồm image
        await addDoc(collection(db, "products"), data);
        showAlert("success", "Thêm sản phẩm thành công!");
      }
      resetForm();
    } catch (error) {
      showAlert("error", "Có lỗi xảy ra: " + error.message);
    }
  };

  // ── Bấm Edit → đổ dữ liệu vào form ───────────────
  const handleEdit = (product) => {
    setName(product.name || "");
    setPrice(product.price || "");
    setDescription(product.description || "");
    setImage(product.image || "");
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── DELETE ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      showAlert("success", "Đã xóa sản phẩm.");
    } catch (error) {
      showAlert("error", "Xóa thất bại: " + error.message);
    }
  };

  // ── RENDER ─────────────────────────────────────────
  return (
    <div className="pm-container">

      {/* Page header */}
      <div className="pm-header">
        <h1>Quản lý Sản phẩm</h1>
        <span>{products.length} sản phẩm</span>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`pm-alert ${alert.type}`}>
          {alert.msg}
        </div>
      )}

      {/* Form thêm / sửa */}
      <div className="pm-form-card">
        <h2>{editingId ? "✏️  Chỉnh sửa sản phẩm" : "➕  Thêm sản phẩm mới"}</h2>

        <form className="pm-form" onSubmit={handleSubmit}>

          <div>
            <label className="pm-label">Tên sản phẩm *</label>
            <input
              className="pm-input"
              type="text"
              placeholder="VD: Bravecto™ Chew"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="pm-label">Giá</label>
            <input
              className="pm-input"
              type="text"
              placeholder="VD: 450.000đ"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="pm-form-full">
            <label className="pm-label">Mô tả sản phẩm *</label>
            <textarea
              className="pm-textarea"
              placeholder="Mô tả ngắn về sản phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pm-form-full">
            <label className="pm-label">URL ảnh sản phẩm</label>
            <input
              className="pm-input"
              type="text"
              placeholder="https://... hoặc /images/product.png"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="pm-form-actions">
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Hủy
              </button>
            )}
            <button type="submit" className="btn-primary">
              {editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </button>
          </div>

        </form>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="pm-list-header">
        <h2>Danh sách sản phẩm</h2>
        <span className="pm-count">Hiển thị {products.length} sản phẩm</span>
      </div>

      <div className="pm-grid">
        {products.length === 0 ? (
          <div className="pm-empty">
            <p>Chưa có sản phẩm nào. Thêm sản phẩm đầu tiên bên trên!</p>
          </div>
        ) : (
          products.map((product) => (
            <div className="pm-card" key={product.id}>

              {product.image ? (
                <img
                  className="pm-card-img"
                  src={product.image}
                  alt={product.name}
                />
              ) : (
                <div className="pm-card-img-placeholder">Chưa có ảnh</div>
              )}

              <div className="pm-card-body">
                <h3 className="pm-card-name">{product.name}</h3>
                {product.price && (
                  <p className="pm-card-price">{product.price}</p>
                )}
                <p className="pm-card-desc">{product.description}</p>
              </div>

              <div className="pm-card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(product)}
                >
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(product.id)}
                >
                  Xóa
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default ProductManager;
