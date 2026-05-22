import { useState } from "react";
import { useProducts, useCategories } from "../../hooks/useProducts";
import ProductCard from "../../components/customer/ProductCard";
import "../../styles/customer/products.css";

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { products, loading } = useProducts(selectedCategory);
  const { categories } = useCategories();

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <h1>Danh sách sản phẩm</h1>

      {/* Search & Filter */}
      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;