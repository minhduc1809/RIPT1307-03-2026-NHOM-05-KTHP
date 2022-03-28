import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import type { IColumn } from '@/utils/interfaces';
import { Descriptions, Table } from 'antd';
import { useModel } from 'umi';
const { Item } = Descriptions;

const BlockNguyenVong = (props: {
  index?: number;
  title?: string;
  record?: { danhSachNguyenVong: HoSoXetTuyen.NguyenVong[] };
}) => {
  const modelHoSoXetTuyen = useModel('hosoxettuyen');
  const recordHoSo = props?.record?.danhSachNguyenVong
    ? props.record
    : modelHoSoXetTuyen.recordHoSo;
  const columnsNV: IColumn<HoSoXetTuyen.NguyenVong>[] = [
    {
      title: 'TT',
      dataIndex: 'soThuTu',
      align: 'center',
      width: '80px',
    },
    {
      title: 'Cơ sở đào tạo',
      dataIndex: 'tenCoSoDaoTao',
      align: 'center',
      width: '200px',
    },
    {
      title: 'Mã ngành',
      dataIndex: 'maNganhChuyenNganh',
      align: 'center',
      width: '100px',
    },
    {
      title: 'Tên ngành',
      dataIndex: 'tenNganhChuyenNganh',
      align: 'center',
      width: '200px',
    },
    {
      title: 'Tổ hợp',
      dataIndex: 'toHopXetTuyen',
      align: 'center',
      width: '100px',
    },
    {
      title: 'Điểm quy đổi',
      dataIndex: ['diemQuyDoi', 'tongDiem'],
      align: 'center',
      width: '120px',
    },
    {
      title: 'Chi tiết thành phần',
      dataIndex: ['diemQuyDoi', 'thanhPhan'],
      render: (val: HoSoXetTuyen.ThanhPhanDiemQuyDoi[]) => {
        return val?.map((item: any) => (
          <div key={item?.tenThanhPhan}>
            {item?.tenThanhPhan}: {item?.diem}
          </div>
        ));
      },
      align: 'center',
      // width: '120px',
    },
  ];

  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {props?.index ? `${props?.index}.` : ''} {props?.title ?? 'Danh sách nguyện vọng'}
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>

      <Table
        scroll={{ x: 1000 }}
        columns={columnsNV}
        dataSource={recordHoSo?.danhSachNguyenVong ?? []}
        size="small"
        pagination={false}
      />
    </>
  );
};

export default BlockNguyenVong;
