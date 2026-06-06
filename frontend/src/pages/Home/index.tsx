// design: smartadmin.pen · frame 23
import {
	AccountBookOutlined,
	ArrowRightOutlined,
	BellOutlined,
	BranchesOutlined,
	CalendarOutlined,
	CaretRightFilled,
	CheckCircleFilled,
	CheckOutlined,
	ClockCircleOutlined,
	CloseOutlined,
	FileTextOutlined,
	FolderOpenOutlined,
	LayoutOutlined,
	SafetyCertificateOutlined,
	ThunderboltFilled,
} from '@ant-design/icons';
import React from 'react';
import { history } from 'umi';
import styles from './index.less';
import { goRegisterTenant, PublicFooter, PublicHead, PublicNavbar, Reveal } from './PublicShell';

const FEATURES = [
	{
		icon: <LayoutOutlined />,
		color: 'indigo',
		title: 'Trình tạo biểu mẫu động',
		desc: 'Kéo thả văn bản, số, ngày, lựa chọn — kèm ràng buộc kiểm tra dữ liệu, chủ đề giao diện và lưu nháp tự động.',
	},
	{
		icon: <BranchesOutlined />,
		color: 'violet',
		title: 'Tự động hóa quy trình',
		desc: 'Thiết kế luồng phê duyệt tuần tự, song song hoặc bỏ phiếu. Máy trạng thái đảm bảo mọi bước đều được ghi vết.',
	},
	{
		icon: <SafetyCertificateOutlined />,
		color: 'cyan',
		title: 'Phê duyệt theo vai trò',
		desc: 'Phân quyền ADMIN, MANAGER, HR, USER kết hợp ủy quyền theo thời gian — đúng người, đúng việc, đúng lúc.',
	},
	{
		icon: <BellOutlined />,
		color: 'amber',
		title: 'Thông báo thời gian thực',
		desc: 'Socket.io đẩy cập nhật tức thì tới web và mobile. Không bỏ lỡ yêu cầu nào với cảnh báo SLA quá hạn.',
	},
];

const STEPS = [
	{
		num: '1',
		title: 'Tạo biểu mẫu',
		desc: 'Kéo thả các trường dữ liệu, đặt ràng buộc kiểm tra và chọn chủ đề giao diện phù hợp.',
	},
	{
		num: '2',
		title: 'Gửi dữ liệu',
		desc: 'Nhân viên điền và nộp biểu mẫu trên mọi thiết bị, có lưu nháp và kiểm tra dữ liệu tức thì.',
	},
	{
		num: '3',
		title: 'Phê duyệt quy trình',
		desc: 'Yêu cầu tự động chạy qua các bước phê duyệt, thông báo realtime và ghi vết đầy đủ.',
	},
];

const USE_CASES = [
	{
		icon: <CalendarOutlined />,
		color: 'indigo',
		title: 'Yêu cầu nghỉ phép',
		desc: 'Nhân viên nộp đơn, quản lý và HR duyệt theo trình tự — tự động tính ngày phép còn lại.',
	},
	{
		icon: <AccountBookOutlined />,
		color: 'blue',
		title: 'Phê duyệt chi phí',
		desc: 'Đề nghị thanh toán chạy song song qua kế toán và quản lý — đối soát minh bạch từng bước.',
	},
	{
		icon: <FolderOpenOutlined />,
		color: 'teal',
		title: 'Biểu mẫu nội bộ',
		desc: 'Tuyển dụng, cấp phát thiết bị, khảo sát đào tạo — mọi nghiệp vụ trong một nền tảng.',
	},
];

const Home: React.FC = () => {
	return (
		<div className={styles.homeContainer}>
			<PublicHead title="FlowForm — Xây dựng biểu mẫu và Tự động hóa quy trình" />
			<PublicNavbar />

			{/* Hero */}
			<section className={styles.hero}>
				<div className={styles.heroInner}>
					<div className={styles.heroBlob1} />
					<div className={styles.heroBlob2} />

					<div className={styles.heroLeft}>
						<div className={`${styles.heroBadge} ${styles.animFadeUp} ${styles.d1}`}>
							<span className={styles.badgeNew}>MỚI</span>
							<span className={styles.badgeText}>Trình kéo thả tự động hóa v2.0</span>
							<ThunderboltFilled className={styles.badgeZap} />
						</div>

						<h1 className={`${styles.heroTitle} ${styles.animFadeUp} ${styles.d2}`}>
							Xây dựng biểu mẫu và
							<br />
							<span className={styles.textGradient}>Tự động hóa quy trình</span>
							<br />
							không cần Code
						</h1>

						<p className={`${styles.heroSubtitle} ${styles.animFadeUp} ${styles.d3}`}>
							FlowForm giúp tổ chức của bạn số hóa biểu mẫu, thiết kế quy trình phê duyệt đa cấp và theo dõi mọi yêu cầu
							theo thời gian thực — tất cả trong một nền tảng duy nhất.
						</p>

						<div className={`${styles.heroCtas} ${styles.animFadeUp} ${styles.d4}`}>
							<button type="button" className={`${styles.btnGradientPill} ${styles.lg}`} onClick={goRegisterTenant}>
								Bắt đầu ngay <ArrowRightOutlined />
							</button>
							<button type="button" className={styles.btnSecondaryPill}>
								<CaretRightFilled className={styles.playIcon} /> Xem bản dùng thử
							</button>
						</div>

						<div className={`${styles.heroStats} ${styles.animFadeUp} ${styles.d5}`}>
							<div>
								<div className={styles.statValue}>1,000+</div>
								<div className={styles.statLabel}>Doanh nghiệp tin dùng</div>
							</div>
							<div>
								<div className={styles.statValue}>50k+</div>
								<div className={styles.statLabel}>Biểu mẫu được xử lý/tháng</div>
							</div>
							<div>
								<div className={styles.statValue}>99.9%</div>
								<div className={styles.statLabel}>Uptime cam kết SLA</div>
							</div>
						</div>
					</div>

					{/* Isometric dashboard mockup */}
					<div className={styles.heroMockup}>
						<div className={styles.mockupBar}>
							<span className={`${styles.dot} ${styles.r}`} />
							<span className={`${styles.dot} ${styles.y}`} />
							<span className={`${styles.dot} ${styles.g}`} />
							<div className={styles.mockupUrl}>app.flowform.vn/dashboard</div>
						</div>
						<div className={styles.mockupBody}>
							<div className={styles.mockupSidebar}>
								<div className={styles.mockupLogo}>
									<span className={styles.logoDot} />
									<span>FLOWFORM</span>
								</div>
								<div className={`${styles.menuStripe} ${styles.active}`} />
								<div className={styles.menuStripe} />
								<div className={styles.menuStripe} />
								<div className={styles.menuStripe} />
							</div>
							<div className={styles.mockupContent}>
								<div className={styles.mockupStats}>
									<div className={styles.miniStat}>
										<div className={styles.miniIcon}>
											<FileTextOutlined />
										</div>
										<div>
											<div className={styles.miniValue}>1,284</div>
											<div className={styles.miniLabel}>Tổng lượt nộp</div>
										</div>
									</div>
									<div className={styles.miniStat}>
										<div className={`${styles.miniIcon} ${styles.green}`}>
											<CheckCircleFilled />
										</div>
										<div>
											<div className={styles.miniValue}>876</div>
											<div className={styles.miniLabel}>Đã phê duyệt</div>
										</div>
									</div>
								</div>
								<div className={styles.mockupChart}>
									<div className={styles.bar} style={{ height: 50 }} />
									<div className={`${styles.bar} ${styles.b2}`} style={{ height: 78 }} />
									<div className={styles.bar} style={{ height: 62 }} />
									<div className={`${styles.bar} ${styles.hl}`} style={{ height: 96 }} />
								</div>
							</div>
						</div>
					</div>

					{/* Floating notification toast */}
					<div className={styles.floatToast}>
						<div className={styles.toastIcon}>
							<CheckCircleFilled />
						</div>
						<div style={{ flex: 1 }}>
							<div className={styles.toastTitle}>Yêu cầu đã được phê duyệt</div>
							<div className={styles.toastMsg}>Đơn xin nghỉ phép của bạn đã được Quản lý phê duyệt.</div>
							<div className={styles.toastTime}>
								<ClockCircleOutlined /> Vừa xong
							</div>
						</div>
						<CloseOutlined className={styles.toastClose} />
					</div>

					{/* Floating approved chip */}
					<div className={styles.floatApproved}>
						<div className={styles.approvedIcon}>
							<CheckOutlined />
						</div>
						<div>
							<div className={styles.approvedTitle}>Đã phê duyệt</div>
							<div className={styles.approvedSub}>Đơn #0142 · vừa xong</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features (bento 2×2) */}
			<section id="features" className={styles.section}>
				<div className={styles.sectionInner}>
					<Reveal>
						<div className={styles.sectionHead}>
							<span className={styles.sectionLabel}>TÍNH NĂNG NỔI BẬT</span>
							<h2>Mọi thứ bạn cần để vận hành quy trình</h2>
							<p>Từ biểu mẫu đầu tiên đến quy trình phê duyệt phức tạp — không cần viết một dòng code.</p>
						</div>
					</Reveal>
					<Reveal stagger className={styles.bentoGrid}>
						{FEATURES.map((f) => (
							<div key={f.title} className={styles.featureCard}>
								<div className={`${styles.featureIcon} ${styles[f.color]}`}>{f.icon}</div>
								<h3>{f.title}</h3>
								<p>{f.desc}</p>
								<a className={styles.featureLink}>
									Tìm hiểu thêm <ArrowRightOutlined />
								</a>
							</div>
						))}
					</Reveal>
				</div>
			</section>

			{/* How it works */}
			<section id="how-it-works" className={`${styles.section} ${styles.bgSlate}`}>
				<div className={styles.sectionInner}>
					<Reveal>
						<div className={styles.sectionHead}>
							<span className={styles.sectionLabel}>QUY TRÌNH 3 BƯỚC</span>
							<h2>Bắt đầu chỉ trong vài phút</h2>
						</div>
					</Reveal>
					<Reveal stagger className={styles.stepsRow}>
						{STEPS.map((s, i) => (
							<React.Fragment key={s.num}>
								{i > 0 && (
									<div className={styles.stepArrow}>
										<ArrowRightOutlined />
									</div>
								)}
								<div className={styles.stepItem}>
									<div className={styles.stepNumber}>{s.num}</div>
									<h4>{s.title}</h4>
									<p>{s.desc}</p>
								</div>
							</React.Fragment>
						))}
					</Reveal>
				</div>
			</section>

			{/* Use cases */}
			<section id="use-cases" className={styles.section}>
				<div className={styles.sectionInner}>
					<Reveal>
						<div className={styles.sectionHead}>
							<span className={styles.sectionLabel}>TÌNH HUỐNG SỬ DỤNG</span>
							<h2>Sinh ra cho mọi quy trình nội bộ</h2>
						</div>
					</Reveal>
					<Reveal stagger className={styles.useCasesRow}>
						{USE_CASES.map((u) => (
							<div key={u.title} className={styles.useCaseCard}>
								<div className={`${styles.useCaseHeader} ${styles[u.color]}`}>{u.icon}</div>
								<div className={styles.useCaseBody}>
									<h4>{u.title}</h4>
									<p>{u.desc}</p>
								</div>
							</div>
						))}
					</Reveal>
				</div>
			</section>

			{/* CTA */}
			<section id="cta" className={styles.ctaSection}>
				<Reveal className={styles.ctaBox}>
					<h2>Bắt đầu xây dựng quy trình của bạn ngay hôm nay</h2>
					<p>Tạo tenant riêng cho tổ chức của bạn trong 2 phút — bạn sẽ là Quản trị viên đầu tiên.</p>
					<div className={styles.ctaButtons}>
						<button type="button" className={styles.btnWhitePill} onClick={goRegisterTenant}>
							Đăng ký tổ chức miễn phí
						</button>
						<button type="button" className={styles.btnOutlinePill} onClick={() => history.push('/contact')}>
							Liên hệ tư vấn
						</button>
					</div>
				</Reveal>
			</section>

			<PublicFooter />
		</div>
	);
};

export default Home;
