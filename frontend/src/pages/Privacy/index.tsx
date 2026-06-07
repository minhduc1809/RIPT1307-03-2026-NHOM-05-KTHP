// design: smartadmin.pen · frame 25
import { CheckOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import homeStyles from '../Home/index.less';
import { PageHero, PublicFooter, PublicHead, PublicNavbar, Reveal } from '../Home/PublicShell';
import styles from './index.less';

const SECTIONS = [
	{ id: 'sec-1', title: '1. Thông tin chúng tôi thu thập' },
	{ id: 'sec-2', title: '2. Cách chúng tôi sử dụng dữ liệu' },
	{ id: 'sec-3', title: '3. Lưu trữ & bảo mật' },
	{ id: 'sec-4', title: '4. Quyền của bạn' },
];

const BULLETS = [
	'Thông tin định danh: họ tên, email tổ chức, vai trò trong hệ thống (qua Keycloak SSO).',
	'Dữ liệu nghiệp vụ: nội dung biểu mẫu, tệp đính kèm, bình luận phê duyệt, lịch sử quy trình.',
	'Dữ liệu kỹ thuật: địa chỉ IP, loại thiết bị, nhật ký truy cập phục vụ kiểm toán bảo mật.',
];

/** Scrollspy: trả về id của section đang nằm trong viewport. */
const useScrollSpy = (ids: string[]) => {
	const [activeId, setActiveId] = useState(ids[0]);

	useEffect(() => {
		if (typeof IntersectionObserver === 'undefined') return undefined;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) setActiveId(entry.target.id);
				});
			},
			{ rootMargin: '-30% 0px -55% 0px' },
		);
		ids.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	}, [ids]);

	return activeId;
};

const scrollTo = (id: string) => {
	document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Privacy: React.FC = () => {
	const activeId = useScrollSpy(SECTIONS.map((s) => s.id));

	return (
		<div className={homeStyles.homeContainer}>
			<PublicHead title="Chính sách bảo mật — FlowForm" />
			<PublicNavbar />

			<PageHero label="PHÁP LÝ" title="Chính sách bảo mật" sub="Cập nhật lần cuối: 01/06/2026 · Phiên bản 2.1" />

			<div className={styles.legalBody}>
				{/* Table of contents */}
				<nav className={styles.toc}>
					<span className={styles.tocTitle}>MỤC LỤC</span>
					{SECTIONS.map((s) => (
						<div
							key={s.id}
							className={`${styles.tocItem} ${activeId === s.id ? styles.active : ''}`}
							onClick={() => scrollTo(s.id)}
						>
							{s.title}
						</div>
					))}
				</nav>

				{/* Article */}
				<div className={styles.article}>
					<Reveal>
						<section id="sec-1" className={styles.legalSection}>
							<h2>1. Thông tin chúng tôi thu thập</h2>
							<p>
								Khi bạn sử dụng FlowForm, chúng tôi thu thập thông tin tài khoản (họ tên, email, vai trò), dữ liệu biểu
								mẫu bạn tạo hoặc nộp, lịch sử phê duyệt và nhật ký hệ thống (địa chỉ IP, thiết bị, thời gian truy cập)
								nhằm phục vụ vận hành nền tảng.
							</p>
							{BULLETS.map((b) => (
								<div key={b} className={styles.bullet}>
									<CheckOutlined className={styles.bulletIcon} />
									<span>{b}</span>
								</div>
							))}
						</section>
					</Reveal>

					<Reveal>
						<section id="sec-2" className={styles.legalSection}>
							<h2>2. Cách chúng tôi sử dụng dữ liệu</h2>
							<p>
								Dữ liệu được dùng để vận hành quy trình phê duyệt, gửi thông báo thời gian thực, lập báo cáo tuân thủ
								SLA và cải thiện trải nghiệm sản phẩm. Chúng tôi không bán hoặc chia sẻ dữ liệu của bạn cho bên thứ ba
								vì mục đích quảng cáo.
							</p>
						</section>
					</Reveal>

					<Reveal>
						<section id="sec-3" className={styles.legalSection}>
							<h2>3. Lưu trữ &amp; bảo mật</h2>
							<p>
								Dữ liệu được mã hóa khi truyền (TLS 1.3) và khi lưu trữ (AES-256), đặt tại trung tâm dữ liệu trong lãnh
								thổ Việt Nam. Mọi thao tác CREATE / UPDATE / DELETE / APPROVE / REJECT đều được ghi vào nhật ký kiểm
								toán (AuditLog) kèm địa chỉ IP.
							</p>
							<div className={styles.noteBox}>
								<SafetyCertificateOutlined className={styles.noteIcon} />
								<span>
									FlowForm đạt chứng nhận ISO 27001 và tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
								</span>
							</div>
						</section>
					</Reveal>

					<Reveal>
						<section id="sec-4" className={styles.legalSection}>
							<h2>4. Quyền của bạn</h2>
							<p>
								Bạn có quyền truy cập, chỉnh sửa, xuất hoặc yêu cầu xóa dữ liệu cá nhân bất kỳ lúc nào qua trang Hồ sơ
								cá nhân hoặc liên hệ support@flowform.vn. Yêu cầu xóa được xử lý trong tối đa 30 ngày.
							</p>
						</section>
					</Reveal>
				</div>
			</div>

			<PublicFooter />
		</div>
	);
};

export default Privacy;
