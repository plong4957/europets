import { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useLang } from "../../context/LangContext";
import ProductCard from "../../components/customer/ProductCard";
import "../../styles/customer/products.css";

function ProductsPage() {
  const { t } = useLang();
  const p = t.products;
  const { products, loading } = useProducts();
  const [search, setSearch] = useState("");

  const filtered = products.filter((prod) =>
    prod.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      <section className="products-header">
        <div className="products-header-inner">
          <nav className="breadcrumb">
            <span>{p.breadcrumb.products}</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{p.breadcrumb.list}</span>
          </nav>
        </div>
      </section>

      <section className="products-body">
        <div className="products-toolbar">
          <div className="products-count">
            {loading ? p.loading : `${filtered.length} ${p.breadcrumb.products.toLowerCase()}`}
          </div>
          <input
            type="text"
            className="products-search"
            placeholder={`🔍  ${p.title}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="products-loading">
            <div className="loading-spinner" />
            <p>{p.loading}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="products-empty">
            <span>🔍</span>
            <p>{p.empty}</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((prod) => <ProductCard key={prod.id} product={prod} />)}
          </div>
        )}
      </section>

      <div className="wave-divider">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,20 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--accent-light)"/>
        </svg>
      </div>

    </div>
  );
}

export default ProductsPage;
