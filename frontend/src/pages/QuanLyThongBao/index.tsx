import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewThongBao from './components/ViewThongBao';

const ThongBao = () => {
  const createAll = useCheckAccess('thong-bao:create-all');

  const { getThongBaoAdminModel, page, limit, loading, condition, setRecord, record, phamVi } =
    useModel('quanlythongbao');
  const [visible, setVisible] = useState<boolean>(false);

  const onCell = (recordThongBao: ThongBao.Record) => ({
    onClick: () => {
      setVisible(true);
      setRecord(recordThongBao);
    },
    style: { cursor: 'pointer' },
  });
  const columns: IColumn<ThongBao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      align: 'center',
      width: 200,
      search: 'search',
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Nội dung HTML',
      dataIndex: 'htmlContent',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          <div dangerouslySetInnerHTML={{ __html: val }} />
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (recordThongBao: ThongBao.Record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button
              onClick={() => {
                setRecord(recordThongBao);
                setVisible(true);
              }}
              shape="circle"
              type="primary"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          {/* <Tooltip title="Sửa">
                        <Button
                            disabled
                            onClick={() => {
                                setRecord(recordThongBao);
                                setEdit(true);
                                setVisibleForm(true);
                            }}
                            shape="circle"
                            icon={<EditOutlined />}
                        />
                    </Tooltip> */}
          {/* <Divider type="vertical" />
                    <Tooltip title="Xóa" >
                        <Popconfirm

                            onConfirm={() => {
                                deleteThongBaoModel(recordThongBao._id);
                            }}
                            title="Bạn có chắc chắn muốn xóa?"
                        >
                            <Button
                                disabled
                                shape="circle"
                                type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip> */}
        </>
      ),
    },
  ];
  return (
    <>
      <TableBase
        title="Quản lý thông báo"
        columns={columns}
        modelName="quanlythongbao"
        loading={loading}
        hascreate={createAll}
        Form={Form}
        widthDrawer="50%"
        formType="Drawer"
        getData={getThongBaoAdminModel}
        dependencies={[page, limit, condition, phamVi]}
      />
      <Modal
        width="80%"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button type="primary" onClick={() => setVisible(false)}>
            OK
          </Button>
        }
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Chi tiết thông báo"
      >
        <ViewThongBao record={record} />
      </Modal>
    </>
  );
};

export default ThongBao;
