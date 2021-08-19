import { useModel, history } from 'umi';
import TableBase from '@/components/Table';
import type { ColumnProps } from 'antd/lib/table';
import { Select } from 'antd';
import { useEffect } from 'react';
import type { LopTinChi as ILopTinChi } from '@/services/LopTinChi/typings';

const LopTinChi = () => {
  const {
    loading: loadingKyHoc,
    getAllKyHocModel,
    danhSach,
    record,
    setRecord,
  } = useModel('kyhoc');
  const { setRecord: setRecordLopTinChi } = useModel('loptinchi');
  const { loading: loadingLopTinChi, getLopTinChiByHocKyModel } = useModel('loptinchi');
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
      dataIndex: 'ma_hoc_phan',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Môn',
      dataIndex: 'mon_hoc_ids',
      align: 'center',
      render: (val) => <div>{val?.[1] ?? ''}</div>,
      onCell,
    },
  ];

  useEffect(() => {
    getAllKyHocModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeKyHoc = (value: number) => {
    const kyHoc: KyHoc.Record | undefined = danhSach.find(
      (item: KyHoc.Record) => item.id === value,
    );
    setRecord(kyHoc);
  };

  return (
    <TableBase
      columns={columns}
      getData={getLopTinChiByHocKyModel}
      loading={loadingKyHoc || loadingLopTinChi}
      params={{ idHocKy: record?.id }}
      dependencies={[record?.id]}
      modelName="loptinchi"
      title="Lớp tín chỉ"
    >
      <Select onChange={onChangeKyHoc} value={record?.id} style={{ width: 220, marginBottom: 8 }}>
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
