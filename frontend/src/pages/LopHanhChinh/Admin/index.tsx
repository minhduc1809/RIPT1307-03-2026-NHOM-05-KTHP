import TableBase from '@/components/Table';
import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import type { IColumn } from '@/utils/interfaces';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const LopHanhChinhAdmin = () => {
  const {
    condition,
    page,
    limit,
    loading,
    getLopChinhAdminModel,
    getAllHinhThucDaoTaoModel,
    hinhThucDaoTao,
    danhSachHinhThucDaoTao,
    setHinhThucDaoTao,
  } = useModel('lophanhchinh');

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
  }, []);

  const columns: IColumn<APILopHanhChinh.RecordAdmin>[] = [
    { title: 'STT', dataIndex: 'index', width: 80, align: 'center' },
    {
      title: 'Lớp',
      dataIndex: 'ten_lop_hanh_chinh',
      width: 200,
      align: 'center',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giang_vien_id',
      width: 200,
      align: 'center',
      render: (val) => <div>{val?.[1] ?? ''}</div>,
    },
    {
      title: 'Ngành',
      dataIndex: 'nganh',
      // width:200,
      align: 'center',
      render: (val) => <div>{val?.[1] ?? ''}</div>,
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinh_thuc_dao_tao_moi',
      width: 200,
      align: 'center',
      render: (val) => <div>{val?.[1] ?? ''}</div>,
    },
    {
      title: 'Cơ sở đào tạo',
      dataIndex: 'co_so_dao_tao_moi',
      width: 200,
      align: 'center',
      render: (val) => <div>{val?.[1] ?? ''}</div>,
    },
  ];

  return (
    <TableBase
      columns={columns}
      loading={loading}
      dependencies={[page, limit, condition, hinhThucDaoTao]}
      title="Danh sách lớp hành chính"
      getData={getLopChinhAdminModel}
      modelName="lophanhchinh"
    >
      <Select
        value={hinhThucDaoTao}
        onChange={(val: number) => {
          setHinhThucDaoTao(val);
        }}
        style={{ marginBottom: 8, width: 250 }}
      >
        <Select.Option value={-1} key={-1}>
          Tất cả hình thức đào tạo
        </Select.Option>
        {danhSachHinhThucDaoTao?.map((item) => (
          <Select.Option value={item.id}>{item.ten_hinh_thuc_dao_tao}</Select.Option>
        ))}
      </Select>
    </TableBase>
  );
};

export default LopHanhChinhAdmin;
