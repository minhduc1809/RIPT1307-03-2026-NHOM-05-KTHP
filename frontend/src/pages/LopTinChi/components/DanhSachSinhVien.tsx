import studentIcon from '@/assets/student.png';
import { Avatar, List } from 'antd';

const DanhSachSinhVien = (props: { data: Login.Profile[]; loading: boolean }) => {
  return (
    <>
      {/* <h3 style={{ fontWeight: 'bold' }}>Số lượng: {props?.data?.length ?? 0} sinh viên</h3> */}
      <List
        // loading={props.loading}
        grid={{
          xs: 1,
          xl: 3,
          md: 2,
          sm: 2,
          lg: 3,
          xxl: 4,
        }}
        itemLayout="horizontal"
        dataSource={props?.data ?? []}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item?.avatar_path || studentIcon} />}
              title={
                <div>
                  <b>Họ và tên: </b>
                  {item?.name ?? ''}
                </div>
              }
              description={
                <div>
                  <b>Mã sinh viên: </b>
                  {item?.ma_dinh_danh ?? 'Chưa cập nhật'}
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
