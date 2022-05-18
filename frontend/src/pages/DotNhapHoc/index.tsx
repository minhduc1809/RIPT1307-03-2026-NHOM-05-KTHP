import Paragraph from '@/components/Paragraph';
import TableBase from '@/components/Table';
import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import { EHinhThucLePhiTuyenSinh } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useModel } from 'umi';
import HuongDanNhapHocComponent from '../HuongDanNhapHoc';
import Form from './components/Form';

const DotNhapHocComponent = () => {
  const isMediumScreen = useMediaQuery({
    query: '(min-width: 900px)',
  });
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
  const { getAllHinhThucDaoTaoModel } = useModel('hinhthucdaotao');
  const { getModel: getProduct } = useModel('product');
  const [visibleHuongDan, setVisibleHuongDan] = useState<boolean>(false);

  useEffect(() => {
    getAllDotTuyenSinhModel();
    getAllHinhThucDaoTaoModel();
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

  const closeHuongDan = () => {
    setVisibleHuongDan(false);
  };

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
      render: (val) => Paragraph(val, 2, { marginBottom: 0 }),
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
              type="primary"
              shape="circle"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Hướng dẫn nhập học">
            <Button
              onClick={() => {
                setRecord(record);
                setdanhSachGiayToCanNop(record?.danhSachGiayToCanNop ?? []);
                setVisibleHuongDan(true);
              }}
              type="default"
              shape="circle"
            >
              <SettingOutlined />
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
    <>
      <TableBase
        widthDrawer={isMediumScreen ? 900 : '100%'}
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
      <Modal
        width={1100}
        footer={false}
        title="Hướng dẫn nhập học"
        destroyOnClose
        visible={visibleHuongDan}
        onCancel={closeHuongDan}
      >
        <HuongDanNhapHocComponent />
      </Modal>
    </>
  );
};

export default DotNhapHocComponent;
