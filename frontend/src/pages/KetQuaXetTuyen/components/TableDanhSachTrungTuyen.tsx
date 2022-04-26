import TableBase from '@/components/Table';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { EModeKhoiTao } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import { CheckSquareOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { useModel } from 'umi';
import ViewHoSoTrungTuyen from './ViewKetQua';

const TableDanhSachTrungTuyen = (props: { idCoSo?: string }) => {
  const {
    page,
    limit,
    condition,
    loading,
    getKetQuaXetTuyenPageableModel,
    setVisibleForm,
    setRecord: setRecordKetQuaXetTuyen,
    visibleForm,
  } = useModel('ketquaxettuyen');

  const { KhoiTaoKetQuaXetTuyenModel, loading: loadingChiTieu } = useModel('chitieu');

  const { record: recordDotTuyenSinh } = useModel('dottuyensinh');

  const { record } = useModel('hinhthucdaotao');
  const { record: recordNamTuyenSinh } = useModel('namtuyensinh');

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

  const khoiTaoAll = useCheckAccess('danh-sach-trung-tuyen:khoi-tao-all');

  return (
    <TableBase
      hideCard
      getData={() => getKetQuaXetTuyenPageableModel(recordDotTuyenSinh?._id ?? '', props?.idCoSo)}
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
      {khoiTaoAll && recordDotTuyenSinh?.choPhepGiaLapTheoCoSo === true && (
        <Dropdown
          overlay={
            <Menu
              onClick={async (val: any) => {
                await KhoiTaoKetQuaXetTuyenModel(recordDotTuyenSinh?._id ?? '', {
                  mode: val?.key,
                  idCoSoDaoTao: props.idCoSo,
                });
                getKetQuaXetTuyenPageableModel(recordDotTuyenSinh?._id ?? '', props.idCoSo);
              }}
            >
              <Menu.Item key={EModeKhoiTao.SO_LUONG}>Sử dụng chỉ tiêu số lượng</Menu.Item>
              <Menu.Item key={EModeKhoiTao.DIEM_SAN}>Sử dụng chỉ tiêu điểm sàn</Menu.Item>
            </Menu>
          }
          key="ellipsis"
        >
          <Button icon={<CheckSquareOutlined />} loading={loadingChiTieu} type="primary">
            Khởi tạo DS Trúng tuyển
          </Button>
        </Dropdown>
      )}
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

export default TableDanhSachTrungTuyen;
