import TableBase from '@/components/Table';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
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
    setdanhSachGiayToNopHoSo,
    setdanhSachGiayToNopOnline,
    setdanhSachGiayToXacNhanNhapHoc,
    setDanhSachNganh,
    setdanhSachThongTinKhaiXacNhan,
    setDanhSachDoiTuong,
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

  const createAll = useCheckAccess('dot-tuyen-sinh:create-all');
  const updateAll = useCheckAccess('dot-tuyen-sinh:update-all');
  const deleteAll = useCheckAccess('dot-tuyen-sinh:delete-all');

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
      search: 'search',
    },
    {
      title: 'Năm tuyển sinh',
      dataIndex: 'namTuyenSinh',
      align: 'center',
      width: 120,
      search: 'search',
    },

    {
      title: 'Đối tượng tuyển sinh',
      dataIndex: 'danhSachDoiTuongTuyenSinh',
      align: 'center',
      width: 300,
      render: (val) => (
        <div style={{ textAlign: 'left' }}>
          {val?.map((item: { thongTinDoiTuong: DoiTuongTuyenSinh.Record }) => (
            <div key={item?.thongTinDoiTuong?._id}>- {item?.thongTinDoiTuong?.tenDoiTuong}</div>
          ))}
        </div>
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
              disabled={!updateAll}
              onClick={() => {
                getProductByCodeModel(record?.maLePhi);
                setdanhSachGiayToNopHoSo(record?.thongTinGiayToNopHoSo ?? []);
                setdanhSachGiayToNopOnline(record?.thongTinGiayToNopOnline ?? []);
                setdanhSachGiayToXacNhanNhapHoc(record?.danhSachGiayToXacNhanNhapHoc ?? []);
                setDanhSachNganh(record?.danhSachNganhTuyenSinh ?? []);
                setdanhSachThongTinKhaiXacNhan(record?.danhSachThongTinKhaiXacNhan ?? []);
                setDanhSachDoiTuong(record?.danhSachDoiTuongTuyenSinh ?? []);
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
              disabled={!deleteAll}
              onConfirm={() => deleteDotTuyenSinhModel(record._id)}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button disabled={!deleteAll} type="primary" shape="circle">
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
      widthDrawer="1000px"
      formType="Drawer"
      otherProps={{ scroll: { x: 1000 } }}
      hascreate={createAll}
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
