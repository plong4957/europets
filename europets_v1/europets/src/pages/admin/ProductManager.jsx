import { useState, useEffect } from "react";
import "../../styles/admin/ProductManager.css";
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import RichEditor from "../../components/admin/RichEditor";

function ProductManager() {
  const [name,        setName]        = useState("");
  const [price,       setPrice]       = useState("");
  const [ingredients, setIngredients] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [image,       setImage]       = useState("");  
  const [images,      setImages]      = useState([]); 
  const [previewUrl,  setPreviewUrl]  = useState("");
  const [categoryId,  setCategoryId]  = useState("");

  const [products,       setProducts]       = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [editingId,      setEditingId]      = useState(null);
  const [alert,          setAlert]          = useState(null);

  const { uploadImage, uploading, progress, error: uploadError } = useCloudinaryUpload();
  const [uploadingExtra, setUploadingExtra] = useState(false);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "products"), (s) => {
      setProducts(s.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const u2 = onSnapshot(collection(db, "categories"), (s) => {
      setCategories(s.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => { u1(); u2(); };
  }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  };

  const resetForm = () => {
    setName(""); setPrice(""); setIngredients(""); setDescription("");
    setImage(""); setImages([]); setPreviewUrl(""); setCategoryId("");
    setEditingId(null);
  };

  // Upload ảnh chính
  const handleMainFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    const url = await uploadImage(file);
    if (url) { setImage(url); setImages(prev => [url, ...prev.filter((_, i) => i !== 0)]); }
  };

  // Upload thêm ảnh phụ
  const handleExtraFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingExtra(true);
    const urls = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    setImages(prev => [...prev, ...urls]);
    setUploadingExtra(false);
  };

  // Xóa ảnh phụ
  const removeExtraImg = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { showAlert("error", "Vui lòng nhập tên sản phẩm."); return; }
    const data = { name, price, ingredients, description, image, images, categoryId };
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), data);
        showAlert("success", "Cập nhật thành công!");
      } else {
        await addDoc(collection(db, "products"), data);
        showAlert("success", "Thêm sản phẩm thành công!");
      }
      resetForm();
    } catch (err) {
      showAlert("error", "Lỗi: " + err.message);
    }
  };

  const handleEdit = (p) => {
    setName(p.name || ""); setPrice(p.price || "");
    setIngredients(p.ingredients || ""); setDescription(p.description || "");
    setImage(p.image || ""); setImages(p.images || []);
    setPreviewUrl(p.image || ""); setCategoryId(p.categoryId || "");
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try { await deleteDoc(doc(db, "products", id)); showAlert("success", "Đã xóa."); }
    catch (err) { showAlert("error", "Lỗi: " + err.message); }
  };

  const filteredProducts = filterCategory
    ? products.filter((p) => p.categoryId === filterCategory)
    : products;

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || null;

  return (
    <div className="pm-container">

      <div className="pm-header">
        <h1>Quản lý Sản phẩm</h1>
        <span>{products.length} sản phẩm</span>
      </div>

      {alert && <div className={`pm-alert ${alert.type}`}>{alert.msg}</div>}

      {/* ── FORM ── */}
      <div className="pm-form-card">
        <h2>{editingId ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h2>
        <form className="pm-form" onSubmit={handleSubmit}>

          <div>
            <label className="pm-label">Tên sản phẩm *</label>
            <input className="pm-input" placeholder="VD: Bravecto™ Chew"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="pm-label">Giá</label>
            <input className="pm-input" placeholder="VD: 450.000đ"
              value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div>
            <label className="pm-label">Danh mục</label>
            <select className="pm-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Bảng thành phần */}
          <div className="pm-form-full">
            <label className="pm-label">Bảng thành phần — hiển thị bên phải</label>
            <RichEditor
              value={ingredients}
              onChange={setIngredients}
              placeholder="Nhập bảng thành phần... dùng nút ⊞ Bảng để chèn bảng nhanh"
              minHeight={140}
            />
          </div>

          {/* Mô tả đầy đủ */}
          <div className="pm-form-full">
            <label className="pm-label">Mô tả đầy đủ — hiển thị bên dưới</label>
            <RichEditor
              value={description}
              onChange={setDescription}
              placeholder="Nhập mô tả đầy đủ: chỉ định, hướng dẫn sử dụng, bảo quản..."
              minHeight={200}
            />
          </div>

          {/* Ảnh chính */}
          <div className="pm-form-full">
            <label className="pm-label">Ảnh chính</label>
            <label className="pm-upload-btn">
              <input type="file" accept="image/*" onChange={handleMainFile}
                disabled={uploading} style={{ display: "none" }} />
              {uploading ? `Đang upload... ${progress}%` : previewUrl ? "Đổi ảnh chính" : "Chọn ảnh chính"}
            </label>
            {uploading && (
              <div className="pm-progress-track">
                <div className="pm-progress-bar" style={{ width: `${progress}%` }} />
              </div>
            )}
            {uploadError && <p className="pm-upload-error">{uploadError}</p>}
            {previewUrl && <img src={previewUrl} alt="Preview" className="pm-preview-img" />}
          </div>

          {/* Nhiều ảnh */}
          <div className="pm-form-full">
            <label className="pm-label">Thêm ảnh phụ (nhiều ảnh, bấm giữ Ctrl để chọn nhiều)</label>
            <label className="pm-upload-btn">
              <input type="file" accept="image/*" multiple onChange={handleExtraFiles}
                disabled={uploadingExtra} style={{ display: "none" }} />
              {uploadingExtra ? "Đang upload..." : "Chọn ảnh phụ"}
            </label>
            {images.length > 0 && (
              <div className="pm-extra-imgs">
                {images.map((img, i) => (
                  <div key={i} className="pm-extra-img-wrap">
                    <img src={img} alt={`img-${i}`} />
                    <button type="button" onClick={() => removeExtraImg(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pm-form-actions">
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>Hủy</button>
            )}
            <button type="submit" className="btn-primary" disabled={uploading || uploadingExtra}>
              {editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </button>
          </div>

        </form>
      </div>

      {/* ── FILTER + LIST ── */}
      <div className="pm-list-header">
        <h2>Danh sách sản phẩm</h2>
        <div className="pm-filter">
          <select className="pm-input" value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="pm-count">Hiển thị {filteredProducts.length} sản phẩm</span>
        </div>
      </div>

      <div className="pm-grid">
        {filteredProducts.length === 0 ? (
          <div className="pm-empty"><p>Chưa có sản phẩm nào.</p></div>
        ) : (
          filteredProducts.map((product) => (
            <div className="pm-card" key={product.id}>
              {product.image
                ? <img className="pm-card-img" src={product.image} alt={product.name} />
                : <div className="pm-card-img-placeholder">Chưa có ảnh</div>
              }
              <div className="pm-card-body">
                <h3 className="pm-card-name">{product.name}</h3>
                {getCategoryName(product.categoryId) && (
                  <span className="pm-card-category">{getCategoryName(product.categoryId)}</span>
                )}
                {product.price && <p className="pm-card-price">{product.price}</p>}
                <p className="pm-card-desc">{product.ingredients || product.description}</p>
                {product.images?.length > 0 && (
                  <p className="pm-card-img-count">📷 {product.images.length} ảnh</p>
                )}
              </div>
              <div className="pm-card-actions">
                <button className="btn-edit" onClick={() => handleEdit(product)}>Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(product.id)}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default ProductManager;
