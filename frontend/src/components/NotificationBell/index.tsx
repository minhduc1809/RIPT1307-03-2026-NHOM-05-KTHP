import {
	BellOutlined,
	CheckCircleOutlined,
	CheckOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	InfoCircleOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Badge, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import {
	getNotifications,
	getUnreadCount,
	markAsRead,
	markAllAsRead,
} from '@/services/Notifications/notificationApi';
import type { INotification } from '@/services/Notifications/notificationApi';
import { connectSocket, onSocketEvent, offSocketEvent } from '@/services/socket';
import { publishUnread, subscribeUnread } from './unreadStore';
import styles from './index.less';

const TYPE_ICON: Record<string, React.ReactNode> = {
	SUCCESS: <CheckCircleOutlined />,
	WARNING: <WarningOutlined />,
	ERROR: <CloseCircleOutlined />,
	INFO: <InfoCircleOutlined />,
};

function getTimeAgo(dateStr: string): string {
	const diff = moment().diff(moment(dateStr), 'minutes');
	if (diff < 1) return 'Vừa xong';
	if (diff < 60) return `${diff} phút trước`;
	const hours = Math.floor(diff / 60);
	if (hours < 24) return `${hours} giờ trước`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} ngày trước`;
	return moment(dateStr).format('DD/MM/YYYY');
}

function getNavigationPath(notification: INotification): string | null {
	const meta = notification.metadata;
	if (!meta) return '/notifications';

	if (meta.submissionId) return `/submissions/${meta.submissionId}`;
	if (meta.instanceId) return `/submissions/${meta.submissionId || ''}`;
	if (meta.delegationId) return '/delegations';
	return '/notifications';
}

const NotificationBell: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [loading, setLoading] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const fetchUnread = useCallback(async () => {
		if (!localStorage.getItem('token')) return;
		try {
			const res = await getUnreadCount();
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			const count = data?.count ?? data?.unread ?? data;
			setUnreadCount(typeof count === 'number' ? count : 0);
		} catch { /* */ }
	}, []);

	const fetchNotifications = useCallback(async () => {
		if (!localStorage.getItem('token')) return;
		setLoading(true);
		try {
			const res = await getNotifications({ page: 1, limit: 10 });
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			setNotifications(data?.items ?? []);
		} catch { /* */ }
		finally { setLoading(false); }
	}, []);

	useEffect(() => {
		fetchUnread();
	}, [fetchUnread]);

	useEffect(() => subscribeUnread(setUnreadCount), []);
	useEffect(() => {
		publishUnread(unreadCount);
	}, [unreadCount]);

	useEffect(() => {
		connectSocket();
		const handleNew = () => {
			fetchUnread();
			if (open) fetchNotifications();
		};
		onSocketEvent('notification', handleNew);
		return () => { offSocketEvent('notification', handleNew); };
	}, [fetchUnread, fetchNotifications, open]);

	useEffect(() => {
		if (!open) return;
		const handleClick = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [open]);

	const handleToggle = () => {
		const next = !open;
		setOpen(next);
		if (next) fetchNotifications();
	};

	const handleMarkRead = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		await markAsRead(id);
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
		setUnreadCount((c) => Math.max(0, c - 1));
	};

	const handleMarkAllRead = async () => {
		await markAllAsRead();
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		setUnreadCount(0);
	};

	const handleClickNotification = async (notification: INotification) => {
		if (!notification.read) {
			await markAsRead(notification.id);
			setUnreadCount((c) => Math.max(0, c - 1));
		}
		setOpen(false);
		const path = getNavigationPath(notification);
		if (path) history.push(path);
	};

	return (
		<div className={styles.bellWrapper} ref={dropdownRef}>
			<button className={styles.bellButton} onClick={handleToggle}>
				<Badge count={unreadCount} size="small" offset={[-2, 2]}>
					<BellOutlined className={styles.bellIcon} />
				</Badge>
			</button>

			{open && (
				<div className={styles.dropdown}>
					<div className={styles.dropdownHeader}>
						<span className={styles.headerTitle}>Thông báo</span>
						{unreadCount > 0 && (
							<button className={styles.markAllBtn} onClick={handleMarkAllRead}>
								<CheckOutlined /> Đọc tất cả
							</button>
						)}
					</div>

					<div className={styles.dropdownBody}>
						{loading ? (
							<div className={styles.loadingState}><Spin size="small" /></div>
						) : notifications.length === 0 ? (
							<div className={styles.emptyState}>
								<div className={styles.emptyIcon}>
									<BellOutlined />
								</div>
								<div className={styles.emptyTitle}>Chưa có thông báo</div>
								<p className={styles.emptySub}>Thông báo mới sẽ xuất hiện tại đây</p>
							</div>
						) : (
							notifications.map((n) => (
								<div
									key={n.id}
									className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}
									onClick={() => handleClickNotification(n)}
								>
									<div className={`${styles.notifIcon} ${styles[`type${(n.type || 'INFO').toUpperCase()}`] || styles.typeINFO}`}>
										{TYPE_ICON[(n.type || 'INFO').toUpperCase()] || TYPE_ICON.INFO}
									</div>
									<div className={styles.notifContent}>
										<div className={styles.notifTitle}>{n.title}</div>
										<div className={styles.notifMessage}>{(n as any).content || n.message}</div>
										<div className={styles.notifTime}>
											<ClockCircleOutlined /> {getTimeAgo(n.createdAt)}
										</div>
									</div>
									{!n.read && (
										<button
											type='button'
											className={styles.unreadDot}
											onClick={(e) => handleMarkRead(n.id, e)}
											title='Đánh dấu đã đọc'
										/>
									)}
								</div>
							))
						)}
					</div>

					<button
						type='button'
						className={styles.dropdownFooter}
						onClick={() => {
							setOpen(false);
							history.push('/notifications');
						}}
					>
						Xem tất cả thông báo
					</button>
				</div>
			)}
		</div>
	);
};

export default NotificationBell;
