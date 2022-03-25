import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import type { IColumn } from '@/utils/interfaces';
import { Descriptions, Table, Tag } from 'antd';
import moment from 'moment';
const { Item } = Descriptions;
import { useModel } from 'umi';

const BlockChungChiQuocTe = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const columnChungChi: IColumn<HoSoXetTuyen.ThongTinChungChiQuocTe>[] = [
    {
      title: 'Tên loại chứng chỉ',
      dataIndex: 'loaiChungChiQuocTe',
      align: 'center',
      width: '140px',
      key: 'tenChungChi',
    },
    {
      title: 'mã dự thi chứng chỉ',
      dataIndex: 'maDuThiChungChiQuocTe',
      align: 'center',
      width: '100px',
    },
    {
      title: 'Điểm thi chứng chỉ',
      dataIndex: 'diemChungChiQuocTe',
      align: 'center',
      key: 'diem',
      width: '100px',
    },

    {
      title: 'Ngày cấp',
      dataIndex: 'ngayCapChungChiQuocTe',
      align: 'center',
      key: 'ngayCap',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: '140px',
    },
    {
      title: 'Đơn vị cấp',
      dataIndex: 'donViCapChungChiQuocTe',
      align: 'center',
      key: 'donvicap',
      width: '100px',
    },
    {
      title: 'File minh chứng',
      dataIndex: 'urlChungChiQuocTe',
      align: 'center',
      key: 'fileChungChi',
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
        size="small"
        pagination={false}
        bordered
        columns={columnChungChi}
        dataSource={recordHoSo?.thongTinChungChiQuocTe ? [recordHoSo?.thongTinChungChiQuocTe] : []}
      />
    </>
  );
};

export default BlockChungChiQuocTe;
