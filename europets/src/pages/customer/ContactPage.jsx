import "../../styles/customer/contact.css";

function ContactPage() {
  return (
    <div className="contact-page section">
      <h1>Liên hệ</h1>
      <div className="contact-grid">
        <div className="contact-info">
          <p>📍 TP. Hồ Chí Minh, Việt Nam</p>
          <p>📞 0900 000 000</p>
          <p>✉️ hello@europets.vn</p>
          <p>🕐 Thứ 2 – Thứ 7: 8:00 – 20:00</p>
        </div>
        <div className="contact-form">
          <input type="text" placeholder="Họ tên của bạn" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Nội dung..." rows={5} />
          <button className="btn-primary">Gửi tin nhắn</button>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;