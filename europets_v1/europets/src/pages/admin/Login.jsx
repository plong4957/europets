import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
            <path d="M18 2L4 10v10c0 8.3 5.9 16.1 14 18 8.1-1.9 14-9.7 14-18V10L18 2z" fill="#c9a84c"/>
            <path d="M12 18l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={styles.logoText}>EUROPETS</span>
        </div>

        <h2 style={styles.title}>Đăng nhập quản trị</h2>
        <p style={styles.subtitle}>Chỉ dành cho quản trị viên</p>

        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email */}
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                placeholder="admin@europets.biz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Mật khẩu</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...styles.input, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p style={styles.footer}>© 2026 EuroPets. All Rights Reserved.</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a2218 0%, #1a4731 60%, #256040 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Be Vietnam Pro', sans-serif",
  },
  blob1: {
    position: "absolute", width: "400px", height: "400px",
    borderRadius: "50%", background: "rgba(82,183,136,0.12)",
    top: "-100px", left: "-100px", filter: "blur(60px)",
  },
  blob2: {
    position: "absolute", width: "300px", height: "300px",
    borderRadius: "50%", background: "rgba(201,168,76,0.1)",
    bottom: "-80px", right: "-60px", filter: "blur(50px)",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "44px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
    position: "relative",
    zIndex: 2,
  },
  logoWrap: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "12px", marginBottom: "24px",
  },
  logoText: {
    fontSize: "1.4rem", fontWeight: "800",
    color: "#0f2d1e", letterSpacing: "2px",
  },
  title: {
    textAlign: "center", fontSize: "1.25rem",
    fontWeight: "700", color: "#0f2d1e", marginBottom: "6px",
  },
  subtitle: {
    textAlign: "center", fontSize: "0.83rem",
    color: "#9ca3af", marginBottom: "28px",
  },
  errorBox: {
    background: "#fef2f2", border: "1px solid #fecaca",
    color: "#dc2626", borderRadius: "10px",
    padding: "12px 16px", fontSize: "0.85rem",
    marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#374151" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute", left: "14px", fontSize: "1rem", pointerEvents: "none",
  },
  input: {
    width: "100%", padding: "12px 14px 12px 40px",
    border: "1.5px solid #d1d5db", borderRadius: "10px",
    fontSize: "0.92rem", fontFamily: "inherit", outline: "none",
    color: "#1a1a1a", background: "white",
    transition: "border-color 0.2s",
  },
  eyeBtn: {
    position: "absolute", right: "12px", background: "none",
    border: "none", cursor: "pointer", fontSize: "1rem", padding: "4px",
  },
  submitBtn: {
    marginTop: "8px", padding: "13px",
    background: "#1e6647", color: "white",
    border: "none", borderRadius: "10px",
    fontSize: "0.95rem", fontWeight: "700",
    cursor: "pointer", fontFamily: "inherit",
    transition: "background 0.2s",
  },
  footer: {
    textAlign: "center", fontSize: "0.75rem",
    color: "#d1d5db", marginTop: "28px",
  },
};

export default Login;