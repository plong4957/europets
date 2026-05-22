import "../../styles/customer/about.css";

function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>Về EuroPets</h1>
        <p>Chúng tôi chuyên nhập khẩu thú cưng thuần chủng từ châu Âu</p>
      </section>
      <section className="about-content section">
        <div className="about-grid">
          <div className="about-card">
            <span>🐶</span>
            <h3>Thuần chủng 100%</h3>
            <p>Tất cả thú cưng đều có giấy tờ chứng nhận nguồn gốc rõ ràng.</p>
          </div>
          <div className="about-card">
            <span>🏥</span>
            <h3>Sức khỏe đảm bảo</h3>
            <p>Kiểm tra sức khỏe đầy đủ, tiêm phòng trước khi giao.</p>
          </div>
          <div className="about-card">
            <span>🚚</span>
            <h3>Giao hàng toàn quốc</h3>
            <p>Hỗ trợ vận chuyển an toàn đến tận nơi cho khách hàng.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;