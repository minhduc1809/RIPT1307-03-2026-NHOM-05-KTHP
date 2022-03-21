import { MonToHop } from '@/utils/constants';
import { Descriptions, Table } from 'antd';
const { Item } = Descriptions;
import { useModel } from 'umi';

const BlockDiemTBCCacMon = (props: { danhSachMon: string[]; index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.index ? `${props?.index}.` : ''} Điểm TBC các môn
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>

      <Table
        columns={[
          {
            title: 'STT',
            dataIndex: 'index',
            align: 'center',
            width: 70,
          },
          {
            title: 'Tên môn',
            dataIndex: 'tenMon',
            align: 'center',
            width: 100,
          },
          {
            title: 'Lớp 10',
            dataIndex: 'lop10',
            align: 'center',
            width: 200,
          },
          {
            title: 'Lớp 11',
            dataIndex: 'lop11',
            align: 'center',
            width: 200,
          },
          {
            title: 'Lớp 12 (hoặc Học kỳ 1)',
            dataIndex: 'lop12HK1',
            align: 'center',
            width: 200,
          },
        ]}
        dataSource={props?.danhSachMon?.map((item, index) => {
          return {
            index: index + 1,
            tenMon: item,
            lop10: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.kqhtCaNam?.[MonToHop?.[item]],
            lop11: recordHoSo?.thongTinHocTapTHPT?.truongLop11?.kqhtCaNam?.[MonToHop?.[item]],
            lop12HK1: recordHoSo?.thongTinHocTapTHPT?.truongLop12?.kqhtCaNam?.[MonToHop?.[item]],
          };
        })}
        size="small"
        pagination={false}
      />
    </>
  );
};

export default BlockDiemTBCCacMon;
