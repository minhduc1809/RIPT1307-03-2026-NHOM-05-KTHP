import type { LopTinChi } from '@/services/LopTinChi/typings';
import { Descriptions } from 'antd';

const DetaiKetQuaHocTap = (props: { ketQuaHocTap?: LopTinChi.KetQuaHocTap }) => {
  return (
    <Descriptions bordered>
      <Descriptions.Item label="Điểm chuyên cần">
        {props.ketQuaHocTap?.diem_attendance ?? 'Chưa cập nhật'}
      </Descriptions.Item>
      <Descriptions.Item label="Điểm bài tập">
        {props.ketQuaHocTap?.diem_bai_tap ?? 'Chưa cập nhật'}
      </Descriptions.Item>
      <Descriptions.Item label="Điểm trung bình kiểm tra">
        {props.ketQuaHocTap?.diem_trung_binh_kiem_tra_tren_lop ?? 'Chưa cập nhật'}
      </Descriptions.Item>
      <Descriptions.Item label="Điểm thực hành">
        {props.ketQuaHocTap?.diem_thi_nghiem ?? 'Chưa cập nhật'}
      </Descriptions.Item>
      <Descriptions.Item label="Điểm cuối kỳ">
        {props.ketQuaHocTap?.diem_cuoi_ky ?? 'Chưa cập nhật'}
      </Descriptions.Item>
      <Descriptions.Item label="Điểm tổng kết">
        {props.ketQuaHocTap?.diem_tong_ket ?? 'Chưa cập nhật'}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default DetaiKetQuaHocTap;
