import { Descriptions } from 'antd';
const { Item } = Descriptions;
import { useModel } from 'umi';
const BlockHanhKiem = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.index ? `${props?.index}.` : ''} Hạnh kiểm
            </span>
          }
        >
          {''}
        </Item>
      </Descriptions>
      <Descriptions layout="horizontal">
        <Item label={<span>Lớp 10</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.hanhKiem}
        </Item>
        <Item label={<span>Lớp 11</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.hanhKiem}
        </Item>
        <Item label={<span>Lớp 12 (hoặc Học kỳ 1)</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.hanhKiem}
        </Item>
      </Descriptions>
    </>
  );
};

export default BlockHanhKiem;
