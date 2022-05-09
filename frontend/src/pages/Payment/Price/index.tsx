import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Tag } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useModel } from 'umi';
import Form from './components/Form';

const PriceComponent = () => {
  const { getModel, loading, page, limit, condition, archivePriceModel, unarchivePriceModel } =
    useModel('price');

  const { record: recordProduct } = useModel('product');

  const onMenuClick = (event: MenuInfo, id: string) => {
    const { key } = event;
    if (key === 'archive') {
      archivePriceModel(id);
    } else unarchivePriceModel(id);
  };

  const columns: IColumn<ThanhToan.Price>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      width: 200,
      align: 'center',
    },
    {
      title: 'Giá',
      dataIndex: 'unitAmount',
      width: 200,
      align: 'center',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'currency',
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
      width: 80,
      align: 'center',
      render: (record: ThanhToan.Price) => (
        <>
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
    <TableBase
      hascreate
      title="Danh sách mức giá"
      columns={columns}
      dependencies={[page, limit, condition, recordProduct?._id]}
      loading={loading}
      modelName="price"
      Form={Form}
      getData={() => getModel({ product: recordProduct?._id }, 'pageable')}
    />
  );
};

export default PriceComponent;
