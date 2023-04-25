import rules from '@/utils/rules';
import { Checkbox, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { type TDataOption, type IColumn, type TFilter } from './typing';
import { useEffect, useState } from 'react';
import { EOperatorType, OperatorLabel } from './constant';
import MyDatePicker from '../MyDatePicker';

const RowFilter = (props: {
  index: number;
  columns: IColumn<any>[];
  filter: TFilter<any>;
  onChange: (filter: TFilter<any>) => void;
  fieldsFilterable: any[];
}) => {
  const { index, columns, filter, onChange, fieldsFilterable } = props;
  const [operators, setOperators] = useState<EOperatorType[]>([]);
  const [operatorSelected, setOperatorSelected] = useState<EOperatorType>();
  const filterColumn = columns.find((item) => item.dataIndex === filter.field);
  const filterType = filterColumn?.filterType;

  useEffect(() => {
    let opers: EOperatorType[];
    switch (filterType) {
      case 'string':
        opers = [
          EOperatorType.CONTAIN,
          EOperatorType.NOT_CONTAIN,
          EOperatorType.START_WITH,
          EOperatorType.END_WITH,
          EOperatorType.EQUAL,
          EOperatorType.NOT_EQUAL,
        ];
        break;
      case 'number':
      case 'date':
      case 'datetime':
        opers = [
          EOperatorType.EQUAL,
          EOperatorType.NOT_EQUAL,
          EOperatorType.LESS_THAN,
          EOperatorType.LESS_EQUAL,
          EOperatorType.GREAT_THAN,
          EOperatorType.GREAT_EQUAL,
          EOperatorType.BETWEEN,
          EOperatorType.NOT_BETWEEN,
        ];
        break;
      case 'select':
      case 'customselect':
        opers = [EOperatorType.INCLUDE, EOperatorType.NOT_INCLUDE];
        break;

      default:
        opers = [];
        break;
    }
    setOperators(opers);
    setOperatorSelected(opers.length ? opers[0] : undefined);
  }, [filterType]);

  const renderDataComponent = () => {
    switch (filterType) {
      case 'string':
        return <Input placeholder="Giá trị" />;
      case 'date':
        return <MyDatePicker />;
      case 'datetime':
        return <MyDatePicker format="DD/MM/YYYY HH:mm" showTime />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder="Giá trị" />;
      case 'select':
        return (
          <Select
            options={filterColumn?.filterData?.map((item: string | TDataOption) =>
              typeof item === 'string'
                ? { key: item, value: item, label: item }
                : { key: item.value, value: item.value, label: item.label },
            )}
            mode="multiple"
            optionFilterProp="label"
            showArrow
            showSearch
          />
        );
      case 'customselect':
        return filterColumn?.filterCustomSelect;

      default:
        return <></>;
    }
  };

  return (
    <Space align="center" className="filter-item-space">
      <Form.Item name={['filters', index, 'active']} valuePropName="checked" initialValue={true}>
        <Checkbox />
      </Form.Item>

      <Row gutter={[8, 0]}>
        <Col span={24} md={12}>
          <Form.Item
            name={['filters', index, 'field']}
            rules={[...rules.required]}
            initialValue={filter.field}
          >
            <Select
              options={columns
                .filter(
                  (item) =>
                    fieldsFilterable.includes(item.dataIndex) || item.dataIndex === filter.field,
                )
                .map((item) => ({
                  key: item.dataIndex?.toString() ?? '',
                  value: item.dataIndex?.toString() ?? '',
                  label: item.title,
                }))}
              value={filter.field?.toString()}
              onChange={(val) => {
                const temp = { ...filter };
                temp.field = val?.toString() ?? '';
                temp.operator = undefined;
                onChange(temp);
              }}
              placeholder="Thuộc tính"
            />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item name={['filters', index, 'operator']} rules={[...rules.required]}>
            <Select
              options={operators.map((item) => ({
                key: item,
                value: item,
                label: OperatorLabel[item],
              }))}
              value={operatorSelected}
              onChange={(val) => setOperatorSelected(val)}
              placeholder="Điều kiện"
            />
          </Form.Item>
        </Col>

        <Col
          span={24}
          md={
            operatorSelected === EOperatorType.BETWEEN ||
            operatorSelected === EOperatorType.NOT_BETWEEN
              ? 12
              : 24
          }
        >
          {operatorSelected === EOperatorType.INCLUDE ||
          operatorSelected === EOperatorType.NOT_INCLUDE ? (
            <Form.Item name={['filters', index, 'values']} rules={[...rules.required]}>
              {renderDataComponent()}
            </Form.Item>
          ) : (
            <Form.Item name={['filters', index, 'values', 0]} rules={[...rules.required]}>
              {renderDataComponent()}
            </Form.Item>
          )}
        </Col>
        {operatorSelected === EOperatorType.BETWEEN ||
        operatorSelected === EOperatorType.NOT_BETWEEN ? (
          <Col span={24} md={12}>
            <Form.Item name={['filters', index, 'values', 1]} rules={[...rules.required]}>
              {renderDataComponent()}
            </Form.Item>
          </Col>
        ) : null}
      </Row>
    </Space>
  );
};

export default RowFilter;
