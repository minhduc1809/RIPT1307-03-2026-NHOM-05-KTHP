// design: smartadmin.pen · frame 29
import {
	AlertOutlined,
	AuditOutlined,
	BlockOutlined,
	CloudServerOutlined,
	FileProtectOutlined,
	LineChartOutlined,
	LockOutlined,
	SafetyCertificateOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import React from 'react';
import homeStyles from '../Home/index.less';
import { PageHero, PublicFooter, PublicHead, PublicNavbar, Reveal } from '../Home/PublicShell';
import styles from './index.less';

const TRUST_BADGES = [
	{ icon: <SafetyCertificateOutlined />, label: 'ISO/IEC 27001:2022' },
	{ icon: <FileProtectOutlined />, label: 'Nghị định 13/2023/NĐ-CP' },
	{ icon: <LineChartOutlined />, label: 'SLA Uptime 99.9%' },
];

const SEC_CARDS = [
	{
		icon: <LockOutlined />,
		color: 'indigo',
		title: 'Mã hóa đầu cuối',
		desc: 'TLS 1.3 khi truyền và AES-256 khi lưu trữ. Khóa được luân chuyển định kỳ theo chuẩn ngành.',
	},
	{
		icon: <BlockOutlined />,
		color: 'violet',
		title: 'Tách biệt multi-tenant',
		desc: 'Mỗi tổ chức là một tenant độc lập theo x-tenant-id — dữ liệu được cô lập ở tầng truy vấn (Prisma scope).',
	},
	{
		icon: <TeamOutlined />,
		color: 'cyan',
		title: 'Phân quyền RBAC + Ủy quyền',
		desc: '4 vai trò ADMIN / MANAGER / HR / USER, kiểm tra ở mọi endpoint. Ủy quyền có thời hạn, thu hồi tức thì.',
	},
	{
		icon: <AuditOutlined />,
		color: 'amber',
		title: 'Nhật ký kiểm toán đầy đủ',
		desc: 'Mọi thao tác CREATE / UPDATE / DELETE / APPROVE / REJECT đều ghi AuditLog kèm IP, giá trị cũ và mới.',
	},
	{
		icon: <CloudServerOutlined />,
		color: 'green',
		title: 'Sao lưu & khôi phục',
		desc: 'Backup tự động hằng ngày, lưu 30 ngày. RPO 24 giờ, RTO 4 giờ với quy trình khôi phục đã kiểm thử.',
	},
	{
		icon: <AlertOutlined />,
		color: 'red',
		title: 'Ứng phó sự cố 24/7',
		desc: 'Quy trình ứng phó sự cố chuẩn hóa, thông báo trong 72 giờ theo quy định bảo vệ dữ liệu cá nhân.',
	},
];

const Security: React.FC = () => (
	<div className={homeStyles.homeContainer}>
		<PublicHead title="Bảo mật — FlowForm" />
		<PublicNavbar />

		<PageHero
			label="BẢO MẬT"
			title="An toàn dữ liệu là ưu tiên số một"
			sub="Kiến trúc multi-tenant tách biệt, mã hóa đầu cuối và kiểm toán đầy đủ cho mọi thao tác."
		/>

		<div className={styles.trustBadges}>
			{TRUST_BADGES.map((b) => (
				<span key={b.label} className={styles.trustBadge}>
					{b.icon} {b.label}
				</span>
			))}
		</div>

		<Reveal stagger className={styles.secGrid}>
			{SEC_CARDS.map((c) => (
				<div key={c.title} className={styles.secCard}>
					<div className={`${styles.secIcon} ${styles[c.color]}`}>{c.icon}</div>
					<h3>{c.title}</h3>
					<p>{c.desc}</p>
				</div>
			))}
		</Reveal>

		<PublicFooter />
	</div>
);

export default Security;
