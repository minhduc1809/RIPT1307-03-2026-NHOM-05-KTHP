// design: smartadmin.pen · frame 26
import { CheckOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import homeStyles from '../Home/index.less';
import { PageHero, PublicFooter, PublicHead, PublicNavbar, Reveal } from '../Home/PublicShell';
import styles from '../Privacy/index.less';

const SECTIONS = [
	{ id: 'sec-1', title: '1. Chấp nhận điều khoản' },
	{ id: 'sec-2', title: '2. Tài khoản & trách nhiệm' },
	{ id: 'sec-3', title: '3. Quyền sở hữu dữ liệu' },
	{ id: 'sec-4', title: '4. Giới hạn trách nhiệm' },
];

const BULLETS = [
	'Bạn phải đủ 18 tuổi hoặc có sự đồng ý của tổ chức chủ quản để sử dụng dịch vụ.',
	'Chúng tôi có thể cập nhật điều khoản và sẽ thông báo trước tối thiểu 30 ngày qua email.',
	'Việc tiếp tục sử dụng sau khi điều khoản cập nhật đồng nghĩa với việc bạn chấp nhận thay đổi.',
];

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

const Terms: React.FC = () => {
	const activeId = useScrollSpy(SECTIONS.map((s) => s.id));

	return (
		<div className={homeStyles.homeContainer}>
			<PublicHead title="Điều khoản sử dụng — FlowForm" />
			<PublicNavbar />

			<PageHero label="PHÁP LÝ" title="Điều khoản sử dụng" sub="Hiệu lực từ: 01/06/2026 · Phiên bản 3.0" />

			<div className={styles.legalBody}>
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

				<div className={styles.article}>
					<Reveal>
						<section id="sec-1" className={styles.legalSection}>
							<h2>1. Chấp nhận điều khoản</h2>
							<p>
								Bằng việc tạo tài khoản hoặc sử dụng FlowForm, bạn xác nhận đã đọc, hiểu và đồng ý chịu ràng buộc bởi
								các điều khoản này cùng Chính sách bảo mật. Nếu sử dụng thay mặt tổ chức, bạn cam kết có đủ thẩm quyền
								đại diện cho tổ chức đó.
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
							<h2>2. Tài khoản &amp; trách nhiệm người dùng</h2>
							<p>
								Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình.
								Nghiêm cấm sử dụng nền tảng để lưu trữ nội dung vi phạm pháp luật, phát tán mã độc hoặc truy cập trái
								phép dữ liệu của tổ chức khác.
							</p>
						</section>
					</Reveal>

					<Reveal>
						<section id="sec-3" className={styles.legalSection}>
							<h2>3. Quyền sở hữu dữ liệu</h2>
							<p>
								Tổ chức của bạn giữ toàn quyền sở hữu với mọi biểu mẫu, dữ liệu nộp và quy trình được tạo trên FlowForm.
								Chúng tôi chỉ xử lý dữ liệu theo ủy quyền của tổ chức và cung cấp công cụ xuất dữ liệu đầy đủ khi chấm
								dứt hợp đồng.
							</p>
							<div className={styles.noteBox}>
								<SafetyCertificateOutlined className={styles.noteIcon} />
								<span>Khi chấm dứt dịch vụ, dữ liệu được bàn giao trong 30 ngày và xóa vĩnh viễn sau 90 ngày.</span>
							</div>
						</section>
					</Reveal>

					<Reveal>
						<section id="sec-4" className={styles.legalSection}>
							<h2>4. Giới hạn trách nhiệm</h2>
							<p>
								FlowForm cam kết SLA uptime 99.9%. Trong mọi trường hợp, trách nhiệm bồi thường tối đa không vượt quá
								tổng phí dịch vụ tổ chức đã thanh toán trong 12 tháng gần nhất. Chúng tôi không chịu trách nhiệm với
								thiệt hại gián tiếp phát sinh từ việc gián đoạn dịch vụ do bất khả kháng.
							</p>
						</section>
					</Reveal>
				</div>
			</div>

			<PublicFooter />
		</div>
	);
};

export default Terms;
