import TableBase from '@/components/Table';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import type { IColumn } from '@/utils/interfaces';
import { Modal } from 'antd';
import { useModel } from 'umi';
import ViewHoSoTrungTuyen from './ViewKetQua';

const TableDanhSachTrungTuyen = (props: {
  idCoSo?: string;
  children?: any;
  paramCondition?: any;
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
  } = useModel('ketquaxettuyen');

  // const { KhoiTaoKetQuaXetTuyenModel, loading: loadingChiTieu } = useModel('chitieu');

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

  // const khoiTaoAll = useCheckAccess('danh-sach-trung-tuyen:khoi-tao-all');

  return (
    <TableBase
      hideCard
      getData={() =>
        getKetQuaXetTuyenPageableModel(
          recordDotTuyenSinh?._id ?? '',
          props?.idCoSo,
          props?.paramCondition,
        )
      }
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
        <ViewHoSoTrungTuyen idCoSo={props.idCoSo} />
      </Modal>
      {props?.children}
    </TableBase>
  );
};

export default TableDanhSachTrungTuyen;
