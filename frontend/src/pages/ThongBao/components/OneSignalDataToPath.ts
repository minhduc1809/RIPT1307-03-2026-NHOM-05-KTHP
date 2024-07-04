import { ENotificationSource, mapUrlNotifSource } from '@/services/ThongBao/constant';

const OneSignalDataToPath = (notifSource?: ENotificationSource, data?: any): string => {
	if (!notifSource) return '';

	let path = mapUrlNotifSource?.[notifSource] ?? '';
	switch (notifSource) {
		case ENotificationSource.LOP_HANH_CHINH:
			// TODO: Custom here: Tùy chỉnh link (id, query)...
			break;
		default:
			path = '';
	}
	return path;
};

export default OneSignalDataToPath;
