import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
// import { EyeOutlined } from '@ant-design/icons';
// import { Button, Divider, Modal, Tooltip, Typography } from 'antd';
import { useModel } from 'umi';
// import Form from './components/Form';
import { useEffect } from 'react';
import CreateEmail from './components/index';
import moment from 'moment';

const Index = () => {
  const { getEmailPageableModel, loading, page, condition, limit, dataTable } =
    useModel('sendemail');
  // console.log(danhSach)

  useEffect(() => {
    getEmailPageableModel();
  }, [dataTable]);

  const columns: IColumn<SendEmail.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: 'Người nhận',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      align: 'center',
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'ngaySend',
      align: 'center',
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
    },
  ];
  return (
    <div>
      <TableBase
        widthDrawer="700px"
        hascreate
        formType="Drawer"
        getData={getEmailPageableModel}
        modelName="sendemail"
        title="Quản lý email"
        loading={loading}
        columns={columns}
        dependencies={[page, limit, condition]}
        // dataState="danhSach"
        Form={CreateEmail}
      />
    </div>
  );
};

export default Index;
