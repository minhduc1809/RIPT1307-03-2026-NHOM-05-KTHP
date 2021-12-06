import LineChart from '@/components/Chart/Line';
import DiemThanhPhan from '@/pages/LopTinChi/GocHocTap/components/DiemThanhPhan';
import { Descriptions, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const KetQuaHocTapSinhVien = (props: { sinhVien?: Login.Profile }) => {
  const { sinhVien } = props;
  const {
    giangVienGetDiemTongKetSinhVienByIdSinhVienModel,
    danhSachDiemTongKet,
    setDanhSachDiemTongKet,
    loading,
  } = useModel('loptinchi');
  useEffect(() => {
    giangVienGetDiemTongKetSinhVienByIdSinhVienModel(sinhVien?.id ?? -1);
    return () => {
      setDanhSachDiemTongKet([]);
    };
  }, []);

  return (
    <Spin spinning={loading}>
      <h3 style={{ fontWeight: 'bold' }}>Thông tin chung</h3>
      <Descriptions style={{ marginBottom: 8 }} bordered column={{ xl: 12 }}>
        <Descriptions.Item span={3}>Họ và tên: {sinhVien?.name ?? ''}</Descriptions.Item>
        <Descriptions.Item span={3}>Mã sinh viên: {sinhVien?.ma_dinh_danh ?? ''}</Descriptions.Item>
        <Descriptions.Item span={3}>
          Ngày sinh: {sinhVien?.ngay_sinh?.split('-')?.reverse()?.join('-')}
        </Descriptions.Item>
        <Descriptions.Item span={3}>
          Giới tính: {sinhVien?.gioi_tinh || 'Chưa cập nhật'}
        </Descriptions.Item>
      </Descriptions>

      <h3 style={{ fontWeight: 'bold' }}>GPA</h3>
      <LineChart
        xLabel="Kỳ"
        yLabel="GPA"
        data={danhSachDiemTongKet?.map((item) => ({
          x: item?.ky_nam_hoc_id?.[1],
          y: item?.diem_tb_tich_luy_hoc_ky_thang_4,
        }))}
      />
      <DiemThanhPhan sinhVien={sinhVien} />
    </Spin>
  );
};

export default KetQuaHocTapSinhVien;
