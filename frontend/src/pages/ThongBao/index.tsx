import { useModel } from 'umi';
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { Button, Modal, Select, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ViewThongBao from './components/ViewThongBao';
import Form from './components/Form';

const ThongBao = () => {
  const { getThongBaoAdminModel, page, limit, loading, condition, loaiThongBao, setLoaiThongBao } =
    useModel('thongbao');
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<ThongBao.Record>();
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
      title: 'Người gửi',
      dataIndex: 'senderName',
      align: 'center',
      width: 200,
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
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      align: 'center',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (recordThongBao) => (
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
      ),
    },
  ];
  return (
    <>
      <TableBase
        title="Thông báo"
        columns={columns}
        modelName="thongbao"
        loading={loading}
        hascreate
        Form={Form}
        widthDrawer="60%"
        formType="Drawer"
        getData={getThongBaoAdminModel}
        dependencies={[page, limit, condition, loaiThongBao]}
      >
        <Select
          onChange={(val: string) => {
            setLoaiThongBao(val);
          }}
          style={{ width: 200, marginRight: 8, marginBottom: 8 }}
          value={loaiThongBao}
        >
          {[
            { value: 'TAT_CA', label: 'Chung' },
            { value: 'DON_VI', label: 'Gửi tới đơn vị cụ thể' },
            { value: 'VAI_TRO', label: 'Gửi theo vai trò' },
            { value: 'TAI_KHOAN', label: 'Gửi tới tài khoản cụ thể' },
          ].map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      </TableBase>
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
