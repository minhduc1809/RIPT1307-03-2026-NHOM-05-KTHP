import { ClockCircleOutlined } from '@ant-design/icons';
import { Card, Timeline } from 'antd';

const FormQuyTrinh = (props: { record?: DichVuMotCuaV2.QuyTrinh; type?: string }) => {
  return (
    <Card title={props.type === 'view' ? false : 'Quy trình'}>
      {props?.record?.danhSachBuoc?.map((buoc) => (
        <>
          <Timeline mode="alternate">
            <Timeline.Item>
              <b>{buoc?.ten ?? ''}</b>
            </Timeline.Item>
            {buoc?.danhSachThaoTac?.map((thaoTac, index) => (
              <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
                {/* <div>Thao tác {index + 1}</div> */}
                <div>Hạn xử lý: {thaoTac?.soNgayXuLy} ngày</div>
                <div>Đơn vị: {thaoTac?.tenDonVi}</div>
              </Timeline.Item>
            ))}
          </Timeline>
        </>
      ))}
    </Card>
  );
};

export default FormQuyTrinh;
