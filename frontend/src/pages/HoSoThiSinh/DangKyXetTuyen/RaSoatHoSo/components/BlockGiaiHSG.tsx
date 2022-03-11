import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import type { IColumn } from '@/utils/interfaces';
import { Descriptions, Table } from 'antd';
import { useModel } from 'umi';

const { Item } = Descriptions;

const BlockGiaiHSG = (props: {
  index?: number;
  columnGiaiHSG: IColumn<HoSoXetTuyen.ThongTinGiaiQuocGia | HoSoXetTuyen.ThongTinGiaiTinhTP>[];
  type: 'QG' | 'TinhTP';
}) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const field: string = props.type === 'QG' ? 'thongTinGiaiQuocGia' : 'thongTinGiaiTinhTP';
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.index ? `${props?.index}.` : ''}Giải thưởng HSG cấp{' '}
              {props.type === 'QG' ? 'Quốc gia' : 'Tỉnh/thành phố'}
            </span>
          }
        >
          {recordHoSo?.[field]?.[`monThiHSG${props.type}`]}
        </Item>
      </Descriptions>

      <Table pagination={false} bordered columns={props.columnGiaiHSG} dataSource={[]} />
    </>
  );
};

export default BlockGiaiHSG;
