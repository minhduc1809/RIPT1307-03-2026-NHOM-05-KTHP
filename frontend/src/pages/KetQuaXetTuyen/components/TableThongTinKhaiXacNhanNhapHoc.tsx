import { Descriptions, Table } from 'antd';
import { useModel } from 'umi';

const { Item } = Descriptions;

export const TableThongTinKhaiXacNhanNhapHoc = (props: { index?: number }) => {
  const { record } = useModel('ketquaxettuyen');

  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''}Thông tin khai xác nhận nhập học
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>
      <Table
        size="small"
        pagination={false}
        columns={[
          { title: 'STT', dataIndex: 'index', width: 100, align: 'center' },
          { title: 'Tiêu đề', dataIndex: 'tieuDe', width: 300, align: 'center' },
          {
            title: 'Nội dung',
            dataIndex: 'noiDung',
            width: 300,
            align: 'center',
          },
        ]}
        dataSource={record?.thongTinXacNhanNhapHoc?.danhSachThongTinKhaiXacNhan?.map(
          (item, index) => ({ ...item, index: index + 1 }),
        )}
      />
    </>
  );
};
