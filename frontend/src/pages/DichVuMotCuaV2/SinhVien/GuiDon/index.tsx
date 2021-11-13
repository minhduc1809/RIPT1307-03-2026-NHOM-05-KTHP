/* eslint-disable no-underscore-dangle */
import { useModel, history } from 'umi';
import { useEffect } from 'react';
import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import { Button, Card, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const GuiDon = () => {
  const { danhSach, getAllBieuMauModel } = useModel('dichvumotcuav2');

  useEffect(() => {
    getAllBieuMauModel();
  }, []);

  const columns: IColumn<DichVuMotCuaV2.BieuMau>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 120,
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'ten',
      search: 'search',
      align: 'left',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (record: DichVuMotCuaV2.BieuMau) => (
        <Tooltip title="Sử dụng dịch vụ">
          <Button
            onClick={() => {
              history.push(`/dichvumotcuasv/taodon/${record?._id}`);
            }}
            shape="circle"
            type="primary"
            icon={<EditOutlined />}
          />
        </Tooltip>
      ),
    },
  ];
  return (
    <Card title="Dịch vụ một cửa">
      <Table
        otherProps={{ pagination: false }}
        hasTotal
        columns={columns}
        data={danhSach?.map((item, index) => ({ ...item, index: index + 1 }))}
      />
    </Card>
  );
};

export default GuiDon;
