import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useProducts } from "../../hooks/useProducts";
import { useLang } from "../../context/LangContext";
import ProductCard from "../../components/customer/ProductCard";
import "../../styles/customer/home.css";

function HomePage() {
  const { t, lang } = useLang();
  const h = t.home;

  const { products, loading } = useProducts();
  const featured = products.slice(0, 4);

  const [content, setContent] = useState({
    title: "", description: "",
    heroImage: "", introImage: "", briefImage: "", featuresImage: "",
  });

  useEffect(() => {
    getDoc(doc(db, "content", "home")).then((snap) => {
      if (snap.exists()) setContent(c => ({ ...c, ...snap.data() }));
    });
  }, []);

  const heroImage    = content.heroImage    || content.image || "";
  const introImage   = content.introImage   || content.image || "";
  const briefImage   = content.briefImage   || content.image || "";
  const featuresImage= content.featuresImage|| content.image || "";

  // Title & description: chỉ dùng Firestore khi đang ở ngôn ngữ mặc định (vi)
  // Khi switch sang ngôn ngữ khác luôn dùng i18n để đảm bảo đúng ngôn ngữ
  const heroTitle = (lang === "vi" && content.title) ? content.title : h.heroTitle;
  const introDescription = (lang === "vi" && content.description) ? content.description : h.introText;

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            {heroTitle.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}
          </h1>
          <Link to="/products" className="btn-ghost">{h.heroBtn}</Link>
        </div>
        <div className="hero-image-wrap">
          {heroImage
            ? <img src={heroImage} alt="Europets" className="hero-img" />
            : <div className="hero-img-placeholder">🐕</div>
          }
        </div>
        <span className="deco-paw deco-1"></span>
        <span className="deco-paw deco-2"></span>
      </section>

      {/* Wave */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg)"/>
        </svg>
      </div>

      {/* ── LỜI NÓI ĐẦU ── */}
      <section className="intro-section">
        <div className="intro-inner">
          <div className="intro-text">
            <h2>{h.introTitle}</h2>
            <p>
              {introDescription}
            </p>
          </div>
          <div className="intro-image-wrap">
            {introImage
              ? <img src={introImage} alt="" className="intro-img-real" />
              : <div className="intro-img-circle">🐕</div>
            }
          </div>
        </div>
      </section>

      {/* ── GIỚI THIỆU NGẮN ── */}
      <section className="about-brief-section">
        <div className="wave-top">
          {/* fill = màu của section phía TRÊN (intro-section = --bg) → chảy vào --accent-xlight */}
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,0 C480,60 960,0 1440,0 L1440,60 L0,60 Z" fill="var(--bg)"/>
          </svg>
        </div>
        <div className="about-brief-inner">
          <div className="about-brief-img">
            {briefImage
              ? <img src={briefImage} alt="" className="brief-img-real" />
              : <span>🏥</span>
            }
          </div>
          <div className="about-brief-text">
            <div className="quote-mark">"</div>
            <h3>{h.aboutTitle}</h3>
            <p>{h.aboutText}</p>
            <div className="quote-mark right">"</div>
          </div>
        </div>
        <div className="wave-bottom">
          {/* fill = màu của section phía DƯỚI (features-section = --bg) */}
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,60 C480,0 960,60 1440,60 L1440,0 L0,0 Z" fill="var(--bg)"/>
          </svg>
        </div>
      </section>

      {/* ── ĐẶC ĐIỂM NỔI BẬT ── */}
      <section className="features-section">
        <h2 className="section-title">{h.featuresTitle}</h2>
        <div className="features-layout">
          <div className="features-pills left-pills">
            {h.features.slice(0, 3).map((f, i) => (
              <span key={i} className="pill">{f}</span>
            ))}
          </div>
          <div className="features-center-wrap">
            {featuresImage
              ? <img src={featuresImage} alt="" className="features-center-real" />
              : <div className="features-center-img">🐶🐱</div>
            }
          </div>
          <div className="features-pills right-pills">
            {h.features.slice(3).map((f, i) => (
              <span key={i} className="pill">{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SẢN PHẨM ── */}
      <section className="home-products-section">
        <div className="wave-top-green">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,0 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg)"/>
          </svg>
        </div>
        <div className="home-products-inner">
          <h2 className="section-title light">{h.productsTitle}</h2>
          {loading ? (
            <p className="loading" style={{ color: "rgba(255,255,255,0.6)" }}>
              {t.products.loading}
            </p>
          ) : (
            <div className="home-products-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} dark />)}
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link to="/products" className="btn-ghost">{h.viewAll} →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;