import { Descriptions } from 'antd';
import { useModel } from 'umi';
const { Item } = Descriptions;

const BlockDiemTBC = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');

  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.index ? `${props?.index}.` : ''} Kết quả điểm TBC học tập
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>
      <Descriptions layout="horizontal">
        <Item label={<span>Lớp 10</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.kqhtCaNam?.diemTBC}
        </Item>
        <Item label={<span>Lớp 11</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.kqhtCaNam?.diemTBC}
        </Item>
        <Item label={<span>Lớp 12 (hoặc Học kỳ 1)</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.kqhtCaNam?.diemTBC}
        </Item>
      </Descriptions>
    </>
  );
};

export default BlockDiemTBC;
