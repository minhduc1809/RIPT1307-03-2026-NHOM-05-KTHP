import Table from '@/components/Table/Table';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import type { IColumn } from '@/utils/interfaces';
import { Descriptions, Select } from 'antd';
import { useEffect } from 'react';
import { useAccess, useModel } from 'umi';

const DiemThanhPhan = (props: { sinhVien?: Login.Profile }) => {
  const access = useAccess();
  const {
    sinhVienGetDiemThanhPhanByHocKyModel,
    sinhVienGetDiemTongKetByHocKyModel,
    danhSachDiemThanhPhanTheoKy,
    loading,
    recordDiemTongKet,
    setRecordDiemTongKet,
    danhSachDiemTongKet,
    giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKyModel,
  } = useModel('loptinchi');

  const {
    getAllKyHocSinhVienModel,
    danhSach,
    record,
    setRecord,
    giangVienGetAllKyHocSinhVienByIdSinhVienModel,
  } = useModel('kyhoc');

  const onChangeKyHoc = (value: number) => {
    const kyHoc: KyHoc.Record | undefined = danhSach.find(
      (item: KyHoc.Record) => item.id === value,
    );
    setRecord(kyHoc);
  };

  useEffect(() => {
    if (access.sinhVien) getAllKyHocSinhVienModel();
    else giangVienGetAllKyHocSinhVienByIdSinhVienModel(props?.sinhVien?.id ?? -1);
  }, []);

  useEffect(() => {
    if (record?.id) {
      if (access.sinhVien) {
        sinhVienGetDiemTongKetByHocKyModel(record.id);
        sinhVienGetDiemThanhPhanByHocKyModel(record.id);
      } else
        giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKyModel(
          props?.sinhVien?.id ?? -1,
          record?.id,
        );
      setRecordDiemTongKet(
        danhSachDiemTongKet?.find((item) => item?.ky_nam_hoc_id?.[0] === record?.id),
      );
    }
  }, [record]);

  const columns: IColumn<LopTinChi.DiemThanhPhan>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Lớp',
      dataIndex: 'ma_lop',
      width: 150,
      align: 'center',
    },
    {
      title: 'Môn',
      dataIndex: ['hoc_phan_id', 1],
      align: 'center',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'so_tin_chi',
      align: 'center',
      width: 100,
    },
    {
      title: 'Chuyên cần',
      dataIndex: 'diem_attendance',
      align: 'center',
      width: 100,
    },
    {
      title: 'Bài tập',
      dataIndex: 'diem_bai_tap',
      align: 'center',
      width: 100,
    },
    {
      title: 'Thực hành',
      dataIndex: 'diem_thi_nghiem',
      align: 'center',
      width: 100,
    },
    {
      title: 'Kiểm tra',
      dataIndex: 'diem_trung_binh_kiem_tra_tren_lop',
      align: 'center',
      width: 100,
    },
    {
      title: 'Tổng kết',
      dataIndex: 'diem_tong_ket',
      align: 'center',
      render: (val) => <b>{val}</b>,
      width: 100,
    },
  ];

  return (
    <>
      <Select
        placeholder="Chọn kỳ học"
        onChange={onChangeKyHoc}
        value={record?.id}
        style={{ width: 220, marginBottom: 8 }}
      >
        {danhSach?.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            Kỳ {item.ten_ky_nam_hoc} năm học {item.nam_hoc_id[1]}
          </Select.Option>
        ))}
      </Select>
      <Table
        otherProps={{
          loading: loading,
          pagination: false,
          footer: () => (
            <Descriptions column={{ xl: 1 }}>
              <Descriptions.Item>
                <b style={{ marginRight: 8 }}>Điểm trung bình hệ 4: </b>
                {recordDiemTongKet?.diem_tb_chung_hoc_ky_thang_4 ?? 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item>
                <b style={{ marginRight: 8 }}>Điểm GPA (hệ 4): </b>
                {recordDiemTongKet?.diem_tb_tich_luy_hoc_ky_thang_4 ?? 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item>
                <b style={{ marginRight: 8 }}>Số tín chỉ đạt: </b>
                {recordDiemTongKet?.tong_so_tin_chi_trong_hoc_ky ?? 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item>
                <b style={{ marginRight: 8 }}>Số tín chỉ tích lũy: </b>
                {recordDiemTongKet?.tong_so_tin_chi_tich_luy_sau_hoc_ky ?? 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          ),
        }}
        data={danhSachDiemThanhPhanTheoKy?.map((item, index) => ({ ...item, index: index + 1 }))}
        columns={columns}
      />
    </>
  );
};

export default DiemThanhPhan;
