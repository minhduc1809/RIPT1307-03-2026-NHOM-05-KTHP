import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { Switch } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const PriceComponent = () => {
  const { getModel, loading, page, limit, condition, archivePriceModel, unarchivePriceModel } =
    useModel('price');

  const { record: recordProduct } = useModel('product');

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
      render: (val) => <div>{currencyFormat(val)}</div>,
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
      render: (val, record) => (
        <Switch
          onChange={(checked: boolean) => {
            if (checked) unarchivePriceModel(record._id);
            else archivePriceModel(record._id);
          }}
          checked={val}
          checkedChildren={'Kích hoạt'}
          unCheckedChildren={'Kích hoạt'}
          defaultChecked
        />
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
