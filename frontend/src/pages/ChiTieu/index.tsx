import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { useModel } from 'umi';

const ChiTieu = () => {
  const { getChiTieuPageableModel, page, limit, condition, loading } = useModel('chitieu');
  const columns: IColumn<ChiTieu.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Cơ sở đào tạo',
      dataIndex: 'coSoDaoTao',
      align: 'center',
      render: (val: CoSoDaoTao.Record) => <div>{val?.ten}</div>,
    },
  ];
  return (
    <TableBase
      columns={columns}
      modelName="chitieu"
      loading={loading}
      title="Chỉ tiêu xét tuyển"
      dependencies={[page, limit, condition]}
      getData={getChiTieuPageableModel}
    />
  );
};

export default ChiTieu;
