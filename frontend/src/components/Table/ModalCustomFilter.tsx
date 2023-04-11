import { CloseOutlined, FilterFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import RowFilter from './RowFilter';
import { type IColumn, type TFilter } from './typing';

const ModalCustomFilter = (props: {
  visible: boolean;
  setVisible: any;
  columns: IColumn<any>[];
  filters: TFilter<any>[];
  setFilters: any;
}) => {
  const { visible, setVisible, columns, filters, setFilters } = props;
  const [filtersTemp, setFiltersTemp] = useState(filters ?? []);
  const [form] = Form.useForm();
  const fieldsFiltered = filtersTemp.map((item) => item.field);
  const fieldsFilterable = columns
    .filter(
      (item) =>
        item.filterType &&
        item.dataIndex &&
        typeof item.dataIndex === 'string' &&
        !fieldsFiltered.includes(item.dataIndex),
    )
    .map((item) => item.dataIndex);

  useEffect(() => {
    setFiltersTemp(filters ?? []);
  }, [filters]);

  const onFinish = (values: any) => {
    const filtered = values.filters
      ?.filter((filter: TFilter<any>) => filter.values && Array.isArray(filter.values))
      ?.map((filter: TFilter<any>) =>
        Array.isArray(filter.values[0]) ? { ...filter, values: filter.values[0] } : filter,
      );
    setFilters(filtered);
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      title="Bộ lọc tùy chỉnh"
    >
      <p>Các điều kiện lọc đang được áp dụng:</p>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {filtersTemp.map((filter, index) => (
          <RowFilter
            index={index}
            columns={columns}
            key={filter.field.toString()}
            filter={filter}
            fieldsFilterable={fieldsFilterable}
            onChange={(fil) => {
              const temp = [...filtersTemp];
              temp[index] = fil;
              setFiltersTemp(temp);
            }}
          />
        ))}

        <Form.Item>
          <Button
            block
            type="dashed"
            disabled={!fieldsFilterable.length}
            icon={<PlusOutlined />}
            onClick={() => {
              setFiltersTemp([
                ...filtersTemp,
                {
                  active: true,
                  field: fieldsFilterable[0]?.toString() ?? '',
                  values: [],
                },
              ]);
            }}
          >
            Thêm điều kiện lọc
          </Button>
        </Form.Item>

        <Space size={8} wrap style={{ marginTop: 24, justifyContent: 'center', width: '100%' }}>
          <Button htmlType="submit" type="primary" icon={<FilterFilled />}>
            Áp dụng bộ lọc
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => {
              setFilters(undefined);
              setFiltersTemp([]);
              setVisible(false);
              form.resetFields();
            }}
          >
            Bỏ lọc
          </Button>
          <Button onClick={() => setVisible(false)}>Đóng</Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default ModalCustomFilter;
