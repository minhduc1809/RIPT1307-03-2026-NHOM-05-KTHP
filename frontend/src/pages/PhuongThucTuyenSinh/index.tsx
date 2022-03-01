import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const PhuongThucTuyenSinh = () => {
  const { getPhuongThucTuyenSinhPageableModel, page, loading, limit, condition } =
    useModel('phuongthuctuyensinh');

  const { getAllHinhThucDaoTaoModel } = useModel('hinhthucdaotao');

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
  }, []);

  const columns: IColumn<PhuongThucTuyenSinh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã phương thức',
      dataIndex: 'maPhuongThuc',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tên phương thức',
      dataIndex: 'tenPhuongThuc',
      width: 200,
      align: 'center',
    },
    {
      title: 'Loại phương thức',
      dataIndex: 'loaiPhuongThuc',
      width: 200,
      align: 'center',
    },

    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTao',
      width: 100,
      align: 'center',
    },
  ];

  return (
    <TableBase
      hascreate
      getData={getPhuongThucTuyenSinhPageableModel}
      modelName="phuongthuctuyensinh"
      title="Quản lý phương thức tuyển sinh"
      loading={loading}
      Form={Form}
      columns={columns}
      dependencies={[page, limit, condition]}
    />
  );
};

export default PhuongThucTuyenSinh;
