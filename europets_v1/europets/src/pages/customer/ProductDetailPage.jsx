import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useLang } from "../../context/LangContext";
import ProductCard from "../../components/customer/ProductCard";
import "../../styles/customer/productDetail.css";

function ProductDetailPage() {
  const { t } = useLang();
  const p = t.products;

  const { id } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((prod) => prod.id === id);
  const related = products.filter((prod) => prod.id !== id).slice(0, 4);

  const mainImg = product?.image || product?.imageUrl || "";
  const allImgs = product?.images?.length > 0
    ? product.images
    : mainImg ? [mainImg] : [];

  const [activeImg, setActiveImg] = useState(null);
  const displayImg = activeImg || allImgs[0] || "";

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-spinner" />
      <p>{p.loading}</p>
    </div>
  );
  if (!product) return (
    <div className="detail-loading"><p>{p.empty}</p></div>
  );

  const ingredients = product.ingredients || "";
  const description = product.description || "";

  return (
    <div className="detail-page">

      <div className="detail-breadcrumb">
        <div className="detail-bc-inner">
          <Link to="/products">{p.breadcrumb.products}</Link>
          <span className="bc-sep">›</span>
          <Link to="/products">{p.breadcrumb.list}</Link>
          <span className="bc-sep">›</span>
          <span className="bc-current">{product.name}</span>
        </div>
      </div>

      <section className="detail-main">
        <div className="detail-main-card">

          <div className="detail-gallery">
            {allImgs.length > 1 && (
              <div className="detail-thumbs">
                <button className="thumb-nav" onClick={() => {
                  const cur = allImgs.indexOf(displayImg);
                  setActiveImg(allImgs[Math.max(0, cur - 1)]);
                }}>▲</button>
                {allImgs.map((img, i) => (
                  <div
                    key={i}
                    className={`detail-thumb${displayImg === img ? " active" : ""}`}
                    onClick={() => setActiveImg(img)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </div>
                ))}
                <button className="thumb-nav" onClick={() => {
                  const cur = allImgs.indexOf(displayImg);
                  setActiveImg(allImgs[Math.min(allImgs.length - 1, cur + 1)]);
                }}>▼</button>
              </div>
            )}
            <div className="detail-img-main">
              {displayImg
                ? <img src={displayImg} alt={product.name} />
                : <div className="detail-img-placeholder">💊</div>
              }
            </div>
          </div>

          <div className="detail-info">
            <h1 className="detail-name">{product.name}</h1>
            {product.subtitle && <p className="detail-subtitle">{product.subtitle}</p>}
            {ingredients && (
              <div className="detail-ingredients" dangerouslySetInnerHTML={{ __html: ingredients }} />
            )}
            {!ingredients && description && (
              <div className="detail-ingredients" dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </div>

        </div>
      </section>

      {ingredients && description && (
        <section className="detail-desc-section">
          <div className="detail-desc-card">
            <hr className="detail-divider" />
            <div className="detail-desc-html" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="detail-related">
          <div className="wave-related">
            <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,0 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="var(--bg)"/>
            </svg>
          </div>
          <div className="detail-related-inner">
            <h2>{p.related}</h2>
            <div className="related-grid">
              {related.map((prod) => <ProductCard key={prod.id} product={prod} />)}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

export default ProductDetailPage;
