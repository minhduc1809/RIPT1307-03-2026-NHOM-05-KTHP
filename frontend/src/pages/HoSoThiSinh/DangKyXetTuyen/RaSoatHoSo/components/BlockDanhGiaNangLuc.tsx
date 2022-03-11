import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import type { IColumn } from '@/utils/interfaces';
import { Descriptions, Table, Tag } from 'antd';
import moment from 'moment';
const { Item } = Descriptions;
import { useModel } from 'umi';

const BlockDanhGiaNangLuc = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const columnChungChi: IColumn<HoSoXetTuyen.ThongTinKetQuaDanhGiaNangLuc>[] = [
    {
      title: 'Đơn vị tổ chức',
      dataIndex: 'truongDanhGiaNangLuc',
      align: 'center',
      width: '140px',
    },
    {
      title: 'Điểm đánh giá năng lực',
      dataIndex: 'diemDanhGiaNangLuc',
      align: 'center',
      width: '120px',
    },

    {
      title: 'Ngày thi',
      dataIndex: 'ngayDuThiDanhGiaNangLuc',
      align: 'center',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: '140px',
    },

    {
      title: 'File minh chứng',
      dataIndex: 'urlGiayXacNhanDanhGiaNangLuc',
      align: 'center',
      render: (value) =>
        Array.isArray(value) &&
        value.map((item, indexChungChi) => (
          <>
            <a href={item} target="_blank" rel="noreferrer">
              <Tag style={{ marginTop: 8 }} color="#c01718">{`Xem tập tin ${
                indexChungChi + 1
              }  `}</Tag>
            </a>{' '}
          </>
        )),
    },
  ];
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''} Thông tin về chứng chỉ quốc tế
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>

      <Table
        pagination={false}
        bordered
        columns={columnChungChi}
        dataSource={
          recordHoSo?.thongTinKetQuaDanhGiaNangLuc ? [recordHoSo?.thongTinKetQuaDanhGiaNangLuc] : []
        }
      />
    </>
  );
};

export default BlockDanhGiaNangLuc;
