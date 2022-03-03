import { Card, Avatar } from 'antd';
import { useModel } from 'umi';

const ThongTinCaNhan = () => {
  const { initialState } = useModel('@@initialState');
  const { recordHoSo } = useModel('hosoxettuyen');
  return (
    <Card>
      <Card.Meta
        style={{ display: 'flex', alignItems: 'center' }}
        avatar={<Avatar src={initialState?.currentUser?.anhDaiDien} />}
        title={`${initialState?.currentUser?.hoDem} ${initialState?.currentUser?.ten}`}
      />
      <br />
      <div>
        <div>{`CMND/CCCD: ${recordHoSo?.thongTinThiSinh?.cmtCccd ?? ''}`}</div>
        <div style={{ color: 'rgb(213, 0, 0)' }}>{`Mã hồ sơ: ${
          recordHoSo?.maHoSo ?? 'Chưa cập nhật'
        }`}</div>
      </div>
    </Card>
  );
};

export default ThongTinCaNhan;
