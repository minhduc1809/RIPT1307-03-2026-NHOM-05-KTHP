import { useModel } from 'umi';

const ContentNhapHoc = () => {
  const { current } = useModel('hosothisinh');
  let contentComponent = <div />;
  switch (current) {
    case 0:
      contentComponent = <div>Lý lịch sinh viên</div>;
      break;
    case 1:
      contentComponent = <div>Thông tin nhập học và thanh toán</div>;
      break;
  }

  return <div>{contentComponent}</div>;
};

export default ContentNhapHoc;
