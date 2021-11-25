import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { useModel } from 'umi';
import data from '@/utils/data';

const DanhSachCanBo = () => {
  const { getCanBoByIdDonViModel, page, limit, loading, condition } = useModel('canbo');
  const { record } = useModel('donvi');

  const columns: IColumn<CanBo.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: '100px',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      align: 'center',
      width: '200px',
      search: 'search',
    },
    {
      title: 'Mã định danh',
      dataIndex: 'ma_dinh_danh',
      align: 'center',
      width: '200px',
      search: 'search',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'vai_tro_goc',
      align: 'center',
      width: '200px',
      render: (val) => {
        return <div>{data?.CapDonVi?.[record?.cap_don_vi ?? '']?.[val] ?? ''}</div>;
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'so_dien_thoai',
      align: 'center',
      width: '150px',
      search: 'search',
    },
    {
      title: 'Email',
      dataIndex: 'email_dang_nhap',
      align: 'center',
      width: '220px',
      search: 'search',
    },
    {
      title: 'Địa chỉ hiện nay',
      align: 'center',
      render: (recordCanBo: CanBo.Record) => {
        const diaChi = [
          recordCanBo.so_nha_ten_duong_no,
          recordCanBo.phuong_xa_no,
          recordCanBo.quan_huyen_no,
          recordCanBo.tinh_tp_no,
        ];
        const diaChiString = diaChi.filter((item) => item && item).join(', ');
        return <div>{diaChiString}</div>;
      },
      // width: '200px',
    },
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   render: (record) => renderLast(record),
    //   fixed: 'right',
    //   width: 110,
    // },
  ];

  return (
    <TableBase
      params={record?.id}
      getData={getCanBoByIdDonViModel}
      dependencies={[page, limit, record?.id, condition]}
      columns={columns}
      loading={loading}
      modelName="canbo"
      scroll={{ x: 1500 }}
    />
  );
};

export default DanhSachCanBo;
