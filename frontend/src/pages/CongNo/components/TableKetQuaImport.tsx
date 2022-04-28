import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';

const TableKetQuaImport = (props: { data: ThanhToan.RecordResponseImport[] }) => {
  const columns: IColumn<ThanhToan.RecordResponseImport>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 120,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      align: 'center',
      search: 'search',
      width: 200,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      search: 'search',
      align: 'center',
    },
  ];

  return (
    <Table
      hasTotal
      otherProps={{ pagination: false }}
      columns={columns}
      data={props?.data?.map((item, index) => ({ ...item, index: index + 1 })) ?? []}
    />
  );
};

export default TableKetQuaImport;
