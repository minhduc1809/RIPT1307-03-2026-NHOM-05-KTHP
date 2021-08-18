import studentIcon from '@/assets/student.png';
import teacherIcon from '@/assets/teacher.png';
import { Avatar, Card, Descriptions, List } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ThongTinChung = (props: { id: string; isGiangVien: boolean }) => {
  const { isGiangVien } = props;
  const { record, getThongTinChungLopTinChi, thongTinChung, getLopTinChiByIdLop } =
    useModel('loptinchi');
  useEffect(() => {
    if (!record.id) {
      getLopTinChiByIdLop(Number(props.id));
    }
    getThongTinChungLopTinChi(record.id || Number(props.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id]);
  const { giangVien, sinhVienList } = thongTinChung;
  return (
    <Card>
      <Descriptions title={`Sĩ số: ${sinhVienList?.length ?? 0} sinh viên`} />

      {!isGiangVien && (
        <>
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
            dataSource={[giangVien || {}]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item?.anhDaiDien ?? teacherIcon} />}
                  title={
                    <div>
                      <b>Họ và tên: </b>
                      {item?.TenDayDu ?? ''}
                    </div>
                  }
                  description={
                    <div>
                      <b>Số điện thoại: </b>
                      {item?.soDienThoai ?? 'Chưa cập nhật'}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </>
      )}
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
        dataSource={sinhVienList}
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
                  {item?.MaSV ?? ''}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ThongTinChung;
