import { useState, useEffect } from "react";
import "./CategoryManager.css";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

function CategoryManager() {
  // ── Form state ─────────────────────────────────────
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");

  // ── UI state ───────────────────────────────────────
  const [categories, setCategories]   = useState([]);
  const [editingId, setEditingId]     = useState(null);
  const [alert, setAlert]             = useState(null);

  // ── Realtime listener ──────────────────────────────
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCategories(list);
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
    setDescription("");
    setEditingId(null);
  };

  // ── ADD hoặc UPDATE ────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      showAlert("error", "Vui lòng nhập tên danh mục.");
      return;
    }

    const data = { name, description };

    try {
      if (editingId) {
        await updateDoc(doc(db, "categories", editingId), data);
        showAlert("success", "Cập nhật danh mục thành công!");
      } else {
        await addDoc(collection(db, "categories"), data);
        showAlert("success", "Thêm danh mục thành công!");
      }
      resetForm();
    } catch (error) {
      showAlert("error", "Có lỗi xảy ra: " + error.message);
    }
  };

  // ── Bấm Edit → đổ dữ liệu vào form ───────────────
  const handleEdit = (category) => {
    setName(category.name || "");
    setDescription(category.description || "");
    setEditingId(category.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── DELETE ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      showAlert("success", "Đã xóa danh mục.");
    } catch (error) {
      showAlert("error", "Xóa thất bại: " + error.message);
    }
  };

  // ── RENDER ─────────────────────────────────────────
  return (
    <div className="cm-container">

      {/* Page header */}
      <div className="cm-header">
        <h1>Quản lý Danh mục</h1>
        <span>{categories.length} danh mục</span>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`cm-alert ${alert.type}`}>
          {alert.msg}
        </div>
      )}

      {/* Form thêm / sửa */}
      <div className="cm-form-card">
        <h2>{editingId ? "✏️  Chỉnh sửa danh mục" : "➕  Thêm danh mục mới"}</h2>

        <form className="cm-form" onSubmit={handleSubmit}>

          <div>
            <label className="cm-label">Tên danh mục *</label>
            <input
              className="cm-input"
              type="text"
              placeholder="VD: Vaccine, Thuốc ký sinh trùng..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="cm-form-full">
            <label className="cm-label">Mô tả</label>
            <textarea
              className="cm-textarea"
              placeholder="Mô tả ngắn về danh mục..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="cm-form-actions">
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Hủy
              </button>
            )}
            <button type="submit" className="btn-primary">
              {editingId ? "Lưu thay đổi" : "Thêm danh mục"}
            </button>
          </div>

        </form>
      </div>

      {/* Danh sách danh mục */}
      <div className="cm-list-header">
        <h2>Danh sách danh mục</h2>
        <span className="cm-count">Hiển thị {categories.length} danh mục</span>
      </div>

      <div className="cm-list">
        {categories.length === 0 ? (
          <div className="cm-empty">
            <p>Chưa có danh mục nào. Thêm danh mục đầu tiên bên trên!</p>
          </div>
        ) : (
          categories.map((category) => (
            <div className="cm-item" key={category.id}>
              <div className="cm-item-body">
                <h3 className="cm-item-name">{category.name}</h3>
                {category.description && (
                  <p className="cm-item-desc">{category.description}</p>
                )}
              </div>
              <div className="cm-item-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(category)}
                >
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(category.id)}
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

export default CategoryManager;