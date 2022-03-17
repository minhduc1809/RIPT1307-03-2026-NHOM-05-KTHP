import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { Descriptions, Table } from 'antd';
import { useModel } from 'umi';
const { Item } = Descriptions;

const BlockGiayTo = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const columns: IColumn<DotTuyenSinh.GiayTo>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      width: 200,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      width: 80,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 200,
    },
    {
      title: 'Số lượng tiếp nhận',
      dataIndex: 'soLuongTiepNhan',
      align: 'center',
      width: 100,
    },
    {
      title: 'Ghi chú tiếp nhận',
      dataIndex: 'ghiChuTiepNhan',
      align: 'center',
      width: 150,
    },
  ];
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''}Thông tin giấy tờ nộp
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>
      <Table
        pagination={false}
        bordered
        columns={columns}
        dataSource={recordHoSo?.thongTinGiayToNopHoSo?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
      />
    </>
  );
};

export default BlockGiayTo;
