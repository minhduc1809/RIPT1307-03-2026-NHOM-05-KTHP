import studentIcon from '@/assets/student.png';
import teacherIcon from '@/assets/teacher.png';
import { Descriptions, List } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';

const ThongTinChungLopHanhChinh = (props: {
  danhSachSinhVien: Login.Profile[];
  giangVien?: Login.Profile;
  siSo: number;
}) => {
  return (
    <>
      <Descriptions title={`Sĩ số: ${props.siSo ?? 0} sinh viên`} />
      <Descriptions title="Cố vấn học tập:" />
      <List
        grid={{
          xs: 1,
          xl: 3,
          sm: 2,
          lg: 3,
          md: 2,
          xxl: 4,
        }}
        itemLayout="horizontal"
        dataSource={[{ ...props.giangVien }]}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item?.avatar_path || teacherIcon} />}
              title={
                <div>
                  <b>Họ và tên: </b>
                  {item?.name || 'Chưa cập nhật'}
                </div>
              }
              description={
                <div>
                  <b>Số điện thoại: </b>
                  {item?.so_dien_thoai ?? 'Chưa cập nhật'}
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Descriptions title="Danh sách sinh viên:" />
      <List
        grid={{
          xs: 1,
          xl: 3,
          md: 2,
          sm: 2,
          lg: 3,
          xxl: 4,
        }}
        itemLayout="horizontal"
        dataSource={props.danhSachSinhVien}
        renderItem={(item: Login.Profile) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item?.avatar_path || studentIcon} />}
              title={
                <div>
                  <b>Họ và tên: </b>
                  {item?.name || ''}
                </div>
              }
              description={
                <div>
                  <b>Mã sinh viên: </b>
                  {item?.ma_dinh_danh || ''}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default ThongTinChungLopHanhChinh;
