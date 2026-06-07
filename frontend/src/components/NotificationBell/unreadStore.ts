type Listener = (count: number) => void;

let unread = 0;
const listeners = new Set<Listener>();

export function publishUnread(count: number) {
	unread = count;
	listeners.forEach((l) => l(count));
}

export function getUnread() {
	return unread;
}

export function subscribeUnread(listener: Listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
