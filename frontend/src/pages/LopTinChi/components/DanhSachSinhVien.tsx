import studentIcon from '@/assets/student.png';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import { Avatar, List } from 'antd';

const DanhSachSinhVien = (props: { data: LopTinChi.SinhVienRecord[]; loading: boolean }) => {
  return (
    <>
      <h3 style={{ fontWeight: 'bold' }}>Số lượng: {props?.data?.length ?? 0} sinh viên</h3>
      <List
        loading={props.loading}
        grid={{
          xs: 1,
          xl: 3,
          md: 2,
          sm: 2,
          lg: 3,
          xxl: 4,
        }}
        itemLayout="horizontal"
        dataSource={props.data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item?.anhDaiDien ?? studentIcon} />}
              title={
                <div>
                  <b>Họ và tên: </b>
                  {item?.TenDayDu ?? ''}
                </div>
              }
              description={
                <div>
                  <b>Mã sinh viên: </b>
                  {item?.ma_sv ?? ''}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default DanhSachSinhVien;
