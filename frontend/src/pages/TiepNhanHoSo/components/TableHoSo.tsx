import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableBase from '@/components/Table';
import ThanhToan from '@/components/ThanhToan';
import RaSoatHoSo from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { ETrangThaiHoSo } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import {
  DollarOutlined,
  ExportOutlined,
  LockOutlined,
  PrinterOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Select, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';

const TableHoSo = (props: {
  type?: ETrangThaiHoSo;
  phanQuyen?: {
    thaoTacAll?: boolean;
    duyetAll?: boolean;
    exportAll?: boolean;
  };
}) => {
  const {
    page,
    loading,
    limit,
    condition,
    setVisibleForm,
    adminGetHoSoByIdDotModel,
    adminKhoaHoSoByIdHoSoModel,
    adminMoKhoaHoSoByIdHoSoModel,
    setRecordHoSo,
    adminExportPhieuDangKyModel,
    adminExportHoSoByIdDotModel,
    recordHoSo: recordHS,
    setCondition,
  } = useModel('hosoxettuyen');
  const [visibleThanhToan, setVisibleThanhToan] = useState<boolean>(false);
  const { record: recordDotTuyenSinh } = useModel('dottuyensinh');
  const { record } = useModel('hinhthucdaotao');
  const { record: recordNamTuyenSinh } = useModel('namtuyensinh');

  const khoaHoSo = (recordHoSo: HoSoXetTuyen.Record) => {
    adminKhoaHoSoByIdHoSoModel(recordHoSo._id, recordDotTuyenSinh?._id ?? '', props?.type);
  };

  const onCell = (recordHoSo: HoSoXetTuyen.Record) => ({
    onClick: () => {
      setVisibleForm(true);
      setRecordHoSo(recordHoSo);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<HoSoXetTuyen.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Mã hồ sơ',
      dataIndex: 'maHoSo',
      align: 'center',
      width: 150,
      search: 'search',
      onCell,
    },
    {
      title: 'Trạng thái hồ sơ',
      dataIndex: 'trangThai',
      align: 'center',
      width: 140,
      // search: 'filterString',
      notRegex: true,
      hide: props?.type ? true : false,
      onCell,
    },

    {
      title: 'Họ đệm',
      dataIndex: ['thongTinThiSinh', 'hoDem'],
      align: 'center',
      width: 150,
      search: 'search',
      onCell,
    },
    {
      title: 'Tên',
      dataIndex: ['thongTinThiSinh', 'ten'],
      align: 'center',
      width: 100,
      search: 'search',
      onCell,
    },

    {
      title: 'Số CMND/CCCD',
      dataIndex: ['thongTinThiSinh', 'cmtCccd'],
      align: 'center',
      width: 140,
      search: 'search',
      onCell,
    },
    {
      title: 'Email',
      dataIndex: ['thongTinThiSinh', 'email'],
      align: 'center',
      width: 150,
      search: 'search',
      onCell,
    },
    {
      title: 'Mã thanh toán',
      dataIndex: 'identityCode',
      align: 'center',
      width: 110,
      onCell,
      hide: props?.type === ETrangThaiHoSo.CHUA_KHOA,
      search: 'search',
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'trangThaiThanhToan',
      align: 'center',
      width: 130,
      onCell,
      search: 'filterString',
      notRegex: true,
      hide: props?.type === ETrangThaiHoSo.CHUA_KHOA,
    },
    {
      title: 'Đối tượng tuyển sinh',
      dataIndex: 'maDoiTuong',
      align: 'center',
      width: 300,
      render: (val: string[]) => (
        <div style={{ textAlign: 'left' }}>
          {recordDotTuyenSinh?.danhSachDoiTuongTuyenSinh
            ?.filter((item) => val?.includes(item?.maDoiTuong ?? ''))
            ?.map((item) => (
              <div key={item?.thongTinDoiTuong?._id}>- {item?.thongTinDoiTuong?.tenDoiTuong}</div>
            ))}
        </div>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: ['thongTinThiSinh', 'gioiTinh'],
      align: 'center',
      width: 120,
      columnKey: 'thongTinThiSinh.gioiTinh',
      key: 'thongTinThiSinh.gioiTinh',
      onCell,
      // search: 'filterString',
      notRegex: true,
    },

    {
      title: 'Ngày sinh',
      dataIndex: ['thongTinThiSinh', 'ngaySinh'],
      align: 'center',
      render: (val) =>
        val ? (
          <span title={moment(val).format('DD/MM/YYYY')}>{moment(val).format('DD/MM/YYYY')}</span>
        ) : (
          <div />
        ),
      width: 120,
      onCell,
    },
    {
      title: 'Địa chỉ liên hệ',
      dataIndex: ['thongTinThiSinh', 'diaChiLienHe'],
      align: 'center',
      render: (val: DonViHanhChinh.Record) => {
        return (
          <div>
            {[val?.diaChi, val?.tenXaPhuong, val?.tenQH, val?.tenTP]
              ?.filter((item) => item !== undefined && item !== '')
              ?.join(', ')}
          </div>
        );
      },
      onCell,
      width: 220,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => (
        <span title={moment(val).format('DD/MM/YYYY HH:mm:ss')}>
          {moment(val).format('DD/MM/YYYY')}
        </span>
      ),
      search: 'sort',
      width: 120,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      hide: !props?.phanQuyen?.thaoTacAll ?? true,
      render: (recordHoSo: HoSoXetTuyen.Record) => (
        <>
          {[
            ETrangThaiHoSo.CHUA_KHOA,
            ETrangThaiHoSo.DA_TIEP_NHAN,
            ETrangThaiHoSo.KHONG_TIEP_NHAN,
          ].includes(recordHoSo?.trangThai) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn khóa hồ sơ này"
              onConfirm={() => khoaHoSo(recordHoSo)}
            >
              <Tooltip title="Khóa">
                <Button type="primary" icon={<LockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiHoSo.DA_KHOA].includes(recordHoSo?.trangThai) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn mở khóa hồ sơ này"
              onConfirm={() =>
                adminMoKhoaHoSoByIdHoSoModel(
                  recordHoSo._id,
                  recordDotTuyenSinh?._id ?? '',
                  props.type,
                )
              }
            >
              <Tooltip title="Mở khóa">
                <Button type="primary" icon={<UnlockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiHoSo.DA_KHOA, ETrangThaiHoSo.DA_TIEP_NHAN]?.includes(
            recordHoSo?.trangThai,
          ) && (
            <>
              <Divider type="vertical" />
              <Tooltip title="Thanh toán">
                <Button
                  onClick={() => {
                    setRecordHoSo(recordHoSo);
                    setVisibleThanhToan(true);
                  }}
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
              onClick={() => {
                adminExportPhieuDangKyModel(recordHoSo._id, recordHoSo?.maHoSo);
              }}
              icon={<PrinterOutlined />}
              shape="circle"
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        getData={() => adminGetHoSoByIdDotModel(recordDotTuyenSinh?._id ?? '', props.type)}
        modelName="hosoxettuyen"
        widthDrawer="1100px"
        title={props?.type ? `Hồ sơ ${props?.type}` : 'Tất cả hồ sơ'}
        loading={loading}
        columns={columns}
        Form={RaSoatHoSo}
        maskCloseableForm
        dependencies={[
          page,
          limit,
          condition,
          props.type,
          recordDotTuyenSinh?._id,
          recordNamTuyenSinh?._id,
          record?._id,
        ]}
        otherProps={{ scroll: { x: 1500 } }}
      >
        <FilterDotTuyenSinh />
        <Select
          allowClear
          placeholder="Đối tượng"
          onChange={(val) => setCondition({ ...condition, maDoiTuong: val })}
          value={condition?.maDoiTuong}
          options={recordDotTuyenSinh?.danhSachDoiTuongTuyenSinh?.map((item) => ({
            value: item?.thongTinDoiTuong?.maDoiTuong,
            label: item?.thongTinDoiTuong?.tenDoiTuong,
          }))}
          style={{ width: 250 }}
        />
        <Button
          disabled={!props?.phanQuyen?.exportAll ?? true}
          loading={loading}
          onClick={() => adminExportHoSoByIdDotModel(recordDotTuyenSinh?._id ?? '', props.type)}
          style={{ marginLeft: 8 }}
          icon={<ExportOutlined />}
          type="primary"
        >
          Xuất DS
        </Button>
      </TableBase>
      <Modal
        destroyOnClose
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleThanhToan(false);
              setRecordHoSo(undefined);
            }}
          >
            OK
          </Button>
        }
        width="1000px"
        onCancel={() => {
          setVisibleThanhToan(false);
          setRecordHoSo(undefined);
        }}
        visible={visibleThanhToan}
      >
        <ThanhToan record={recordHS} />
      </Modal>
    </>
  );
};

export default TableHoSo;
