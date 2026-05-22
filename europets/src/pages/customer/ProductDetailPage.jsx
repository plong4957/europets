import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "../../styles/customer/productDetail.css";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, "products", id)).then((snap) => {
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="loading">Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div className="product-detail">
      <Link to="/products" className="back-link">← Quay lại</Link>
      <div className="detail-container">
        <div className="detail-image">
          <img src={product.image || "/favicon.svg"} alt={product.name} />
        </div>
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="detail-price">
            {Number(product.price).toLocaleString("vi-VN")} ₫
          </p>
          <p className="detail-desc">{product.description}</p>
          <button className="btn-primary">Liên hệ đặt hàng</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;