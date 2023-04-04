import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewThongBao from './components/ViewThongBao';

const ThongBao = () => {
  const {
    getThongBaoAdminModel,
    page,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    deleteThongBaoModel,
    setRecord,
    record,
    phamVi,
  } = useModel('thongbao');
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
      title: 'Người gửi',
      dataIndex: 'senderName',
      align: 'center',
      width: 150,
      search: 'search',
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
              disabled={!canUpdate}
              onClick={() => {
                setRecord(recordThongBao);
                setEdit(true);
                setVisibleForm(true);
              }}
              shape="circle"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              disabled={!canDelete}
              onConfirm={() => {
                deleteThongBaoModel(recordThongBao._id);
              }}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button
                disabled={!canDelete}
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
        modelName="thongbao"
        widthDrawer={800}
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
