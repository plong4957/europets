import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/customer/ProductCard";
import "../../styles/customer/home.css";

function HomePage() {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 4); // Hiện 4 sản phẩm nổi bật

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <h1>🐾 EuroPets</h1>
          <p>Thú cưng châu Âu thuần chủng, chất lượng cao</p>
          <Link to="/products" className="btn-primary">Xem sản phẩm</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured">
        <h2>Sản phẩm nổi bật</h2>
        {loading ? (
          <p className="loading">Đang tải...</p>
        ) : (
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <Link to="/products" className="btn-outline">Xem tất cả →</Link>
      </section>
    </div>
  );
}

export default HomePage;