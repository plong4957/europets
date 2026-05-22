import { Link } from "react-router-dom";
import "../../styles/customer/productCard.css";

function ProductCard({ product }) {
  const { id, name, price, image, description } = product;

  return (
    <Link to={`/products/${id}`} className="product-card">
      <div className="product-card-image">
        <img src={image || "/favicon.svg"} alt={name} />
      </div>
      <div className="product-card-body">
        <h3>{name}</h3>
        <p className="product-card-desc">{description?.slice(0, 80)}...</p>
        <span className="product-card-price">
          {Number(price).toLocaleString("vi-VN")} ₫
        </span>
      </div>
    </Link>
  );
}

export default ProductCard;