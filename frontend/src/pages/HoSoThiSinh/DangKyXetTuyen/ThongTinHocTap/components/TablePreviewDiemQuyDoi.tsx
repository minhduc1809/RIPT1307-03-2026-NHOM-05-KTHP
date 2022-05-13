import type { IColumn } from '@/utils/interfaces';
import { Table } from 'antd';
import { useModel } from 'umi';

const TablePreviewDiemQuyDoi = () => {
  const { danhSachPreviewDiemQuyDoi } = useModel('hosoxettuyen');
  const { record } = useModel('dottuyensinh');
  const columns: IColumn<{ diemQuyDoi: number; maDoiTuong: string }>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Đối tượng',
      dataIndex: 'maDoiTuong',
      width: 250,
      align: 'center',
      render: (val) => (
        <div>
          {record?.danhSachDoiTuongTuyenSinh?.find((item) => item.maDoiTuong === val)
            ?.thongTinDoiTuong?.tenDoiTuong ?? ''}
        </div>
      ),
    },
    {
      title: 'Điểm quy đổi',
      dataIndex: 'diemQuyDoi',
      width: 100,
      align: 'center',
    },
  ];

  return (
    <Table
      pagination={false}
      dataSource={danhSachPreviewDiemQuyDoi.map((item, index) => ({ ...item, index: index + 1 }))}
      columns={columns}
    />
  );
};

export default TablePreviewDiemQuyDoi;
