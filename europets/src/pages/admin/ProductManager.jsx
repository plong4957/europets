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
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";

function ProductManager() {
  // ── Form state ─────────────────────────────────────
  const [name, setName]               = useState("");
  const [price, setPrice]             = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage]             = useState("");
  const [previewUrl, setPreviewUrl]   = useState("");
  const [categoryId, setCategoryId]   = useState(""); // ← THÊM

  // ── UI state ───────────────────────────────────────
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]); // ← THÊM
  const [filterCategory, setFilterCategory] = useState(""); // ← THÊM
  const [editingId, setEditingId]     = useState(null);
  const [alert, setAlert]             = useState(null);

  // ── Cloudinary hook ────────────────────────────────
  const { uploadImage, uploading, progress, error: uploadError } = useCloudinaryUpload();

  // ── Realtime listener: products ────────────────────
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    });
    return () => unsubscribe();
  }, []);

  // ── Realtime listener: categories ──────────────────
  useEffect(() => { // ← THÊM
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
    setPrice("");
    setDescription("");
    setImage("");
    setPreviewUrl("");
    setCategoryId(""); // ← THÊM
    setEditingId(null);
  };

  // ── Chọn file → preview + upload Cloudinary ────────
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    const url = await uploadImage(file);
    if (url) setImage(url);
  };

  // ── ADD hoặc UPDATE ────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description) {
      showAlert("error", "Vui lòng nhập đầy đủ Tên, Giá và Mô tả.");
      return;
    }

    const data = { name, price, description, image, categoryId }; // ← THÊM categoryId

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), data);
        showAlert("success", "Cập nhật sản phẩm thành công!");
      } else {
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
    setPreviewUrl(product.image || "");
    setCategoryId(product.categoryId || ""); // ← THÊM
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

  // ── Lọc sản phẩm theo danh mục ────────────────────
  const filteredProducts = filterCategory // ← THÊM
    ? products.filter((p) => p.categoryId === filterCategory)
    : products;

  // ── Helper: lấy tên danh mục từ id ────────────────
  const getCategoryName = (id) => { // ← THÊM
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : null;
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

          {/* ← THÊM: Dropdown danh mục */}
          <div>
            <label className="pm-label">Danh mục</label>
            <select
              className="pm-input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
            <label className="pm-label">Ảnh sản phẩm</label>

            <label className="pm-upload-btn">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: "none" }}
              />
              {uploading ? `Đang upload... ${progress}%` : previewUrl ? "Đổi ảnh" : "Chọn ảnh"}
            </label>

            {uploading && (
              <div className="pm-progress-track">
                <div className="pm-progress-bar" style={{ width: `${progress}%` }} />
              </div>
            )}

            {uploadError && (
              <p className="pm-upload-error">{uploadError}</p>
            )}

            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="pm-preview-img" />
            )}
          </div>

          <div className="pm-form-actions">
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Hủy
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={uploading}>
              {editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </button>
          </div>

        </form>
      </div>

      {/* ← THÊM: Filter theo danh mục */}
      <div className="pm-list-header">
        <h2>Danh sách sản phẩm</h2>
        <div className="pm-filter">
          <select
            className="pm-input"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="pm-count">
            Hiển thị {filteredProducts.length} sản phẩm
          </span>
        </div>
      </div>

      <div className="pm-grid">
        {filteredProducts.length === 0 ? (
          <div className="pm-empty">
            <p>Chưa có sản phẩm nào.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
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
                {/* ← THÊM: hiện tên danh mục */}
                {getCategoryName(product.categoryId) && (
                  <span className="pm-card-category">
                    {getCategoryName(product.categoryId)}
                  </span>
                )}
                {product.price && (
                  <p className="pm-card-price">{product.price}</p>
                )}
                <p className="pm-card-desc">{product.description}</p>
              </div>

              <div className="pm-card-actions">
                <button className="btn-edit" onClick={() => handleEdit(product)}>
                  Sửa
                </button>
                <button className="btn-delete" onClick={() => handleDelete(product.id)}>
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