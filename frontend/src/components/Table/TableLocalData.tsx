import { PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Modal, Table } from 'antd';
import _ from 'lodash';
import { useModel } from 'umi';
import { type IColumn } from './typing';

const TableLocalData = (props: {
  otherProps?: TableProps<any>;
  modelName: any;
  fieldName: string;
  columns: IColumn<any>[];
  Form?: React.FC;
  hasCreateButton?: boolean;
  addNewTitle?: string;
  addStt?: boolean;
  scroll?: number;
}) => {
  const { modelName, fieldName, columns, Form, scroll, addStt } = props;
  const model = useModel(modelName);
  const danhSach: any[] = model[`danhSach${fieldName}`];
  const visibleForm = model[`visibleForm${fieldName}`];
  const setVisibleForm = model[`setVisibleForm${fieldName}`];
  const setIndex = model[`setIndex${fieldName}`];

  const finalColumns = columns?.filter((item) => item?.hide !== true);
  if (addStt !== false)
    finalColumns.unshift({
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    });

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
            setIndex(undefined);
          }}
        >
          {props.addNewTitle ?? 'Thêm mới'}
        </Button>
      )}

      <Table
        size="small"
        scroll={{ x: scroll ?? _.sum(finalColumns.map((item) => item.width ?? 80)) }}
        columns={finalColumns as any[]}
        dataSource={danhSach?.map((item, index) => ({ ...item, index: index + 1 }))}
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
