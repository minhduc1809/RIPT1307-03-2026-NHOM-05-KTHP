import teacherIcon from '@/assets/teacher.png';
import { Avatar, Card, Descriptions, List, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DanhSachSinhVien from './DanhSachSinhVien';

const ThongTinChung = (props: { id: string; isGiangVien: boolean }) => {
  const { isGiangVien } = props;
  const {
    loading,
    record,
    getThongTinChungLopTinChi,
    thongTinChung,
    getLopTinChiByIdLop,
    danhSachNhomLop,
    getNhomLopTinChiByIdModel,
    idNhomLop,
    danhSachSinhVien,
    getDanhSachSinhVienByIdNhomLopModel,
    setIdNhomLop,
  } = useModel('loptinchi');
  useEffect(() => {
    if (!record.id) {
      getLopTinChiByIdLop(Number(props.id));
    }
    getThongTinChungLopTinChi(record.id || Number(props.id));
    getNhomLopTinChiByIdModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id]);

  useEffect(() => {
    getDanhSachSinhVienByIdNhomLopModel();
  }, [idNhomLop]);
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
                      {item?.TenDayDu ?? 'Chưa cập nhật'}
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

      <Tabs
        onChange={(val: string) => {
          setIdNhomLop(Number(val));
        }}
      >
        <Tabs.TabPane tab="Tất cả" key={-1}>
          <DanhSachSinhVien loading={loading} data={sinhVienList} />
        </Tabs.TabPane>
        {danhSachNhomLop?.map((item) => (
          <Tabs.TabPane tab={`Nhóm ${item.so_thu_tu_nhom}`} key={item.id}>
            <DanhSachSinhVien loading={loading} data={danhSachSinhVien} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

export default ThongTinChung;
