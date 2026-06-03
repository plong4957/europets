import { Link } from "react-router-dom";
import "../../styles/customer/productCard.css";

function ProductCard({ product, dark }) {
  const imgSrc = product.image || product.imageUrl || product.img || "";

  console.log("ProductCard:", product.name, "| image:", product.image, "| imageUrl:", product.imageUrl, "| imgSrc:", imgSrc);

  return (
    <Link to={`/products/${product.id}`} className={`product-card${dark ? " product-card--dark" : ""}`}>
      <div className="product-card__img-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            onError={(e) => {
              console.error("Ảnh lỗi:", imgSrc);
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="product-card__placeholder">💊</div>
        )}
      </div>
      <div className="product-card__body">
        <p className="product-card__name">{product.name}</p>
        {product.category && (
          <span className="product-card__cat">{product.category}</span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;