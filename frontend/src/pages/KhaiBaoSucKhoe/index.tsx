/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useAccess, useModel } from 'umi';
import Form from './components/Form';

const KhaiBaoSucKhoe = () => {
  const access = useAccess();
  const {
    bieuMau,
    loading,
    page,
    limit,
    condition,
    setRecord,
    setVisibleForm,
    getLichSuKhaiBaoUserModel,
  } = useModel('khaibaosuckhoe');

  const handleView = (record: KhaiBaoSucKhoe.Record) => {
    setVisibleForm(true);
    setRecord(record);
  };

  let titleColumn = 'Mã sinh viên/giảng viên';
  if (access.sinhVien) titleColumn = 'Mã sinh viên';
  else if (access.nhanVien) titleColumn = 'Mã giảng viên';

  const columns: IColumn<BieuMau.Record>[] = [
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
      width: 200,
    },
    {
      title: titleColumn,
      dataIndex: 'userCode',
      align: 'center',
      width: 200,
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      align: 'center',

      render: (val) => <div>{val === 'sinh_vien' ? 'Sinh viên' : 'Cán bộ, giảng viên'}</div>,
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
      search: 'filter',
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
      getData={getLichSuKhaiBaoUserModel}
      loading={loading}
      dependencies={[bieuMau?._id, page, limit, condition]}
      modelName="khaibaosuckhoe"
      title="Lịch sử khai báo y tế"
      formType="Drawer"
      widthDrawer="60%"
      Form={Form}
    />
  );
};

export default KhaiBaoSucKhoe;
