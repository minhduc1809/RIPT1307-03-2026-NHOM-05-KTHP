import TableBase from '@/components/Table';
import type { NamTuyenSinh } from '@/services/NamTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const NamTuyenSinhComponent = () => {
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
      width: 70,
      align: 'center',
    },
    {
      title: 'Nội dung',
      dataIndex: 'noiDung',
      width: 150,
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
      width: 150,
      align: 'center',
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTao',
      width: 120,
      align: 'center',
      render: (val: HinhThucDaoTao.Record) => <div>{val?.ten}</div>,
    },
    {
      title: 'Phương thức tuyển sinh',
      dataIndex: 'danhSachPhuongThuc',
      // width: 200,
      align: 'center',
      render: (
        val: { moTaPhuongThuc: string; phuongThucTuyenSinh: PhuongThucTuyenSinh.Record }[],
      ) => (
        <div style={{ textAlign: 'left' }}>
          {val?.map((item) => (
            <div key={item.phuongThucTuyenSinh._id}>- {item.phuongThucTuyenSinh.tenPhuongThuc}</div>
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
              title="Bạn có chắc chắn muốn xóa?"
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

export default NamTuyenSinhComponent;
