import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Modal, Tag, Tooltip } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useState } from 'react';
import { useModel } from 'umi';
import PriceComponent from '../Price';
import Form from './components/Form';

const ProductComponent = () => {
  const {
    getPageableModel,
    loading,
    page,
    limit,
    condition,
    archiveProductModel,
    unarchiveProductModel,
    setRecord,
  } = useModel('product');

  const [visible, setVisible] = useState<boolean>(false);

  const onMenuClick = (event: MenuInfo, id: string) => {
    const { key } = event;
    if (key === 'archive') {
      archiveProductModel(id);
    } else unarchiveProductModel(id);
  };

  const cancelModalPrice = () => setVisible(false);

  const columns: IColumn<ThanhToan.Product>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      width: 200,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      width: 200,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 200,
      align: 'center',
      render: (val) => (
        <Tag color={val ? 'green' : 'red'}>{val ? 'Kích hoạt' : 'Không kích hoạt'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      render: (record: ThanhToan.Product) => (
        <>
          <Tooltip title="Chi tiết">
            <Button
              onClick={() => {
                setRecord(record);
                setVisible(true);
              }}
              shape="circle"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu selectedKeys={[]} onClick={(event) => onMenuClick(event, record._id)}>
                <Menu.Item key="archive">Lưu trữ</Menu.Item>
                <Menu.Divider />

                <Menu.Item key="unarchive">Bỏ lưu trữ</Menu.Item>
              </Menu>
            }
          >
            <Button type="primary" icon={<DownloadOutlined />} shape="circle" />
          </Dropdown>
        </>
      ),
    },
  ];
  return (
    <>
      <TableBase
        hascreate
        title="Loại lệ phí"
        columns={columns}
        dependencies={[page, limit, condition]}
        loading={loading}
        modelName="product"
        Form={Form}
        getData={() => getPageableModel({ 'metaData.loai': 'Tuyển sinh' })}
      />
      <Modal
        footer={false}
        width={1200}
        destroyOnClose
        onCancel={cancelModalPrice}
        visible={visible}
        bodyStyle={{ padding: 0 }}
      >
        <PriceComponent />
      </Modal>
    </>
  );
};

export default ProductComponent;
