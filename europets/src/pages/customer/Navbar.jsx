import { Link, NavLink } from "react-router-dom";
import "../../styles/customer/navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🐾 EuroPets
        </Link>
        <nav className="navbar-links">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/products">Sản phẩm</NavLink>
          <NavLink to="/about">Giới thiệu</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;