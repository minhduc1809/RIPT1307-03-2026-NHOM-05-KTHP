import { PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Modal, Table } from 'antd';
import { useModel } from 'umi';
import { type IColumn } from './typing';

const TableLocalData = (props: {
  otherProps?: TableProps<any>;
  modelName: any;
  fieldName: string;
  columns: IColumn<any>[];
  Form?: React.FC;
  hasCreateButton?: boolean;
  addNewButton?: string;
}) => {
  const { modelName, fieldName, columns, Form } = props;
  const model = useModel(modelName);
  const danhSach: any[] = model[`danhSach${fieldName}`];
  const setEdit = model[`setEdit${fieldName}`];
  const visibleForm = model[`visibleForm${fieldName}`];
  const setVisibleForm = model[`setVisibleForm${fieldName}`];
  const setRecord = model[`setRecord${fieldName}`];

  return (
    <div>
      {props.hasCreateButton && (
        <Button
          size="small"
          icon={<PlusOutlined />}
          style={{ marginBottom: 8 }}
          type="primary"
          onClick={() => {
            setVisibleForm(true);
            setEdit(false);
            setRecord(undefined);
          }}
        >
          {props.addNewButton ?? 'Thêm mới'}
        </Button>
      )}
      <Table
        scroll={{ x: 1000 }}
        columns={columns.filter((item) => item.hide !== true) as any[]}
        dataSource={danhSach.map((item, index) => ({ ...item, index: index + 1 }))}
        bordered
        {...props?.otherProps}
      />
      {Form && (
        <Modal
          destroyOnClose
          visible={visibleForm}
          onCancel={() => {
            setVisibleForm(false);
          }}
          footer={false}
          bodyStyle={{ padding: 0 }}
        >
          <Form />
        </Modal>
      )}
    </div>
  );
};

export default TableLocalData;
