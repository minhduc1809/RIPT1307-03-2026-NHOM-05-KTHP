import { Button, Col, Layout, Row } from 'antd';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import styles from './index.less';

const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <HelmetProvider>
        <Helmet>
          <title>FlowState - Xây dựng biểu mẫu và Tự động hóa</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
        </Helmet>
      </HelmetProvider>

      {/* Top Navigation Shell */}
      <Header className={styles.homeHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>FlowForm</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button type="text" style={{ fontWeight: 500 }} onClick={() => {
              window.location.href = '/user/login';
            }}>
              Log In
            </Button>
            <Button
              type="primary"
              size="large"
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #565e74 0%, #4a5268 100%)',
                border: 'none',
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </Header>

      <Content>
        {/* Hero Section */}
        <section className={styles.homeHero}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(218, 226, 253, 0.3)', color: '#4a5167', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '24px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>bolt</span>
                Mới: Trình kéo thả tự động hóa v2.0
              </div>
              <h1 className={styles.heroTitle}>
                Xây dựng biểu mẫu và <span className={styles.textGradient}>Tự động hóa</span> quy trình không cần Code
              </h1>
              <p className={styles.heroSubtitle}>
                Tạo các biểu mẫu động, thu thập dữ liệu và quản lý quy trình phê duyệt một cách dễ dàng. Giải phóng doanh nghiệp khỏi những thủ tục giấy tờ thủ công.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Button size="large" type="primary" style={{ height: '56px', padding: '0 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', background: 'linear-gradient(to right, #565e74, #4a5268)', border: 'none', boxShadow: '0px 12px 32px rgba(42, 52, 57, 0.06)' }}>
                  Bắt đầu ngay
                </Button>
                <Button size="large" style={{ height: '56px', padding: '0 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', background: '#e1e9ee', color: '#4a5167', border: 'none' }}>
                  Xem bản dùng thử
                </Button>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className={styles.heroImageWrapper}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1QDljcR9IrIkAQJDlyiRcPGDGTi_3WHSBN83Fo41UcIUOJNwJLDgtjYeWe7DXbgU8RvuuizwPViyjsVWNgkUlyTTWx7yc2i3GQ9dI5cRfhDlwirrln-TEelZMNlDedeZc5xPUHlKivpMqaZiIhQO3I1ShN7VJcahewMSK98hJUOYnpdSFJSyex0G8Pl_bqdt63qurVxrPhHgRJO4wXsKosYv9sEwdsrHV5Pf7JBd7RrCqASIWNHvBWLO4AwqvRt-0aibVHc5jOVI"
                  alt="Flow builder mock"
                />
              </div>
            </Col>
          </Row>
        </section>

        {/* Features Bento Grid */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.sectionTitle}>
              <h2>Tính năng mạnh mẽ cho doanh nghiệp</h2>
              <p>Tất cả những gì bạn cần để số hóa quy trình vận hành trong một nền tảng duy nhất.</p>
            </div>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12} lg={6}>
                <div className={styles.featureCard}>
                  <div className={`${styles.iconWrapper} ${styles.c1}`}>
                    <span className="material-symbols-outlined">dynamic_form</span>
                  </div>
                  <h3>Trình tạo biểu mẫu động</h3>
                  <p>Thiết kế biểu mẫu chuyên nghiệp chỉ với vài cú nhấp chuột, hỗ trợ logic rẽ nhánh phức tạp.</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <div className={styles.featureCard}>
                  <div className={`${styles.iconWrapper} ${styles.c2}`}>
                    <span className="material-symbols-outlined">account_tree</span>
                  </div>
                  <h3>Tự động hóa quy trình</h3>
                  <p>Thiết lập luồng phê duyệt tự động đa cấp độ, loại bỏ thời gian chờ đợi lãng phí.</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <div className={styles.featureCard}>
                  <div className={`${styles.iconWrapper} ${styles.c3}`}>
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <h3>Phê duyệt theo vai trò</h3>
                  <p>Quản lý quyền truy cập và phê duyệt chặt chẽ dựa trên cấu trúc tổ chức của bạn.</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <div className={styles.featureCard}>
                  <div className={`${styles.iconWrapper} ${styles.c4}`}>
                    <span className="material-symbols-outlined">notifications_active</span>
                  </div>
                  <h3>Thông báo thời gian thực</h3>
                  <p>Luôn cập nhật trạng thái yêu cầu ngay lập tức qua Email, Mobile hoặc Tin nhắn hệ thống.</p>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* How It Works (Timeline Pattern) */}
        <section className={styles.howItWorksSection}>
          <Row gutter={[64, 64]} align="middle">
            <Col xs={24} md={12}>
              <h2 className={styles.sectionTitle}>Quy trình đơn giản, hiệu quả vượt trội</h2>
              <div className={styles.stepItem}>
                <div className={styles.stepNumber}>1</div>
                <div>
                  <h4>Tạo biểu mẫu</h4>
                  <p>Sử dụng trình kéo thả trực quan để thiết kế giao diện nhập liệu phù hợp với nhu cầu riêng của bạn.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNumber}>2</div>
                <div>
                  <h4>Gửi dữ liệu</h4>
                  <p>Người dùng điền thông tin và gửi yêu cầu từ bất kỳ thiết bị nào, dữ liệu được bảo mật tuyệt đối.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNumber}>3</div>
                <div>
                  <h4>Phê duyệt quy trình</h4>
                  <p>Hệ thống tự động chuyển tiếp đến người có thẩm quyền để xử lý và hoàn tất quy trình ngay tức thì.</p>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={styles.visualWrapper}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3UOguVoADJRfMX5uSrBYWGjnUk2IspWxirRN-dkSgne-12C_z8PaS_Ed5wn_lkvRfs-uZAHpFdbht2dd2apPzrtHA_pjAXKppBWaB4NrOHSr6sITxKBI-N-MK-02sl5su9lAtFjm4mjo2p94A2SpNKSy99bpCQJcrUr4J9u8N1vwxsVydBgmXTJZ9mbsdTw5BYqtIXpZ2-3tXjDPfi0qa3OKTHLC6N3IlxO54bTSrL1Xb4AYZGSYq5FMw62d7BGN2lPQ5L61EXO0"
                  alt="Steps visual"
                />
              </div>
            </Col>
          </Row>
        </section>

        {/* Use Cases Section */}
        <section className={styles.useCasesSection}>
          <div className={styles.useCasesContainer}>
            <div className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>Sẵn sàng cho mọi tình huống</h2>
              <p style={{ color: '#566166' }}>Triển khai nhanh chóng cho các nhu cầu quản trị doanh nghiệp phổ biến nhất.</p>
            </div>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={8}>
                <div className={styles.caseCard}>
                  <div className={styles.imgWrapper}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBErqPuFhoDpg4wV_dgDQQHWQX5L5--3i0KySy7Cp6JyUkDMl5gRvxFfRZQURaDlqBARaQZnBQ0pXBgir3Beh3omIAbgp9EXO40QdHlsMfYYZg7jyeRUGnbvzPFa8EwKZuBULOkP6J-YXL3ZOnTbevbmjQMkbQl8dZYdgsf1klCt_TOpzsXMTTgpieUHID6FNCPRm9AqC8XvHV4LnbGxPYmh1xXmSpotcpr8qt3uvHAdO6yFYsydfSYFHhps-jMG7456j6B8xC27m0"
                      alt="Use Case 1"
                    />
                  </div>
                  <div className={styles.caseHeader}>
                    <h4>Yêu cầu nghỉ phép</h4>
                    <span className="material-symbols-outlined" style={{ color: '#565e74' }}>arrow_forward</span>
                  </div>
                  <p>Tự động hóa tính toán ngày nghỉ và phê duyệt từ quản lý trực tiếp.</p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className={styles.caseCard}>
                  <div className={styles.imgWrapper}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoifrMwDNERaFVKNnrkzzLyx98l2-ciO5SWfNRG6tZadAxiNg5-ZKZmf4UDEe1Kq7rFF5OgJXHwqJfyxItUXuxdT5exIhCTuRZ0kaf4W6msraFw_lUcOWNjFD_XsDL4CkCGlhArAXU82-4ZzQoqTb3djs5aFNLpSY2oV_65gIc2v3dCJFER6KRZUvYQolf2ReNNNuavlfY0vuBjZKu1R6oQU7_dUl-Iic79SJXuARRi--Iw9Eb_UI76IQI6_0FCYvE_8Ug4IXUjeU"
                      alt="Use Case 2"
                    />
                  </div>
                  <div className={styles.caseHeader}>
                    <h4>Phê duyệt chi phí</h4>
                    <span className="material-symbols-outlined" style={{ color: '#565e74' }}>arrow_forward</span>
                  </div>
                  <p>Quản lý hóa đơn, chứng từ và theo dõi ngân sách theo thời gian thực.</p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className={styles.caseCard}>
                  <div className={styles.imgWrapper}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-a9WmCmTUXpFbXGlu_oBL1KRAJ4cg6Lt6k3aH7Pe20nUITDd9ceqv2IW69oMmoB6iimI8xX5zaqiKhttSEm5NdMHEcB91alo9BrYFGScoMF5nDr2pjSohF0M8wW_1pE5asjaBc3Zr_08vqcfOMm4wq0HrJXYbnoPt48w4d603pdQ18pGqf-3TH6eSdiLxqds72EyvnRrKlYNYKyvEbQsuyVj-9dHbSNR20oCfFavgNHCji0HNwZD0V0_V9f9Bxox1gpaU1ayX-gA"
                      alt="Use Case 3"
                    />
                  </div>
                  <div className={styles.caseHeader}>
                    <h4>Biểu mẫu nội bộ</h4>
                    <span className="material-symbols-outlined" style={{ color: '#565e74' }}>arrow_forward</span>
                  </div>
                  <p>Khảo sát nhân viên, đánh giá công việc và thu thập ý kiến đóng góp.</p>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <h2>Bắt đầu xây dựng quy trình của bạn ngay hôm nay</h2>
            <p>Tham gia cùng hơn 1,000+ doanh nghiệp đang tối ưu hóa vận hành với FlowState.</p>
            <div className={styles.ctaButtons}>
              <Button size="large" style={{ height: '56px', padding: '0 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', color: '#565e74', border: 'none' }}>
                Tạo tài khoản
              </Button>
              <Button size="large" ghost style={{ height: '56px', padding: '0 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.1)' }}>
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </section>
      </Content>

      <Footer className={styles.homeFooter}>
        <div className={styles.footerContent}>
          <div>
            <div className={styles.brand}>FlowState</div>
            <div>Giải pháp tối ưu hóa quy trình doanh nghiệp hiện đại.</div>
            <div style={{ marginTop: '16px', fontSize: '14px' }}>© 2025 FlowState Systems. All rights reserved.</div>
          </div>
          <div className={styles.links}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </Footer>
    </div>
  );
};

export default Home;
