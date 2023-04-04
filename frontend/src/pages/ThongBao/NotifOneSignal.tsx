import { readOneNotification } from '@/services/ThongBao/thongbao';
import queryString from 'query-string';
import { history, useAccess } from 'umi';
import { OneSignalDataToPath } from './components/ViewThongBao';

const NotifOneSignal = () => {
  const access = useAccess();
  const parsed = queryString.parse(window.location.search);
  readOneNotification({ notificationId: parsed?.id });

  const path = OneSignalDataToPath(parsed, access.sinhVien, access.nhanVien);
  history.push(path || '/');
  return <></>;
};

export default NotifOneSignal;
