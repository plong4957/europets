import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useLang } from "../../context/LangContext";
import "../../styles/customer/contact.css";

function ContactPage() {
  const { t } = useLang();
  const c = t.contact;
  const f = t.footer;

  const [form, setForm] = useState({
    name: "", phone: "", address: "", email: "", subject: "", message: ""
  });
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const [image,   setImage]   = useState("");

  useEffect(() => {
    getDoc(doc(db, "content", "contact")).then((snap) => {
      if (snap.exists()) setImage(snap.data().image || "");
    });
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", phone: "", address: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    }, 800);
  };

  return (
    <div className="contact-page">

      <div className="contact-wrapper">

        {/* LEFT */}
        <div className="contact-left">
          <div className="contact-company-info">
            <h2>{f.company}</h2>
            <p>{f.license}</p>
            <p><strong>{t.lang === "en" ? "Address:" : "Địa chỉ:"}</strong> {f.address}</p>
            <div className="contact-row">
              <span className="contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                </svg>
              </span>
              (+84) 999 222 333
            </div>
            <div className="contact-row">
              <span className="contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              contact.vietnam@europets.biz
            </div>
          </div>

          <div className="contact-img-wrap">
            {image
              ? <img src={image} alt="Europets pets" className="contact-pet-img" />
              : <div className="contact-pet-placeholder"></div>
            }
            <span className="contact-deco deco-paw-1"></span>
            <span className="contact-deco deco-paw-2"></span>
            <span className="contact-deco deco-bone"></span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="contact-right">
          <h2>{c.title}</h2>

          {sent && (
            <div className="contact-success">✅ {c.success}</div>
          )}

          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <div className="form-field">
                <input name="name" placeholder={c.name}
                  value={form.name} onChange={handle} required />
              </div>
              <div className="form-field">
                <input name="phone" placeholder={c.phone}
                  value={form.phone} onChange={handle} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <input name="address" placeholder={c.address}
                  value={form.address} onChange={handle} />
              </div>
              <div className="form-field">
                <input name="email" type="email" placeholder={c.email}
                  value={form.email} onChange={handle} required />
              </div>
            </div>
            <div className="form-field">
              <input name="subject" placeholder={c.subject}
                value={form.subject} onChange={handle} />
            </div>
            <div className="form-field">
              <textarea name="message" placeholder={c.message} rows={5}
                value={form.message} onChange={handle} required />
            </div>
            <button type="submit" className="contact-submit-btn" disabled={sending}>
              {sending ? c.sending : c.send}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-wave">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--primary-dark)"/>
        </svg>
      </div>

    </div>
  );
}

export default ContactPage;
