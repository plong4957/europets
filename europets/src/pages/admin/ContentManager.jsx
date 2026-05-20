// src/pages/admin/ContentManager.jsx

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import "../../styles/ContentManager2.css";

const TABS = [
  { key: "home",  label: "Trang chủ"     },
  { key: "about", label: "Về chúng tôi"  },
  { key: "faq",   label: "FAQ"           },
];

// ── Helper: tạo id ngắn cho FAQ item ──────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

// ─────────────────────────────────────────────────────
//  TAB: Trang chủ & Về chúng tôi (dùng chung component)
// ─────────────────────────────────────────────────────
function PageTab({ docKey }) {
  const { uploadImage, uploading, progress, error: uploadError } = useCloudinaryUpload();

  const [form, setForm]       = useState({ title: "", description: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [preview, setPreview] = useState("");

  // ── Load từ Firestore ────────────────────────────
  useEffect(() => {
    setLoading(true);
    getDoc(doc(db, "content", docKey)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setForm(data);
        setPreview(data.image || "");
      }
      setLoading(false);
    });
  }, [docKey]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  // ── Upload ảnh ──────────────────────────────────
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      setForm((f) => ({ ...f, image: url }));
      setPreview(url);
      setSaved(false);
    }
  };

  // ── Lưu vào Firestore ───────────────────────────
  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, "content", docKey), form);
    setSaving(false);
    setSaved(true);
  };

  if (loading) return <p className="cm2-loading">Đang tải...</p>;

  return (
    <div className="cm2-form">

      {/* Tiêu đề */}
      <div className="cm2-field">
        <label className="cm2-label">Tiêu đề</label>
        <input
          className="cm2-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Nhập tiêu đề..."
        />
      </div>

      {/* Mô tả */}
      <div className="cm2-field">
        <label className="cm2-label">Mô tả</label>
        <textarea
          className="cm2-textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Nhập mô tả..."
        />
      </div>

      {/* Ảnh */}
      <div className="cm2-field">
        <label className="cm2-label">Ảnh</label>

        {preview && (
          <img src={preview} alt="preview" className="cm2-preview" />
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImage}
          className="cm2-file"
        />

        {uploading && (
          <div className="cm2-progress-wrap">
            <div className="cm2-progress-bar" style={{ width: `${progress}%` }} />
            <span className="cm2-progress-text">{progress}%</span>
          </div>
        )}

        {uploadError && <p className="cm2-error">{uploadError}</p>}
      </div>

      {/* Lưu */}
      <button
        className="cm2-btn-save"
        onClick={handleSave}
        disabled={saving || uploading}
      >
        {saving ? "Đang lưu..." : saved ? "✓ Đã lưu" : "Lưu thay đổi"}
      </button>

    </div>
  );
}

// ─────────────────────────────────────────────────────
//  TAB: FAQ
// ─────────────────────────────────────────────────────
function FaqTab() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  // ── Load ────────────────────────────────────────
  useEffect(() => {
    getDoc(doc(db, "content", "faq")).then((snap) => {
      if (snap.exists()) setItems(snap.data().items || []);
      setLoading(false);
    });
  }, []);

  const markChanged = () => setSaved(false);

  // ── Thêm câu hỏi ────────────────────────────────
  const handleAdd = () => {
    setItems((prev) => [...prev, { id: uid(), question: "", answer: "" }]);
    markChanged();
  };

  // ── Xóa câu hỏi ─────────────────────────────────
  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    markChanged();
  };

  // ── Chỉnh nội dung ──────────────────────────────
  const handleChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
    markChanged();
  };

  // ── Lưu ─────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, "content", "faq"), { items });
    setSaving(false);
    setSaved(true);
  };

  if (loading) return <p className="cm2-loading">Đang tải...</p>;

  return (
    <div className="cm2-form">

      {items.length === 0 && (
        <p className="cm2-empty">Chưa có câu hỏi nào. Bấm "+ Thêm câu hỏi" để bắt đầu.</p>
      )}

      {items.map((item, idx) => (
        <div key={item.id} className="cm2-faq-item">

          <div className="cm2-faq-top">
            <span className="cm2-faq-num">#{idx + 1}</span>
            <button
              className="cm2-btn-delete"
              onClick={() => handleDelete(item.id)}
            >
              Xóa
            </button>
          </div>

          <div className="cm2-field">
            <label className="cm2-label">Câu hỏi</label>
            <input
              className="cm2-input"
              value={item.question}
              onChange={(e) => handleChange(item.id, "question", e.target.value)}
              placeholder="Nhập câu hỏi..."
            />
          </div>

          <div className="cm2-field">
            <label className="cm2-label">Trả lời</label>
            <textarea
              className="cm2-textarea"
              value={item.answer}
              onChange={(e) => handleChange(item.id, "answer", e.target.value)}
              rows={3}
              placeholder="Nhập câu trả lời..."
            />
          </div>

        </div>
      ))}

      <div className="cm2-faq-actions">
        <button className="cm2-btn-add" onClick={handleAdd}>
          + Thêm câu hỏi
        </button>
        <button
          className="cm2-btn-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : saved ? "✓ Đã lưu" : "Lưu thay đổi"}
        </button>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────
function ContentManager() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="cm2-container">

      {/* Header */}
      <div className="cm2-header">
        <h1>Quản lý nội dung</h1>
        <span>Chỉnh nội dung hiển thị trên website</span>
      </div>

      {/* Tabs */}
      <div className="cm2-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`cm2-tab ${activeTab === t.key ? "cm2-tab--active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="cm2-panel">
        {activeTab === "home"  && <PageTab key="home"  docKey="home"  />}
        {activeTab === "about" && <PageTab key="about" docKey="about" />}
        {activeTab === "faq"   && <FaqTab />}
      </div>

    </div>
  );
}

export default ContentManager;