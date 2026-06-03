import { Link, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useLang, LANG_OPTIONS } from "../../context/LangContext";
import "../../styles/customer/navbar.css";

function Navbar() {
  const { t, lang, switchLang } = useLang();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = LANG_OPTIONS.find(l => l.code === lang) || LANG_OPTIONS[0];

  const NAV_LINKS = [
    { to: "/",        label: t.nav.home,     end: true },
    { to: "/about",   label: t.nav.about },
    { to: "/products",label: t.nav.products },
    { to: "/faq",     label: t.nav.faq },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
            <path d="M18 2L4 10v10c0 8.3 5.9 16.1 14 18 8.1-1.9 14-9.7 14-18V10L18 2z" fill="#c9a84c"/>
            <path d="M12 18l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>EUROPETS</span>
        </Link>

        {/* Desktop nav */}
        <nav className={`navbar-links${mobileOpen ? " open" : ""}`}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right section */}
        <div className="navbar-right">

          {/* Language switcher */}
          <div className="lang-switcher" ref={dropRef}>
            <button
              className="lang-btn"
              onClick={() => setDropOpen(o => !o)}
              aria-expanded={dropOpen}
            >
              <span>{currentLang.flag}</span>
              <span className="lang-label">{currentLang.label}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`lang-chevron${dropOpen ? " up" : ""}`}>
                <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {dropOpen && (
              <div className="lang-dropdown">
                {LANG_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    className={`lang-option${lang === opt.code ? " active" : ""}`}
                    onClick={() => { switchLang(opt.code); setDropOpen(false); }}
                  >
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`navbar-hamburger${mobileOpen ? " open" : ""}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
