import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { Descriptions, Table, Tag } from 'antd';
import moment from 'moment';
const { Item } = Descriptions;
import { useModel } from 'umi';

const BlockChungChiTiengAnh = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');

  const columnChungChi: IColumn<HoSoXetTuyen.ThongTinChungChiTiengAnh>[] = [
    {
      title: 'Tên loại chứng chỉ',
      dataIndex: 'loai',
      align: 'center',
      width: '140px',
      key: 'tenChungChi',
    },
    {
      title: 'Điểm thi chứng chỉ',
      dataIndex: 'diem',
      align: 'center',
      key: 'diem',
      width: '100px',
    },

    {
      title: 'Ngày cấp',
      dataIndex: 'ngayCap',
      align: 'center',
      key: 'ngayCap',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: '140px',
    },
    {
      title: 'Đơn vị cấp',
      dataIndex: 'noiCap',
      align: 'center',
      key: 'donvicap',
      width: '200px',
    },
    {
      title: 'File minh chứng',
      dataIndex: 'urlChungChi',
      align: 'center',
      key: 'fileChungChi',
      render: (value) =>
        Array.isArray(value) &&
        value.map((item, indexChungChi) => (
          <>
            <a href={item} target="_blank" rel="noreferrer">
              <Tag style={{ marginTop: 8 }} color={Setting.primaryColor}>{`Xem tập tin ${
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
              {props?.index ? `${props?.index}.` : ''}Thông tin về chứng chỉ tiếng Anh
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
        dataSource={
          recordHoSo?.thongTinChungChiTiengAnh ? [recordHoSo?.thongTinChungChiTiengAnh] : []
        }
      />
    </>
  );
};

export default BlockChungChiTiengAnh;
