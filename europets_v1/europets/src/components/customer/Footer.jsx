import { Link } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import "../../styles/customer/footer.css";

function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <>
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--footer-bg)"/>
        </svg>
      </div>
      <footer className="footer">
        <div className="footer-inner">

          <div className="footer-col footer-info">
            <h3>{f.company}</h3>
            <p>{f.license}</p>
            <p><strong>{t.nav.about === "About Us" ? "Address:" : "Địa chỉ:"}</strong> {f.address}</p>
            <p><span className="footer-icon">📞</span> (+84) 999 222 333</p>
            <p><span className="footer-icon">✉️</span> contact.vietnam@europets.biz</p>
          </div>

          <div className="footer-col footer-links">
            <h4>{f.followUs}</h4>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.7a8.15 8.15 0 0 0 4.77 1.52V4.77a4.85 4.85 0 0 1-1-.08z"/></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
            <hr className="footer-divider"/>
            <nav className="footer-nav">
              <Link to="/about">{f.links.about}</Link>
              <Link to="/products">{f.links.products}</Link>
              <Link to="/contact">{f.links.contact}</Link>
              <Link to="/faq">{f.links.faq}</Link>
            </nav>
          </div>

          <div className="footer-col footer-map">
            <iframe
              title="EuroPets location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0!2d106.75!3d10.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ5JzEyLjAiTiAxMDbCsDQ1JzAwLjAiRQ!5e0!3m2!1svi!2s!4v1"
              width="100%"
              height="180"
              style={{ border: 0, borderRadius: "10px" }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>

        </div>
        <div className="footer-bottom">
          <span>{f.copyright}</span>
          <div className="footer-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
