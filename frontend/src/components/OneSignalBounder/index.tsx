import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

const OneSignalBounder = (props: { children: React.ReactNode }) => {
  useEffect(() => {
    OneSignal.init({
      appId: '72496a32-ad38-42eb-bb70-ef67c5800f24',
    });
  }, [props.children]);

  return <div>{props.children}</div>;
};

export default OneSignalBounder;
