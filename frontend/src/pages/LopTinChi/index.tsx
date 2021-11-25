import TableBase from '@/components/Table';
import type { LopTinChi as ILopTinChi } from '@/services/LopTinChi/typings';
import { Select } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const LopTinChi = () => {
  const {
    loading: loadingKyHoc,
    getAllKyHocByHinhThucDaoTaoGiangVienModel,
    getAllKyHocSinhVienModel,
    danhSach,
    record,
    setRecord,
  } = useModel('kyhoc');
  const { setRecord: setRecordLopTinChi } = useModel('loptinchi');
  const {
    loading: loadingLopTinChi,
    getLopTinChiByHocKyModel,
    setDanhSach,
  } = useModel('loptinchi');
  const { getAllHinhThucDaoTaoModel, hinhThucDaoTao, setHinhThucDaoTao, danhSachHinhThucDaoTao } =
    useModel('lophanhchinh');
  const vaiTro = localStorage.getItem('vaiTro');
  const onCell = (loptinchi: ILopTinChi.Record) => ({
    onClick: () => {
      setRecordLopTinChi(loptinchi);
      history.push(`/loptinchi/${loptinchi.id}`);
    },
    style: { cursor: 'pointer' },
  });
  const columns: ColumnProps<ILopTinChi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Mã lớp học',
      dataIndex: 'ma_lop',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Mã học phần',
      dataIndex: 'mon_hoc_ids',
      render: (val) => <div>{val?.[1] ?? ''}</div>,
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Tên học phần',
      dataIndex: 'ten_hoc_phan',
      align: 'center',
      onCell,
    },
  ];

  useEffect(() => {
    if (vaiTro === 'nhan_vien') getAllHinhThucDaoTaoModel();
  }, []);

  useEffect(() => {
    if (vaiTro === 'nhan_vien') getAllKyHocByHinhThucDaoTaoGiangVienModel(hinhThucDaoTao);
    else getAllKyHocSinhVienModel();
  }, [hinhThucDaoTao]);

  const onChangeKyHoc = (value: number) => {
    const kyHoc: KyHoc.Record | undefined = danhSach.find(
      (item: KyHoc.Record) => item.id === value,
    );
    setRecord(kyHoc);
  };

  const onChangeHeDaoTao = (value: number) => {
    setHinhThucDaoTao(value);
    setDanhSach([]);
    setRecord({} as KyHoc.Record);
  };

  return (
    <TableBase
      columns={columns}
      getData={getLopTinChiByHocKyModel}
      loading={loadingKyHoc || loadingLopTinChi}
      params={{ idHocKy: record?.id }}
      dependencies={[record?.id, hinhThucDaoTao]}
      modelName="loptinchi"
      title="Lớp tín chỉ"
    >
      {vaiTro === 'nhan_vien' && (
        <Select
          placeholder="Chọn hệ đào tạo"
          onChange={onChangeHeDaoTao}
          value={hinhThucDaoTao}
          style={{ width: 220, marginBottom: 8, marginRight: 8 }}
        >
          {danhSachHinhThucDaoTao?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item?.display_name ?? ''}
            </Select.Option>
          ))}
        </Select>
      )}
      <Select
        placeholder="Chọn kỳ học"
        onChange={onChangeKyHoc}
        value={record?.id}
        style={{ width: 220, marginBottom: 8 }}
      >
        {danhSach?.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            Kỳ {item.ten_ky_nam_hoc} năm học {item.nam_hoc_id[1]}
          </Select.Option>
        ))}
      </Select>
    </TableBase>
  );
};

export default LopTinChi;
