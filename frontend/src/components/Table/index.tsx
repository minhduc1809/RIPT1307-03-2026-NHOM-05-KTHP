import { Card, Table } from 'antd';
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  getData: Function;
  dependencies?: any[];
  loading: boolean;
  params?: any;
  children?: React.ReactNode;
  border?: boolean;
};

const TableBase = (props: Props) => {
  const {
    modelName,
    // Form,
    columns,
    title,
    getData,
    dependencies = [],
    // formType,
    loading,
    children,
    params,
    border,
  } = props;
  const {
    danhSach,
    // showDrawer, setShowDrawer,
    total,
    page,
    limit,
    setPage,
    setLimit,
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
      <Table
        loading={loading}
        bordered={border || false}
        pagination={{
          current: page,
          pageSize: limit,
          position: ['bottomRight'],
          total,
          showSizeChanger: true,

          pageSizeOptions: ['1', '10', '25', '50', '100'],
          showTotal: (tongSo: number) => {
            return <div>Tổng số: {tongSo}</div>;
          },
        }}
        onChange={handleTableChange}
        dataSource={danhSach?.map((item: any, index: number) => {
          return { ...item, index: index + 1 };
        })}
        columns={columns}
      />
    </Card>
  );
};

export default TableBase;
