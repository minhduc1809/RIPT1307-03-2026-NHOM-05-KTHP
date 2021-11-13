import type { LopTinChi } from '@/services/LopTinChi/typings';
import type { IColumn } from '@/utils/interfaces';
import { Table } from 'antd';

const DetaiKetQuaHocTap = (props: { ketQuaHocTap?: LopTinChi.KetQuaHocTap }) => {
  const columns: IColumn<LopTinChi.KetQuaHocTap | {}>[] = [
    {
      title: 'Điểm chuyên cần (%)',
      align: 'center',
      dataIndex: 'diem_attendance',
    },
    {
      title: 'Điểm bài tập (%)',
      align: 'center',
      dataIndex: 'diem_bai_tap',
    },
    {
      title: 'Điểm trung bình kiểm tra (%)',
      align: 'center',
      dataIndex: 'diem_trung_binh_kiem_tra_tren_lop',
    },
    {
      title: 'Điểm thực hành (%)',
      align: 'center',
      dataIndex: 'diem_thi_nghiem',
    },
    {
      title: 'Điểm cuối kỳ (%)',
      align: 'center',
      dataIndex: 'diem_cuoi_ky',
    },
    {
      title: 'Điểm tổng kết',
      align: 'center',
      fixed: 'right',
      dataIndex: 'diem_tong_ket',
    },
  ];
  return <Table pagination={false} columns={columns} dataSource={[props?.ketQuaHocTap ?? {}]} />;
};

export default DetaiKetQuaHocTap;
