import {
	AppstoreOutlined,
	DownOutlined,
	FacebookFilled,
	LinkedinFilled,
	ThunderboltFilled,
	YoutubeFilled,
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { history, useModel } from 'umi';
import NotificationBell from '@/components/NotificationBell';
import styles from './index.less';

export const goLogin = () => history.push('/user/login');
export const goRegisterTenant = () => history.push('/user/register');

export const Brand: React.FC = () => (
	<div className={styles.brand} onClick={() => history.push('/')}>
		<div className={styles.brandSquare}>
			<ThunderboltFilled />
		</div>
		<span className={styles.brandName}>FLOWFORM</span>
	</div>
);

export const Reveal: React.FC<{ className?: string; stagger?: boolean; id?: string }> = ({
	children,
	className,
	stagger,
	id,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === 'undefined') {
			setVisible(true);
			return undefined;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const cls = [styles.reveal, stagger ? styles.stagger : '', visible ? styles.revealVisible : '', className || '']
		.filter(Boolean)
		.join(' ');

	return (
		<div ref={ref} id={id} className={cls}>
			{children}
		</div>
	);
};

export const PublicHead: React.FC<{ title: string }> = ({ title }) => (
	<HelmetProvider>
		<Helmet>
			<title>{title}</title>
			<link
				href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
				rel="stylesheet"
			/>
		</Helmet>
	</HelmetProvider>
);

export const PublicNavbar: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const currentUser: any = initialState?.currentUser;

	const displayName =
		currentUser &&
		(currentUser.name ||
			`${currentUser.family_name || currentUser.lastName || ''} ${currentUser.given_name || currentUser.firstName || ''}`.trim() ||
			currentUser.email);
	const initials = displayName
		? displayName
				.split(' ')
				.slice(-2)
				.map((w: string) => w.charAt(0).toUpperCase())
				.join('')
		: '';

	const getActionInfo = () => {
		const role = currentUser?.role;
		if (role === 'ADMIN' || role === 'MANAGER') {
			return { path: '/dashboard', label: 'Vào Dashboard' };
		}
		if (role === 'HR') {
			return { path: '/submissions/pending', label: 'Chờ phê duyệt' };
		}
		return { path: '/submissions/mine', label: 'Yêu cầu của tôi' };
	};

	const actionInfo = getActionInfo();

	return (
		<header className={styles.navbar}>
			<div className={styles.navInner}>
				<Brand />
				<nav className={styles.navMenu}>
					<a href="/#features">Tính năng</a>
					<a href="/#how-it-works">Quy trình</a>
					<a href="/#use-cases">Khách hàng</a>
					<a href="/pricing">Bảng giá</a>
				</nav>
				{currentUser ? (
					<div className={styles.navRight}>
						<NotificationBell />
						<button type="button" className={styles.btnGradientPill} onClick={() => history.push(actionInfo.path)}>
							<AppstoreOutlined /> {actionInfo.label}
						</button>
						<div className={styles.userChip} onClick={() => history.push('/profile')}>
							<span className={styles.chipAvatar}>{initials}</span>
							<span className={styles.chipName}>{displayName}</span>
							<DownOutlined className={styles.chipCaret} />
						</div>
					</div>
				) : (
					<div className={styles.navRight}>
						<span className={styles.loginLink} onClick={goLogin}>
							Đăng nhập
						</span>
						<button type="button" className={styles.btnGradientPill} onClick={goRegisterTenant}>
							Bắt đầu ngay
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

const FOOTER_COLS: { title: string; links: { label: string; href?: string }[] }[] = [
	{
		title: 'SẢN PHẨM',
		links: [{ label: 'Tính năng', href: '/#features' }, { label: 'Bảng giá', href: '/pricing' }, { label: 'Changelog' }],
	},
	{
		title: 'CÔNG TY',
		links: [{ label: 'Về chúng tôi' }, { label: 'Tuyển dụng' }, { label: 'Liên hệ', href: '/contact' }],
	},
	{
		title: 'PHÁP LÝ',
		links: [
			{ label: 'Chính sách bảo mật', href: '/privacy' },
			{ label: 'Điều khoản sử dụng', href: '/terms' },
			{ label: 'Bảo mật dữ liệu', href: '/security' },
		],
	},
];

export const PublicFooter: React.FC = () => (
	<footer className={styles.footer}>
		<div className={styles.footerTop}>
			<div className={styles.footerBrand}>
				<Brand />
				<div className={styles.footerDesc}>
					Nền tảng quản lý biểu mẫu và tự động hóa quy trình phê duyệt cho tổ chức Việt Nam.
				</div>
				<div className={styles.footerSocials}>
					<a aria-label="Facebook">
						<FacebookFilled />
					</a>
					<a aria-label="LinkedIn">
						<LinkedinFilled />
					</a>
					<a aria-label="YouTube">
						<YoutubeFilled />
					</a>
				</div>
			</div>
			{FOOTER_COLS.map((col) => (
				<div key={col.title} className={styles.footerCol}>
					<span className={styles.footerColTitle}>{col.title}</span>
					{col.links.map((l) => (
						<a key={l.label} href={l.href}>
							{l.label}
						</a>
					))}
				</div>
			))}
		</div>
		<div className={styles.footerBottom}>
			<div className={styles.footerBottomInner}>
				<span className={styles.copyright}>© 2026 FlowState Systems. All rights reserved.</span>
				<div className={styles.legalLinks}>
					<a href="/privacy">Privacy Policy</a>
					<a href="/terms">Terms</a>
					<a href="/security">Security</a>
					<a href="/contact">Contact</a>
				</div>
			</div>
		</div>
	</footer>
);

export const PageHero: React.FC<{ label: string; title: string; sub?: string }> = ({ label, title, sub }) => (
	<div className={styles.pageHero}>
		<span className={styles.pageHeroLabel}>{label}</span>
		<h1>{title}</h1>
		{sub && <p>{sub}</p>}
	</div>
);
