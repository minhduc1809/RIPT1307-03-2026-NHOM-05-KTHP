/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const KhaiBaoSucKhoe = () => {
  const vaiTro = localStorage.getItem('vaiTro');
  const {
    bieuMau,
    getBieuMauKhaiBaoYTeModel,
    getKhaiBaoYTeAdminModel,
    loading,
    page,
    limit,
    condition,
    setRecord,
    setVisibleForm,
    getLichSuKhaiBaoUserModel,
  } = useModel('khaibaosuckhoe');

  useEffect(() => {
    if (vaiTro === 'Admin') getBieuMauKhaiBaoYTeModel();
  }, []);

  const handleView = (record: KhaiBaoSucKhoe.Record) => {
    setVisibleForm(true);
    setRecord(record);
  };

  let titleColumn = 'Mã sinh viên/giảng viên';
  if (vaiTro === 'sinh_vien') titleColumn = 'Mã sinh viên';
  else if (vaiTro === 'giang_vien') titleColumn = 'Mã giảng viên';

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
      search: vaiTro === 'Admin' ? 'search' : undefined,
      align: 'center',
      width: 200,
    },
    {
      title: titleColumn,
      dataIndex: 'userCode',
      align: 'center',
      width: 200,
      search: vaiTro === 'Admin' ? 'search' : undefined,
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      align: 'center',
      search: vaiTro === 'Admin' ? 'filterString' : undefined,
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
      getData={vaiTro === 'Admin' ? getKhaiBaoYTeAdminModel : getLichSuKhaiBaoUserModel}
      loading={loading}
      dependencies={[bieuMau._id, page, limit, condition]}
      modelName="khaibaosuckhoe"
      title="Khai báo sức khỏe"
      formType="Drawer"
      widthDrawer="60%"
      Form={Form}
    ></TableBase>
  );
};

export default KhaiBaoSucKhoe;
