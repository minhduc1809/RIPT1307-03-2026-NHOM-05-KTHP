/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const KhaiBaoSucKhoe = () => {
  const {
    bieuMau,
    getBieuMauKhaiBaoYTeModel,
    getKhaiBaoYTeAdminModel,
    loading,
    page,
    limit,
    setRecord,
    setVisibleForm,
  } = useModel('khaibaosuckhoe');

  useEffect(() => {
    getBieuMauKhaiBaoYTeModel();
  }, []);

  const handleView = (record: KhaiBaoSucKhoe.Record) => {
    setVisibleForm(true);
    setRecord(record);
  };

  const columns: ColumnProps<BieuMau.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Người khai báo',
      dataIndex: 'hoTen',
      align: 'center',
      width: 300,
    },
    {
      title: 'Mã sinh viên/giảng viên',
      dataIndex: 'userId',
      align: 'center',
      width: 200,
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      align: 'center',
      render: (val) => <div>{val === 'sinh_vien' ? 'Sinh viên' : 'Giảng viên'}</div>,
    },
    {
      title: 'Thời gian khai báo',
      dataIndex: 'startedAt',
      align: 'center',
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: ['info', 'anToan'],
      align: 'center',
      render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'An toàn' : 'Không an toàn'}</Tag>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record) => (
        <>
          <Tooltip title="Chi tiết khai báo">
            <Button
              onClick={() => {
                handleView(record);
              }}
              type="primary"
              shape="circle"
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      getData={getKhaiBaoYTeAdminModel}
      loading={loading}
      dependencies={[bieuMau._id, page, limit]}
      modelName="khaibaosuckhoe"
      title="Khai báo sức khỏe"
      formType="Drawer"
      widthDrawer="60%"
      Form={Form}
    ></TableBase>
  );
};

export default KhaiBaoSucKhoe;
