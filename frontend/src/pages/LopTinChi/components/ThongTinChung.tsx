import teacherIcon from '@/assets/teacher.png';
import { Avatar, Card, Descriptions, List, Tabs } from 'antd';
import type { Key } from 'react';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DanhSachSinhVien from './DanhSachSinhVien';
import logo from '@/assets/logo.png';

const ThongTinChung = (props: { id: number; isGiangVien: boolean }) => {
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
    infoMonHoc,
    getInfoMonHocModel,
  } = useModel('loptinchi');
  useEffect(() => {
    if (!record.id) {
      getLopTinChiByIdLop(Number(props.id));
    }
    getInfoMonHocModel(record?.mon_hoc_ids?.[0]);
    getThongTinChungLopTinChi(record.id || Number(props.id));
    getNhomLopTinChiByIdModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id]);

  useEffect(() => {
    getDanhSachSinhVienByIdNhomLopModel();
  }, [idNhomLop]);

  return (
    <Card>
      <Descriptions column={{ xs: 24, md: 2, lg: 4 }} title="Thông tin lớp">
        <Descriptions.Item>
          <b style={{ marginRight: 4 }}>Tên môn học: </b> {infoMonHoc?.ten_hoc_phan ?? ''}
        </Descriptions.Item>
        <Descriptions.Item>
          <b style={{ marginRight: 4 }}>Mã môn học: </b> {infoMonHoc?.ma_hoc_phan_moi ?? ''}
        </Descriptions.Item>
        <Descriptions.Item>
          <b style={{ marginRight: 4 }}>Số tín chỉ: </b> {infoMonHoc?.so_tin_chi ?? ''}
        </Descriptions.Item>
        <Descriptions.Item>
          <b style={{ marginRight: 4 }}>Sĩ số: </b> {thongTinChung?.sinhVienList?.length ?? 0}
        </Descriptions.Item>
      </Descriptions>

      {!isGiangVien && (
        <>
          <Descriptions title="Giảng viên:" />
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
            dataSource={[thongTinChung?.giangVien ?? {}]}
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
                      {item?.so_dien_thoai || 'Chưa cập nhật'}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </>
      )}

      <Tabs
        onChange={(val: string) => {
          setIdNhomLop(Number(val));
        }}
      >
        <Tabs.TabPane tab="Danh sách sinh viên" key={-1}>
          <DanhSachSinhVien loading={loading} data={thongTinChung?.sinhVienList ?? []} />
        </Tabs.TabPane>
        {danhSachNhomLop?.map((item: { so_thu_tu_nhom: any; id: Key | null | undefined }) => (
          <Tabs.TabPane tab={`Nhóm ${item.so_thu_tu_nhom}`} key={item.id}>
            <DanhSachSinhVien loading={loading} data={danhSachSinhVien} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

export default ThongTinChung;
