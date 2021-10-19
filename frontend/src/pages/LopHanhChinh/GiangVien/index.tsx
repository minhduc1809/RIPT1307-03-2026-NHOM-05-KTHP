import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { getDataLopHanhChinh } from '@/services/LopHanhChinh/lophanhchinh';
import { useEffect, useState } from 'react';
import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import { Card } from 'antd';
import { useModel, history } from 'umi';

const DanhSachLopHanhChinhGiangVien = () => {
  const { setRecord } = useModel('lophanhchinh');
  const [dataLopHanhChinh, setdataLopHanhChinh] = useState<APILopHanhChinh.Data[]>([]);
  useEffect(() => {
    const getData = async () => {
      const res = await getDataLopHanhChinh('giang-vien');
      setdataLopHanhChinh(res?.data?.data ?? []);
    };
    getData();
  }, []);

  const onCell = (lophanhchinh: APILopHanhChinh.Data) => ({
    onClick: () => {
      setRecord(lophanhchinh);
      history.push(`/lophanhchinhgiangvien/${lophanhchinh.id}`);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<APILopHanhChinh.Data>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Lớp',
      dataIndex: 'ten_lop_hanh_chinh',
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Ngành',
      align: 'center',
      dataIndex: 'nganh',
      render: (val: (number | string)[]) => <div>{val?.[1] ?? ''}</div>,
      search: 'search',
      onCell,
    },
    {
      title: 'Sĩ số',
      align: 'center',
      dataIndex: 'si_so',
      width: 150,
      onCell,
    },
  ];

  return (
    <Card title="Lớp hành chính">
      <Table
        columns={columns}
        data={dataLopHanhChinh?.map((item, index) => ({ ...item, index: index + 1 }))}
      />
    </Card>
  );
};

export default DanhSachLopHanhChinhGiangVien;
