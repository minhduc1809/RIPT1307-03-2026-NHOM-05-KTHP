import { useModel } from 'umi';
import KhaiBaoThongTinCaNhan from './KhaiBaoThongTinCaNhan';
import QuaTrinhHocTap from './QuaTrinhHocTap';

const Content = () => {
  const { current } = useModel('hosothisinh');
  let contentComponent = <div />;
  switch (current) {
    case 0:
      contentComponent = <KhaiBaoThongTinCaNhan />;
      break;
    case 1:
      contentComponent = <QuaTrinhHocTap />;
      break;
  }

  return <div>{contentComponent}</div>;
};

export default Content;
