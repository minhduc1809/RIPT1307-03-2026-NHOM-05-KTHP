import { readNotification } from '@/services/ThongBao';
import queryString from 'query-string';
import { history } from 'umi';
import OneSignalDataToPath from './components/OneSignalDataToPath';

const NotifOneSignal = () => {
  const parsed = queryString.parse(window.location.search);
  readNotification({ notificationId: parsed?.id, type: 'ONE' });

  const path = OneSignalDataToPath(parsed);
  history.push(path || '/');
  return <></>;
};

export default NotifOneSignal;
