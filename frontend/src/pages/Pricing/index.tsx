// design: smartadmin.pen · frame 27
import { CheckOutlined } from '@ant-design/icons';
import React from 'react';
import { history } from 'umi';
import homeStyles from '../Home/index.less';
import { goRegisterTenant, PageHero, PublicFooter, PublicHead, PublicNavbar, Reveal } from '../Home/PublicShell';
import styles from './index.less';

const TIERS = [
	{
		name: 'Starter',
		amount: '0đ',
		unit: '/tháng',
		desc: 'Cho nhóm nhỏ bắt đầu số hóa biểu mẫu.',
		features: ['5 biểu mẫu · 50 lượt nộp/tháng', 'Quy trình tuần tự cơ bản', 'Thông báo trong ứng dụng', 'Hỗ trợ qua email'],
		cta: 'Bắt đầu miễn phí',
		onClick: goRegisterTenant,
		highlight: false,
	},
	{
		name: 'Business',
		amount: '990k',
		unit: '/tháng',
		desc: 'Cho tổ chức cần quy trình phê duyệt đa cấp đầy đủ.',
		features: [
			'Không giới hạn biểu mẫu & lượt nộp',
			'Quy trình song song, bỏ phiếu, SLA',
			'Ủy quyền, audit log, xuất Excel',
			'Realtime + push notification',
		],
		cta: 'Dùng thử 14 ngày',
		onClick: goRegisterTenant,
		highlight: true,
	},
	{
		name: 'Enterprise',
		amount: 'Liên hệ',
		unit: '',
		desc: 'Triển khai riêng cho tập đoàn & khối nhà nước.',
		features: ['Mọi tính năng của Business', 'SSO Keycloak riêng, multi-tenant', 'On-premise / private cloud', 'SLA 99.9% · hỗ trợ 24/7'],
		cta: 'Liên hệ tư vấn',
		onClick: () => history.push('/contact'),
		highlight: false,
	},
];

const Pricing: React.FC = () => (
	<div className={homeStyles.homeContainer}>
		<PublicHead title="Bảng giá — FlowForm" />
		<PublicNavbar />

		<PageHero
			label="BẢNG GIÁ"
			title="Minh bạch, linh hoạt theo quy mô"
			sub="Dùng thử miễn phí 14 ngày — không cần thẻ tín dụng."
		/>

		<Reveal stagger className={styles.tiers}>
			{TIERS.map((t) => (
				<div key={t.name} className={`${styles.tierCard} ${t.highlight ? styles.highlight : ''}`}>
					{t.highlight && <span className={styles.tierBadge}>PHỔ BIẾN NHẤT</span>}
					<span className={styles.tierName}>{t.name}</span>
					<div className={styles.tierPrice}>
						<span className={`${styles.amount} ${t.unit ? '' : styles.contact}`}>{t.amount}</span>
						{t.unit && <span className={styles.unit}>{t.unit}</span>}
					</div>
					<p className={styles.tierDesc}>{t.desc}</p>
					<div className={styles.divider} />
					{t.features.map((f) => (
						<div key={f} className={styles.tierFeature}>
							<CheckOutlined /> {f}
						</div>
					))}
					<button
						type="button"
						className={`${styles.tierBtn} ${t.highlight ? styles.gradient : ''}`}
						onClick={t.onClick}
					>
						{t.cta}
					</button>
				</div>
			))}
		</Reveal>

		<PublicFooter />
	</div>
);

export default Pricing;
