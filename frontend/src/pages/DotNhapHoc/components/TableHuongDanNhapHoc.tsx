import type { HuongDanNhapHoc } from '@/services/HuongDanNhapHoc/typings';
import type { IColumn } from '@/utils/interfaces';
import { Table } from 'antd';

const TableHuongDanNhapHoc = () => {
  const columns: IColumn<HuongDanNhapHoc.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGian',
      width: 100,
      align: 'center',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'diaDiem',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ngành',
      dataIndex: 'nganh',
      width: 200,
      align: 'center',
    },
    {
      title: 'Danh sách giấy tờ cần nộp',
      dataIndex: 'danhSachGiayToCanNop',
      width: 300,
      align: 'center',
    },
    {
      title: 'Danh sách kinh phí cần nộp',
      dataIndex: 'danhSachKinhPhiCanNop',
      width: 300,
      align: 'center',
    },
  ];

  return <Table columns={columns} />;
};

export default TableHuongDanNhapHoc;
