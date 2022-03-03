import { Card, Avatar } from 'antd';
import { useModel } from 'umi';

const ThongTinCaNhan = () => {
  const { initialState } = useModel('@@initialState');

  return (
    <Card>
      <Card.Meta
        avatar={<Avatar src={initialState?.currentUser?.anhDaiDien} />}
        title={initialState?.currentUser?.ten}
      />
      <br />
      <div>
        <div>{`CMND/CCCD: ${initialState?.currentUser?.cmtCccd}`}</div>
        <div style={{ color: 'rgb(213, 0, 0)' }}>{`Mã hồ sơ: Chưa cập nhật`}</div>
      </div>
    </Card>
  );
};

export default ThongTinCaNhan;
