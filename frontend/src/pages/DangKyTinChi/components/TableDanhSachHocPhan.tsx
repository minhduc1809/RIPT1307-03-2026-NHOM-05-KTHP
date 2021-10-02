import type { IColumn } from '@/utils/interfaces';
import { List, Table } from 'antd';

const TableDanhSachHocPhan = (props: {
  data: { title: string; dataSource: DangKyTinChi.MonHoc[] }[];
  columns: IColumn<DangKyTinChi.MonHoc>[];
}) => {
  return (
    <List
      style={{ paddingRight: 10 }}
      itemLayout="horizontal"
      dataSource={props.data}
      renderItem={(item) => (
        <List.Item style={{ padding: 0 }} key={item.title}>
          <Table
            style={{ width: '100%' }}
            pagination={
              item.title === 'Danh sách học phần kỳ này'
                ? false
                : {
                    showSizeChanger: true,
                    defaultPageSize: 5,
                    pageSizeOptions: ['5', '10', '25', '50', '100'],
                    showTotal: (tongSo: number) => {
                      return <div>Tổng số: {tongSo}</div>;
                    },
                  }
            }
            title={() => <b>{item.title}</b>}
            columns={props.columns}
            dataSource={item.dataSource}
          />
        </List.Item>
      )}
    />
  );
};

export default TableDanhSachHocPhan;
