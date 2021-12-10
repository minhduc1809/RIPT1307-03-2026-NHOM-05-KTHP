import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { getDataLopHanhChinh } from '@/services/LopHanhChinh/lophanhchinh';
import { useEffect, useState } from 'react';
import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import { Card, Select } from 'antd';
import { useModel, history } from 'umi';

const DanhSachLopHanhChinhGiangVien = () => {
  const {
    setRecord,
    getAllHinhThucDaoTaoModel,
    hinhThucDaoTao,
    setHinhThucDaoTao,
    danhSachHinhThucDaoTao,
  } = useModel('lophanhchinh');
  const [dataLopHanhChinh, setdataLopHanhChinh] = useState<APILopHanhChinh.Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getAllHinhThucDaoTaoModel();
  }, []);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const res = await getDataLopHanhChinh(
        'can-bo',
        hinhThucDaoTao !== -1 ? hinhThucDaoTao : undefined,
      );
      setdataLopHanhChinh(res?.data?.data ?? []);
    };
    getData();
    setLoading(false);
  }, [hinhThucDaoTao]);

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
    <Card loading={loading} title="Lớp hành chính">
      <Table
        hasTotal
        columns={columns}
        data={dataLopHanhChinh?.map((item, index) => ({ ...item, index: index + 1 }))}
      >
        <Select
          value={hinhThucDaoTao}
          onChange={(val: number) => {
            setHinhThucDaoTao(val);
          }}
          style={{ marginBottom: 8, width: 250, marginRight: 8 }}
        >
          <Select.Option value={-1} key={-1}>
            Tất cả hình thức đào tạo
          </Select.Option>
          {danhSachHinhThucDaoTao?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.ten_hinh_thuc_dao_tao}
            </Select.Option>
          ))}
        </Select>
      </Table>
    </Card>
  );
};

export default DanhSachLopHanhChinhGiangVien;
