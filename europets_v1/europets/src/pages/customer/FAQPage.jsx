import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useLang } from "../../context/LangContext";
import "../../styles/customer/faq.css";

// ── Local FAQ images (5 ảnh, map theo index 0-4) ──
import img0 from "../../utils/FAQ/505690-hoc-gi-de-tro-thanh-bac-si-thu-y-7.jpg";
import img1 from "../../utils/FAQ/top-phong-kham-thu-y-q7.jpg";
import img2 from "../../utils/FAQ/thu-y-nam-an-1400x788.jpg";
import img3 from "../../utils/FAQ/hinh-nen-con-meo.jpg";
import img4 from "../../utils/FAQ/OIP.jfif";

const LOCAL_IMAGES = [img0, img1, img2, img3, img4];

// ── Accordion item ──
function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-acc-item${open ? " open" : ""}`}>
      <button className="faq-acc-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <svg
          className={`faq-acc-icon${open ? " rotated" : ""}`}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="faq-acc-body">
        <p>{a}</p>
      </div>
    </div>
  );
}

function FAQPage() {
  const { t } = useLang();
  const [faqItems,  setFaqItems]  = useState([]);
  const [faqImages, setFaqImages] = useState({});
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getDoc(doc(db, "content", "faq")),
      getDoc(doc(db, "content", "faqImages")),
    ]).then(([faqSnap, imgSnap]) => {
      if (faqSnap.exists()) setFaqItems(faqSnap.data().items || []);
      if (imgSnap.exists()) setFaqImages(imgSnap.data() || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Merge static text (từ i18n) + ảnh (từ Firestore nếu có, fallback local)
  const displayFAQ = t.faq.staticItems.map((item, i) => ({
    ...item,
    image: faqImages[`img${i}`] || LOCAL_IMAGES[i] || "",
  }));

  // Accordion items: Firestore > i18n fallback
  const accordionItems = faqItems.length > 0 ? faqItems : t.faq.accordionFallback;

  return (
    <div className="faq-page">

      {/* ── Hero header ── */}
      <div className="faq-hero">
        <h1>{t.faq.title}</h1>
        <p>{t.faq.subtitle}</p>
      </div>

      {/* ── Alternating image+text blocks ── */}
      {loading ? (
        <div className="faq-loading">
          <div className="faq-spinner"/>
          <p>{t.faq.loading}</p>
        </div>
      ) : (
        <div className="faq-blocks">
          {displayFAQ.map((item, i) => (
            <section
              key={i}
              className={`faq-block${i % 2 === 1 ? " faq-block--reverse" : ""}`}
            >
              <div className="faq-block-inner">

                <div className="faq-block-text">
                  <div className="faq-block-index">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>

                <div className="faq-block-img-wrap">
                  {item.image
                    ? <img src={item.image} alt={item.q} className="faq-img" loading="lazy"/>
                    : <div className="faq-img-placeholder">🐾</div>
                  }
                </div>

              </div>
            </section>
          ))}
        </div>
      )}

      {/* ── Accordion section ── */}
      <section className="faq-accordion-section">
        <div className="faq-accordion-inner">
          <h2 className="faq-accordion-title">Câu hỏi thêm</h2>
          {accordionItems.map((item, i) => (
            <AccordionItem
              key={i}
              q={item.question || item.q}
              a={item.answer   || item.a}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

export default FAQPage;
