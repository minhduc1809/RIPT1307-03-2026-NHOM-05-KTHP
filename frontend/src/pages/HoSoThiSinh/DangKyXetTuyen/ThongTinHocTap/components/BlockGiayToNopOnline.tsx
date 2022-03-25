import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { Tag, Table, Descriptions } from 'antd';

import { useModel } from 'umi';
const { Item } = Descriptions;

const BlockGiayToNopOnline = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const columns: IColumn<DotTuyenSinh.GiayTo>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên giấy tờ',
      dataIndex: 'ten',
      width: 200,
      align: 'center',
      search: 'search',
    },
    {
      title: 'File đính kèm',
      dataIndex: 'urlGiayToNop',
      width: 200,
      align: 'center',
      render: (val) => (
        <div>
          {val.map((x: string, indexFile: number) => (
            <a key={x} href={x} target="_blank" rel="noreferrer">
              <Tag color="#c01718"> Xem tập tin {indexFile + 1}</Tag>
            </a>
          ))}
        </div>
      ),
    },
  ];
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''} Danh sách giấy tờ nộp
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={recordHoSo?.thongTinGiayToNopOnline?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
      />
    </>
  );
};

export default BlockGiayToNopOnline;
