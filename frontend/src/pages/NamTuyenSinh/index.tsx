import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { useEffect } from 'react';
import { Button, Divider, Popconfirm, Tag, Tooltip, Typography } from 'antd';
import { useModel } from 'umi';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Form from './components/Form';

const NamTuyenSinh = () => {
  const {
    getNamTuyenSinhPageableModel,
    page,
    loading,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    deleteNamTuyenSinhModel,
  } = useModel('namtuyensinh');

  const { getAllHinhThucDaoTaoModel } = useModel('hinhthucdaotao');
  const { getAllPhuongThucTuyenSinhModel } = useModel('phuongthuctuyensinh');

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
    getAllPhuongThucTuyenSinhModel();
  }, []);

  const columns: IColumn<NamTuyenSinh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Năm',
      dataIndex: 'nam',
      width: 100,
      align: 'center',
    },
    {
      title: 'Nội dung',
      dataIndex: 'noiDung',
      width: 200,
      align: 'center',
      render: (val) => {
        return (
          <Typography.Paragraph
            ellipsis={{ rows: 3, expandable: false }}
            style={{ marginBottom: 0 }}
          >
            <div dangerouslySetInnerHTML={{ __html: val }} />
          </Typography.Paragraph>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 200,
      align: 'center',
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTao',
      width: 100,
      align: 'center',
      render: (val: HinhThucDaoTao.Record) => <div>{val?.ten}</div>,
    },
    {
      title: 'Phương thức tuyển sinh',
      dataIndex: 'danhSachPhuongThuc',
      width: 200,
      align: 'center',
      render: (
        val: { moTaPhuongThuc: string; phuongThucTuyenSinh: PhuongThucTuyenSinh.Record }[],
      ) => (
        <div>
          {val?.map((item) => (
            <Tag key={item.phuongThucTuyenSinh._id}>{item.phuongThucTuyenSinh.tenPhuongThuc}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (record: NamTuyenSinh.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEdit(true);
                setRecord(record);
                setVisibleForm(true);
              }}
              type="default"
              shape="circle"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteNamTuyenSinhModel(record._id)}
              title="Bạn có chắc chắn muốn xóa chủ đề này"
            >
              <Button type="primary" shape="circle">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      widthDrawer="700px"
      hascreate
      formType="Drawer"
      getData={getNamTuyenSinhPageableModel}
      modelName="namtuyensinh"
      title="Quản lý năm tuyển sinh"
      loading={loading}
      columns={columns}
      dependencies={[page, limit, condition]}
      Form={Form}
    />
  );
};

export default NamTuyenSinh;
