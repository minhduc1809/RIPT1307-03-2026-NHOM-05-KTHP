import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Switch, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import PriceComponent from '../Price';
import Form from './components/Form';

const ProductComponent = () => {
  const {
    getModel,
    loading,
    page,
    limit,
    condition,
    archiveProductModel,
    unarchiveProductModel,
    setRecord,
  } = useModel('product');

  const [visible, setVisible] = useState<boolean>(false);

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
      title: 'Hình thức',
      dataIndex: ['metaData', 'hinhThuc'],
      width: 200,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 200,
      align: 'center',
      render: (val, record) => (
        <Switch
          onChange={(checked: boolean) => {
            if (checked) unarchiveProductModel(record._id);
            else archiveProductModel(record._id);
          }}
          checked={val}
          checkedChildren={'Kích hoạt'}
          unCheckedChildren={'Kích hoạt'}
          defaultChecked
        />
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
        getData={() => getModel({ 'metaData.loai': 'Tuyển sinh' }, 'pageable')}
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
