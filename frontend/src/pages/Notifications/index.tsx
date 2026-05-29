import {
	BellOutlined,
	CheckCircleOutlined,
	CheckOutlined,
	ClockCircleOutlined,
	CloseOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { message, Pagination, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	getNotifications,
	getUnreadCount,
	markAllAsRead,
	markAsRead,
} from '@/services/Notifications/notificationApi';
import type { INotification } from '@/services/Notifications/notificationApi';
import { connectSocket, disconnectSocket, offSocketEvent, onSocketEvent } from '@/services/socket';
import styles from './index.less';

type FilterType = 'all' | 'unread' | 'read';

const Notifications: React.FC = () => {
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(20);
	const [filter, setFilter] = useState<FilterType>('all');
	const [unreadCount, setUnreadCount] = useState(0);

	// Socket state
	const [socketStatus, setSocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>(
		'disconnected',
	);

	// Toast state
	const [toast, setToast] = useState<INotification | null>(null);
	const toastTimer = useRef<any>(null);

	// ==================== FETCH DATA ====================
	const fetchNotifications = useCallback(async () => {
		setLoading(true);
		try {
			const params: any = { page, limit };
			if (filter === 'unread') params.read = 'false';
			if (filter === 'read') params.read = 'true';

			const response = await getNotifications(params);
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setNotifications(data?.items ?? (Array.isArray(data) ? data : []));
			setTotal(data?.meta?.total ?? data?.total ?? 0);
		} catch (err) {
			console.error('Failed to load notifications:', err);
		} finally {
			setLoading(false);
		}
	}, [page, limit, filter]);

	const fetchUnreadCount = useCallback(async () => {
		try {
			const response = await getUnreadCount();
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setUnreadCount(data?.count ?? data ?? 0);
		} catch {
			// silent
		}
	}, []);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	useEffect(() => {
		fetchUnreadCount();
	}, [fetchUnreadCount]);

	// ==================== SOCKET.IO ====================
	useEffect(() => {
		setSocketStatus('connecting');
		const socket = connectSocket();

		if (!socket) {
			setSocketStatus('disconnected');
			return;
		}

		const onConnect = () => setSocketStatus('connected');
		const onDisconnect = () => setSocketStatus('disconnected');
		const onConnectError = () => setSocketStatus('disconnected');

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('connect_error', onConnectError);

		if (socket.connected) setSocketStatus('connected');

		// Listen for new notifications
		const handleNewNotification = (payload: any) => {
			console.log('[Notification] New:', payload);

			// Add to top of list
			const newNotif: INotification = {
				id: payload.id || Date.now().toString(),
				userId: payload.userId || '',
				title: payload.title || 'Thông báo mới',
				message: payload.message || '',
				type: payload.type,
				metadata: payload.metadata,
				read: false,
				createdAt: payload.createdAt || new Date().toISOString(),
				updatedAt: payload.updatedAt || new Date().toISOString(),
			};

			setNotifications((prev) => [newNotif, ...prev]);
			setUnreadCount((prev) => prev + 1);
			setTotal((prev) => prev + 1);

			// Show toast
			setToast(newNotif);
			if (toastTimer.current) clearTimeout(toastTimer.current);
			toastTimer.current = setTimeout(() => setToast(null), 5000);
		};

		onSocketEvent('notification.new', handleNewNotification);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('connect_error', onConnectError);
			offSocketEvent('notification.new', handleNewNotification);
		};
	}, []);

	// ==================== ACTIONS ====================
	const handleMarkAsRead = async (notif: INotification) => {
		if (notif.read) return;
		try {
			await markAsRead(notif.id);
			setNotifications((prev) =>
				prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
			);
			setUnreadCount((prev) => Math.max(0, prev - 1));
		} catch {
			// silent
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			await markAllAsRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
			setUnreadCount(0);
			message.success('Đã đánh dấu tất cả là đã đọc');
		} catch {
			message.error('Không thể đánh dấu');
		}
	};

	const handleFilterChange = (f: FilterType) => {
		setFilter(f);
		setPage(1);
	};

	// ==================== HELPERS ====================
	const getTypeIconClass = (type?: string) => {
		switch (type) {
			case 'success':
				return styles.typeSuccess;
			case 'warning':
				return styles.typeWarning;
			case 'error':
				return styles.typeError;
			default:
				return styles.typeInfo;
		}
	};

	const getTypeIcon = (type?: string) => {
		switch (type) {
			case 'success':
				return <CheckCircleOutlined />;
			case 'warning':
				return <WarningOutlined />;
			case 'error':
				return <ExclamationCircleOutlined />;
			default:
				return <BellOutlined />;
		}
	};

	const formatTime = (date: string) => {
		const m = moment(date);
		const now = moment();
		if (now.diff(m, 'minutes') < 1) return 'Vừa xong';
		if (now.diff(m, 'hours') < 1) return `${now.diff(m, 'minutes')} phút trước`;
		if (now.diff(m, 'hours') < 24) return `${now.diff(m, 'hours')} giờ trước`;
		if (now.diff(m, 'days') < 7) return `${now.diff(m, 'days')} ngày trước`;
		return m.format('DD/MM/YYYY HH:mm');
	};

	return (
		<div className={styles.notifPage}>
			{/* Header */}
			<div className={styles.pageHeader}>
				<div className={styles.headerLeft}>
					<h1>Thông báo</h1>
					<p>Quản lý các thông báo và cập nhật realtime</p>
				</div>
				<div className={styles.headerActions}>
					{unreadCount > 0 && (
						<button className={styles.markAllBtn} onClick={handleMarkAllAsRead}>
							<CheckOutlined /> Đọc tất cả ({unreadCount})
						</button>
					)}
				</div>
			</div>

			{/* Connection Status */}
			<div className={`${styles.connectionBar} ${styles[socketStatus]}`}>
				<span className={styles.statusDot} />
				{socketStatus === 'connected' && 'Realtime đang kết nối — Thông báo mới sẽ tự động hiện'}
				{socketStatus === 'connecting' && 'Đang kết nối realtime...'}
				{socketStatus === 'disconnected' && 'Mất kết nối realtime — Đang thử kết nối lại'}
			</div>

			{/* Filter Tabs */}
			<div className={styles.filterBar}>
				<button
					className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
					onClick={() => handleFilterChange('all')}
				>
					Tất cả
				</button>
				<button
					className={`${styles.filterBtn} ${filter === 'unread' ? styles.active : ''}`}
					onClick={() => handleFilterChange('unread')}
				>
					Chưa đọc
					{unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
				</button>
				<button
					className={`${styles.filterBtn} ${filter === 'read' ? styles.active : ''}`}
					onClick={() => handleFilterChange('read')}
				>
					Đã đọc
				</button>
			</div>

			{/* Notification List */}
			<div className={styles.notifList}>
				{loading ? (
					<div className={styles.loadingContainer}>
						<Spin size="large" />
					</div>
				) : notifications.length === 0 ? (
					<div className={styles.emptyState}>
						<span>🔔</span>
						<p>
							{filter === 'unread'
								? 'Không có thông báo chưa đọc'
								: 'Chưa có thông báo nào'}
						</p>
					</div>
				) : (
					<>
						{notifications.map((notif) => (
							<div
								key={notif.id}
								className={`${styles.notifItem} ${!notif.read ? styles.unread : ''}`}
								onClick={() => handleMarkAsRead(notif)}
							>
								<div
									className={`${styles.notifIcon} ${getTypeIconClass(notif.type)}`}
								>
									{getTypeIcon(notif.type)}
								</div>

								<div className={styles.notifContent}>
									<div className={styles.notifTitle}>{notif.title}</div>
									<div className={styles.notifMessage}>{notif.message}</div>
									<div className={styles.notifTime}>
										<ClockCircleOutlined />
										{formatTime(notif.createdAt)}
									</div>
								</div>

								{!notif.read && (
									<div className={styles.notifActions}>
										<button
											className={styles.readBtn}
											onClick={(e) => {
												e.stopPropagation();
												handleMarkAsRead(notif);
											}}
											title="Đánh dấu đã đọc"
										>
											<CheckOutlined />
										</button>
									</div>
								)}
							</div>
						))}

						{total > limit && (
							<div className={styles.pagination}>
								<Pagination
									current={page}
									pageSize={limit}
									total={total}
									onChange={(p) => setPage(p)}
									showTotal={(t) => `${t} thông báo`}
								/>
							</div>
						)}
					</>
				)}
			</div>

			{/* New Notification Toast */}
			{toast && (
				<div className={styles.newNotifToast}>
					<span className={styles.toastIcon}>🔔</span>
					<div className={styles.toastContent}>
						<div className={styles.toastTitle}>{toast.title}</div>
						<div className={styles.toastMsg}>{toast.message}</div>
					</div>
					<button className={styles.toastClose} onClick={() => setToast(null)}>
						<CloseOutlined />
					</button>
				</div>
			)}
		</div>
	);
};

export default Notifications;
