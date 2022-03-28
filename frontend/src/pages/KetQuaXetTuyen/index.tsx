import TableBase from '@/components/Table';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { EModeKhoiTao } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { Button, Dropdown, Menu, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ViewHoSoTrungTuyen from './components/ViewKetQua';

const KetQuaXetTuyenComponent = () => {
  const {
    page,
    limit,
    condition,
    loading,
    getKetQuaXetTuyenPageableModel,
    setDanhSach,
    setVisibleForm,
    setRecord: setRecordKetQuaXetTuyen,
    visibleForm,
  } = useModel('ketquaxettuyen');

  const { KhoiTaoKetQuaXetTuyenModel, loading: loadingChiTieu } = useModel('chitieu');

  const {
    getAllDotTuyenSinhModel,
    record: recordDotTuyenSinh,
    danhSach: danhSachDot,
    setRecord: setRecordDotTuyenSinh,
  } = useModel('dottuyensinh');

  const {
    getAllHinhThucDaoTaoModel,
    record,
    setRecord,
    danhSach: danhSachHinhThuc,
  } = useModel('hinhthucdaotao');
  const {
    getAllNamTuyenSinhModel,
    record: recordNamTuyenSinh,
    danhSach: danhSachNam,
    setRecord: setRecordNamTuyenSinh,
  } = useModel('namtuyensinh');

  useEffect(() => {
    if (danhSachHinhThuc.length === 0) getAllHinhThucDaoTaoModel();
    return () => {
      setDanhSach([]);
    };
  }, []);

  useEffect(() => {
    if (record?._id && !recordNamTuyenSinh?._id) getAllNamTuyenSinhModel(record?._id);
  }, [record?._id]);

  useEffect(() => {
    if (recordNamTuyenSinh?._id && !recordDotTuyenSinh?._id) {
      getAllDotTuyenSinhModel({ namTuyenSinh: recordNamTuyenSinh?.nam }, true);
    }
  }, [recordNamTuyenSinh?._id]);

  const onCell = (recordKetQua: KetQuaXetTuyen.Record) => ({
    onClick: () => {
      setVisibleForm(true);
      setRecordKetQuaXetTuyen(recordKetQua);
    },
    style: { cursor: 'pointer' },
  });

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
    },
  ];

  return (
    <TableBase
      getData={() => getKetQuaXetTuyenPageableModel(recordDotTuyenSinh?._id ?? '')}
      modelName="ketquaxettuyen"
      title="Danh sách trúng tuyển"
      loading={loading}
      columns={columns}
      dependencies={[
        page,
        limit,
        condition,
        recordDotTuyenSinh?._id,
        recordNamTuyenSinh?._id,
        record?._id,
      ]}
    >
      <Select
        onChange={(val) => {
          setRecordNamTuyenSinh(undefined);
          setRecordDotTuyenSinh(undefined);
          setRecord(danhSachHinhThuc?.find((item) => item._id === val));
        }}
        value={record?._id}
        options={danhSachHinhThuc?.map((item) => ({
          value: item._id,
          label: item.ten,
        }))}
        style={{ width: 120, marginRight: 8 }}
      />
      <Select
        onChange={(val) => {
          setRecordDotTuyenSinh(undefined);
          setRecordNamTuyenSinh(danhSachNam?.find((item) => item.nam === val));
        }}
        value={recordNamTuyenSinh?.nam}
        options={danhSachNam?.map((item) => ({
          value: item.nam,
          label: `Năm tuyển sinh ${item.nam}`,
        }))}
        style={{ width: 180, marginRight: 8 }}
      />
      <Select
        onChange={(val) => setRecordDotTuyenSinh(danhSachDot?.find((item) => item._id === val))}
        value={recordDotTuyenSinh?._id}
        options={danhSachDot?.map((item) => ({
          value: item?._id,
          label: item?.tenDotTuyenSinh,
        }))}
        style={{ width: 300, marginRight: 8 }}
      />
      <Dropdown
        overlay={
          <Menu
            onClick={async (val: any) => {
              await KhoiTaoKetQuaXetTuyenModel(recordDotTuyenSinh?._id ?? '', { mode: val?.key });
              getKetQuaXetTuyenPageableModel(recordDotTuyenSinh?._id ?? '');
            }}
          >
            <Menu.Item key={EModeKhoiTao.SO_LUONG}>Sử dụng chỉ tiêu số lượng</Menu.Item>
            <Menu.Item key={EModeKhoiTao.DIEM_SAN}>Sử dụng chỉ tiêu điểm sàn</Menu.Item>
          </Menu>
        }
        key="ellipsis"
      >
        <Button loading={loadingChiTieu} type="primary">
          Khởi tạo DS Trúng tuyển
        </Button>
      </Dropdown>
      <Modal
        width={1100}
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        bodyStyle={{ padding: 0 }}
        footer={false}
      >
        <ViewHoSoTrungTuyen />
      </Modal>
    </TableBase>
  );
};

export default KetQuaXetTuyenComponent;
