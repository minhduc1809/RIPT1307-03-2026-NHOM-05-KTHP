import TableBase from '@/components/Table';
import RaSoatHoSoNhapHoc from '@/pages/HoSoThiSinh/NhapHoc/RaSoatHoSo';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { ETrangThaiNhapHoc } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DollarOutlined, LockOutlined, PrinterOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import ViewHoSoTrungTuyen from './ViewKetQua';

const TableDanhSachTrungTuyen = (props: {
  idCoSo?: string;
  children?: any;
  paramCondition?: any;
  hideTrangThai?: boolean;
  hideThaoTac?: boolean;
  type: 'nhaphoc' | 'xacnhannhaphoc';
}) => {
  const {
    page,
    limit,
    condition,
    loading,
    getKetQuaXetTuyenPageableModel,
    setVisibleForm,
    setRecord: setRecordKetQuaXetTuyen,
    visibleForm,
    adminTiepNhanHoSoNhapHocModel,
  } = useModel('ketquaxettuyen');

  const { record: recordDotTuyenSinh } = useModel('dottuyensinh');

  const { record } = useModel('hinhthucdaotao');
  const { record: recordNamTuyenSinh } = useModel('namtuyensinh');
  const { adminGetHuongDanNhapHocByKetQuaXetTuyenModel } = useModel('huongdannhaphoc');

  const onCell = (recordKetQua: KetQuaXetTuyen.Record) => ({
    onClick: async () => {
      // if (recordKetQua.trangThaiNhapHoc !== ETrangThaiNhapHoc.CHUA_KHOA)
      await adminGetHuongDanNhapHocByKetQuaXetTuyenModel(recordKetQua._id);
      setVisibleForm(true);
      setRecordKetQuaXetTuyen(recordKetQua);
    },
    style: { cursor: 'pointer' },
  });

  const getData = () =>
    getKetQuaXetTuyenPageableModel(
      recordDotTuyenSinh?._id ?? '',
      props?.idCoSo,
      props?.paramCondition,
    );

  const columns: IColumn<KetQuaXetTuyen.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
      onCell,
    },
    {
      title: 'Mã hồ sơ',
      dataIndex: 'maHoSo',
      width: 100,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Họ đệm',
      dataIndex: ['thongTinThiSinh', 'hoDem'],
      width: 100,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Tên',
      dataIndex: ['thongTinThiSinh', 'ten'],
      width: 100,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Trạng thái',
      dataIndex: ['thongTinXacNhanNhapHoc', 'trangThaiXacNhan'],
      width: 150,
      columnKey: 'thongTinXacNhanNhapHoc.trangThaiXacNhan',
      key: 'thongTinXacNhanNhapHoc.trangThaiXacNhan',
      align: 'center',
      search: 'filterString',
      notRegex: true,
      onCell,
      hide: props.hideTrangThai,
    },
    {
      title: 'Cơ sở đào tạo',
      dataIndex: ['nguyenVongTrungTuyen', 'tenCoSoDaoTao'],
      width: 200,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      hide: props.hideThaoTac,
      render: (recordHoSo: KetQuaXetTuyen.Record) => (
        <>
          {[
            ETrangThaiNhapHoc.CHUA_KHOA,
            ETrangThaiNhapHoc.DA_TIEP_NHAN,
            ETrangThaiNhapHoc.YEU_CAU_CHINH_SUA,
          ].includes(recordHoSo?.trangThaiNhapHoc) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn khóa hồ sơ này"
              onConfirm={() =>
                adminTiepNhanHoSoNhapHocModel(
                  recordDotTuyenSinh?._id ?? '',
                  recordHoSo._id,
                  {
                    trangThaiNhapHoc: ETrangThaiNhapHoc.DA_KHOA,
                  },
                  getData,
                )
              }
            >
              <Tooltip title="Khóa">
                <Button type="primary" icon={<LockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiNhapHoc.DA_KHOA].includes(recordHoSo?.trangThaiNhapHoc) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn mở khóa hồ sơ này"
              onConfirm={() =>
                adminTiepNhanHoSoNhapHocModel(
                  recordDotTuyenSinh?._id ?? '',
                  recordHoSo._id,
                  {
                    trangThaiNhapHoc: ETrangThaiNhapHoc.CHUA_KHOA,
                  },
                  getData,
                )
              }
            >
              <Tooltip title="Mở khóa">
                <Button type="primary" icon={<UnlockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiNhapHoc.DA_KHOA, ETrangThaiNhapHoc.DA_TIEP_NHAN]?.includes(
            recordHoSo?.trangThaiNhapHoc,
          ) && (
            <>
              <Divider type="vertical" />
              <Tooltip title="Thanh toán">
                <Button
                  // onClick={() => {
                  //   setRecordHoSo(recordHoSo);
                  //   setVisibleThanhToan(true);
                  // }}
                  type="primary"
                  icon={<DollarOutlined />}
                  shape="circle"
                />
              </Tooltip>
            </>
          )}

          <Divider type="vertical" />
          <Tooltip title="In hồ sơ">
            <Button
              // onClick={() => {
              //   adminExportPhieuDangKyModel(recordHoSo._id, recordHoSo?.maHoSo);
              // }}
              icon={<PrinterOutlined />}
              shape="circle"
            />
          </Tooltip>
        </>
      ),
    },
  ];

  // const khoiTaoAll = useCheckAccess('danh-sach-trung-tuyen:khoi-tao-all');

  return (
    <TableBase
      hideCard
      getData={getData}
      modelName="ketquaxettuyen"
      loading={loading}
      columns={columns}
      dependencies={[
        page,
        limit,
        condition,
        recordDotTuyenSinh?._id,
        recordNamTuyenSinh?._id,
        record?._id,
        props.idCoSo,
      ]}
    >
      <Modal
        width={1100}
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        bodyStyle={{ padding: 0 }}
        footer={false}
      >
        {props.type === 'nhaphoc' ? (
          <RaSoatHoSoNhapHoc />
        ) : (
          <ViewHoSoTrungTuyen idCoSo={props.idCoSo} />
        )}
      </Modal>
      {props?.children}
    </TableBase>
  );
};

export default TableDanhSachTrungTuyen;
