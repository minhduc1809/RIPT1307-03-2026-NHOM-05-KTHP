import TableBase from '@/components/Table';
import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import { EHinhThucLePhiTuyenSinh } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const DotNhapHocComponent = () => {
  const {
    getModel,
    page,
    loading,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    deleteModel,
    setdanhSachGiayToCanNop,
  } = useModel('dotnhaphoc');

  const { getAllDotTuyenSinhModel } = useModel('dottuyensinh');
  const { getAllNganhChuyenNganhModel } = useModel('nganhchuyennganh');

  const { getModel: getProduct } = useModel('product');

  useEffect(() => {
    getAllDotTuyenSinhModel();
    getAllNganhChuyenNganhModel();
    getProduct(
      {
        'metaData.loai': 'Tuyển sinh',
        'metaData.hinhThuc': EHinhThucLePhiTuyenSinh.NHAP_HOC,
        active: true,
      },
      'pageable',
      1,
      100,
    );
  }, []);

  const columns: IColumn<DotNhapHoc.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên đợt',
      dataIndex: 'tenDot',
      width: 200,
      align: 'center',
    },

    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'ngayBatDau',
      width: 120,
      align: 'center',
      render: (val) => <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'ngayKetThuc',
      width: 120,
      align: 'center',
      render: (val) => <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (record: DotNhapHoc.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEdit(true);
                setRecord(record);
                setVisibleForm(true);
                setdanhSachGiayToCanNop(record?.danhSachGiayToCanNop ?? []);
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
              onConfirm={() => deleteModel(record._id)}
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
      widthDrawer="1100px"
      hascreate
      formType="Drawer"
      getData={getModel}
      modelName="dotnhaphoc"
      title="Quản lý đợt nhập học"
      loading={loading}
      columns={columns}
      dependencies={[page, limit, condition]}
      Form={Form}
    />
  );
};

export default DotNhapHocComponent;
