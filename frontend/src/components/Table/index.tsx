import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Card, Drawer, Modal, Table } from 'antd';
import type { PaginationProps } from 'antd/es/pagination';
import type { ColumnProps } from 'antd/lib/table';
import { useEffect } from 'react';
import { useModel } from 'umi';

type Props = {
  modelName: any;
  Form?: React.FC;
  formType?: 'Modal' | 'Drawer';
  columns: ColumnProps<any>[];
  title?: React.ReactNode;
  widthDrawer?: string | number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getData: Function;
  dependencies?: any[];
  loading: boolean;
  params?: any;
  children?: React.ReactNode;
  border?: boolean;
  scroll?: { x?: number; y?: number };
  hascreate?: boolean;
};

const TableBase = (props: Props) => {
  const {
    modelName,
    Form,
    columns,
    title,
    getData,
    dependencies = [],
    formType,
    loading,
    children,
    params,
    border,
    scroll,
    hascreate,
    widthDrawer,
  } = props;
  const {
    danhSach,
    visibleForm,
    setVisibleForm,
    total,
    page,
    limit,
    setPage,
    setLimit,
    setEdit,
    setRecord,
  } = useModel(modelName);
  useEffect(() => {
    getData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  const handleTableChange = (pagination: PaginationProps) => {
    setPage(pagination?.current ?? 1);
    setLimit(pagination?.pageSize ?? 10);
  };

  return (
    <Card title={title || false}>
      {children}
      {hascreate && (
        <Button
          onClick={() => {
            setVisibleForm(true);
            setEdit(false);
            setRecord({});
          }}
          icon={<PlusCircleFilled />}
          type="primary"
        >
          Thêm mới
        </Button>
      )}
      <Table
        scroll={scroll}
        loading={loading}
        bordered={border || false}
        pagination={{
          current: page,
          pageSize: limit,
          position: ['bottomRight'],
          total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50', '100'],
          showTotal: (tongSo: number) => {
            return <div>Tổng số: {tongSo}</div>;
          },
        }}
        onChange={handleTableChange}
        dataSource={danhSach?.map((item: any, index: number) => {
          return { ...item, index: index + 1 + (page - 1) * limit, key: index };
        })}
        columns={columns}
      ></Table>
      {Form && (
        <>
          {formType === 'Drawer' ? (
            <Drawer
              width={widthDrawer}
              onClose={() => {
                setVisibleForm(false);
              }}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visibleForm}
            >
              <Form />
            </Drawer>
          ) : (
            <Modal
              onCancel={() => {
                setVisibleForm(false);
              }}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visibleForm}
            >
              <Form />
            </Modal>
          )}
        </>
      )}
    </Card>
  );
};

export default TableBase;
