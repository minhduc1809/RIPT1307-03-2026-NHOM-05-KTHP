import type { LopTinChi } from '@/services/LopTinChi/typings';
import type { IColumn } from '@/utils/interfaces';
import { useModel } from 'umi';
import { Table } from 'antd';
import { useEffect } from 'react';

const KetQuaHocTapGV = (props: { id: string }) => {
  const {
    giangVienGetKetQuaHocTapByIdLopTinChiModel,
    loading,
    danhSachKetQuaHocTap,
    setDanhSachKetQuaHocTap,
  } = useModel('loptinchi');

  useEffect(() => {
    if (props.id) giangVienGetKetQuaHocTapByIdLopTinChiModel(Number(props.id));
    return () => {
      setDanhSachKetQuaHocTap([]);
    };
  }, [props.id]);

  const columns: IColumn<LopTinChi.KetQuaHocTap>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ tên',
      dataIndex: 'TenDayDu',
      align: 'center',
      // width: 200,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'ma_sv',
      align: 'center',
      width: 150,
    },
    {
      title: 'Điểm chuyên cần',
      dataIndex: 'diem_attendance',
      align: 'center',
      width: 140,
    },
    {
      title: 'Điểm bài tập',
      dataIndex: 'diem_bai_tap',
      align: 'center',
      width: 140,
    },

    {
      title: 'Điểm TB kiểm tra',
      dataIndex: 'diem_trung_binh_kiem_tra_tren_lop',
      align: 'center',
      width: 140,
    },
    {
      title: 'Điểm thực hành',
      dataIndex: 'diem_thi_nghiem',
      align: 'center',
      width: 140,
    },
    {
      title: 'Điểm cuối kỳ',
      dataIndex: 'diem_cuoi_ky',
      align: 'center',
      width: 140,
    },
  ];

  return (
    <Table
      dataSource={danhSachKetQuaHocTap?.map((item, index) => {
        return { ...item, index: index + 1 };
      })}
      pagination={{ showTotal: (total) => `Tổng số : ${total} sinh viên` }}
      columns={columns}
      loading={loading}
    />
  );
};

export default KetQuaHocTapGV;
