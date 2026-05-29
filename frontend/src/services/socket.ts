import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Khởi tạo kết nối Socket.IO với backend.
 * Truyền JWT token để xác thực.
 */
export function connectSocket(): Socket {
	if (socket?.connected) return socket;

	const token = localStorage.getItem('token');
	if (!token) {
		console.warn('[Socket] No token found, cannot connect');
		return socket as any;
	}

	// Lấy base URL (bỏ /api nếu có)
	const wsUrl = (APP_CONFIG_IP_ROOT || 'http://localhost:3000').replace(/\/+$/, '');

	socket = io(wsUrl, {
		auth: { token },
		transports: ['websocket', 'polling'],
		reconnection: true,
		reconnectionAttempts: 10,
		reconnectionDelay: 2000,
	});

	socket.on('connect', () => {
		console.log('[Socket] Connected:', socket?.id);
	});

	socket.on('connected', (payload) => {
		console.log('[Socket] Authenticated:', payload);
	});

	socket.on('disconnect', (reason) => {
		console.log('[Socket] Disconnected:', reason);
	});

	socket.on('connect_error', (err) => {
		console.error('[Socket] Connection error:', err.message);
	});

	return socket;
}

/** Lấy socket instance hiện tại */
export function getSocket(): Socket | null {
	return socket;
}

/** Ngắt kết nối socket */
export function disconnectSocket() {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
}

/** Lắng nghe event từ server */
export function onSocketEvent(event: string, callback: (...args: any[]) => void) {
	if (socket) {
		socket.on(event, callback);
	}
}

/** Bỏ lắng nghe event */
export function offSocketEvent(event: string, callback?: (...args: any[]) => void) {
	if (socket) {
		if (callback) {
			socket.off(event, callback);
		} else {
			socket.off(event);
		}
	}
}
