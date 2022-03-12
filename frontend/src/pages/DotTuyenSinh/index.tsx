import TableBase from '@/components/Table';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const DotTuyenSinhComponent = () => {
  const {
    getDotTuyenSinhPageableModel,
    page,
    loading,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    deleteDotTuyenSinhModel,
  } = useModel('dottuyensinh');

  const { getProductByCodeModel } = useModel('thanhtoan');

  const { getAllNamTuyenSinhModel } = useModel('namtuyensinh');
  const { getAllHinhThucDaoTaoModel } = useModel('hinhthucdaotao');
  const { getAllDoiTuongTuyenSinhModel } = useModel('doituongtuyensinh');
  const { getAllCoSoDaoTaoModel } = useModel('cosodaotao');
  const { getAllNganhChuyenNganhModel } = useModel('nganhchuyennganh');

  useEffect(() => {
    getAllCoSoDaoTaoModel();
    getAllNganhChuyenNganhModel();
    getAllDoiTuongTuyenSinhModel();
    getAllHinhThucDaoTaoModel();
    getAllNamTuyenSinhModel();
  }, []);

  const columns: IColumn<DotTuyenSinh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên đợt tuyển sinh',
      dataIndex: 'tenDotTuyenSinh',
      align: 'center',
      width: 200,
    },
    {
      title: 'Năm tuyển sinh',
      dataIndex: 'namTuyenSinh',
      align: 'center',
      width: 120,
    },

    {
      title: 'Đối tượng tuyển sinh',
      dataIndex: 'danhSachDoiTuongTuyenSinh',
      align: 'center',
      width: 300,
      render: (val) => (
        <>
          {val?.map((item: { thongTinDoiTuong: DoiTuongTuyenSinh.Record }) => (
            <Tag key={item.thongTinDoiTuong._id}>{item?.thongTinDoiTuong?.tenDoiTuong}</Tag>
          ))}
        </>
      ),
    },

    {
      title: 'Thời gian mở đăng ký',
      dataIndex: 'thoiGianMoDangKy',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val).format('DD/MM/YYYY HH:mm')}</div>,
    },
    {
      title: 'Thời gian kết thúc nộp hồ sơ',
      dataIndex: 'thoiGianKetThucNopHoSo',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val).format('DD/MM/YYYY HH:mm')}</div>,
    },
    {
      title: 'Thời gian công bố kết quả',
      dataIndex: 'thoiGianCongBoKetQua',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val).format('DD/MM/YYYY HH:mm')}</div>,
    },
    {
      title: 'Thời gian kết thúc xác nhận nhập học',
      dataIndex: 'thoiGianKetThucXacNhanNhapHoc',
      align: 'center',
      width: 200,
      render: (val) => <div>{moment(val).format('DD/MM/YYYY HH:mm')}</div>,
    },
    {
      title: 'Số lượng đăng ký',
      dataIndex: 'soLuongDangKy',
      align: 'center',
      width: 100,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: DotTuyenSinh.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                getProductByCodeModel(record?.maLePhi);
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
              onConfirm={() => deleteDotTuyenSinhModel(record._id)}
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
      widthDrawer="750px"
      formType="Drawer"
      otherProps={{ scroll: { x: 1000 } }}
      hascreate
      getData={getDotTuyenSinhPageableModel}
      modelName="dottuyensinh"
      title="Quản lý đợt tuyển sinh"
      loading={loading}
      columns={columns}
      dependencies={[page, limit, condition]}
      Form={Form}
    />
  );
};

export default DotTuyenSinhComponent;
