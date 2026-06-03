import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useLang } from "../../context/LangContext";
import "../../styles/customer/about.css";

function AboutPage() {
  const { t } = useLang();
  const a = t.about;

  const [content, setContent] = useState({ visionImage: "", partnerImage: "" });
  useEffect(() => {
    getDoc(doc(db, "content", "about")).then((snap) => {
      if (snap.exists()) setContent(snap.data());
    });
  }, []);

  const visionImage  = content.visionImage  || content.image || "";
  const partnerImage = content.partnerImage || content.image || "";

  return (
    <div className="about-page">

      <section className="about-header">
        <div className="about-header-inner">
          <h1>{a.title}</h1>
        </div>
      </section>

      <section className="about-intro-section">
        <div className="about-intro-card">
          <ul className="about-list">
            <li><strong>Công ty TNHH Europets</strong> {a.p1.replace("Công ty TNHH Europets ", "")}</li>
            <li><strong>Công ty TNHH Europets</strong> {a.p2.replace("Công ty TNHH Europets ", "")}</li>
            <li>{a.p3}</li>
          </ul>
        </div>
      </section>

      <section className="vision-section">
        <div className="wave-top2">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,0 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--accent-light)"/>
          </svg>
        </div>
        <div className="vision-inner">
          <div className="vision-text">
            <div className="vision-item">
              <div className="vision-icon">🎯</div>
              <div>
                <h3>{a.visionTitle}</h3>
                <p>{a.vision}</p>
              </div>
            </div>
            <hr className="vision-divider"/>
            <div className="vision-item">
              <div className="vision-icon">💡</div>
              <div>
                <h3>{a.missionTitle}</h3>
                <p>{a.mission}</p>
              </div>
            </div>
          </div>
          <div className="vision-img-wrap">
            {visionImage
              ? <img src={visionImage} alt={a.visionTitle} className="vision-img-real"/>
              : <div className="vision-img-placeholder">🐕</div>
            }
          </div>
        </div>
        <div className="wave-bottom2">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,60 C480,0 960,60 1440,30 L1440,0 L0,0 Z" fill="var(--accent-light)"/>
          </svg>
        </div>
      </section>

      <section className="values-section">
        <div className="values-title-wrap">
          <span className="values-title-pill">{a.valuesTitle}</span>
        </div>
        <p className="values-sub">{a.values}</p>
        <div className="values-grid">
          {a.coreValues.map((v) => (
            <div className="value-card" key={v.label}>
              <div className="value-card-header">{v.label}</div>
              <div className="value-card-body"><p>{v.text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="partner-section">
        <div className="partner-inner">
          <div className="partner-left">
            <div className="partner-logos">
              <div className="partner-logo-box msd">
                <span>🏥</span><strong>MSD<br/>Animal Health</strong>
              </div>
              <div className="partner-logo-box ep">
                <span>🛡️</span><strong>EUROPETS</strong>
              </div>
            </div>
            {partnerImage && <img src={partnerImage} alt={a.partnerTitle} className="partner-img"/>}
          </div>
          <div className="partner-text-wrap">
            <h3>{a.partnerTitle}</h3>
            <p>{a.partnerText}</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutPage;
