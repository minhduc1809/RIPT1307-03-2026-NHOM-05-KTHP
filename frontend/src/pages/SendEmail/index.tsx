import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { useModel } from 'umi';
import { useEffect } from 'react';
import CreateEmail from './components/index';
import moment from 'moment';
import { useCheckAccess } from '@/utils/utils';
import { Typography } from 'antd';

const Index = () => {
  const createAll = useCheckAccess('email:create-all');

  const { getEmailPageableModel, loading, page, condition, limit, dataTable } =
    useModel('sendemail');

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
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          <div dangerouslySetInnerHTML={{ __html: val }} />
        </Typography.Paragraph>
      ),
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
        hascreate={createAll}
        formType="Drawer"
        getData={getEmailPageableModel}
        modelName="sendemail"
        title="Quản lý email"
        loading={loading}
        columns={columns}
        dependencies={[page, limit, condition]}
        Form={CreateEmail}
      />
    </div>
  );
};

export default Index;
