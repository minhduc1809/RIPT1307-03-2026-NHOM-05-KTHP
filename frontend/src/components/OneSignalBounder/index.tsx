import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

const OneSignalBounder = (props: { children: React.ReactNode }) => {
  useEffect(() => {
    OneSignal.init({
      appId: 'f3857a81-2891-49be-87a7-903a4a1a54be',
    });
  }, []);

  return <>{props.children}</>;
};

export default OneSignalBounder;
