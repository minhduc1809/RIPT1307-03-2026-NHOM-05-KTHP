import { Descriptions } from 'antd';
const { Item } = Descriptions;
import { useModel } from 'umi';

const BlockNoiHocTHPT = (props: { index?: number }) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.index ? `${props?.index}.` : ''} Nơi học THPT
            </span>
          }
        >
          {''}
        </Item>
      </Descriptions>
      <Descriptions
        layout="horizontal"
        bordered
        size="small"
        column={6}
        style={{ marginBottom: 10 }}
      >
        <Item label={<div style={{ width: '50%' }}>Lớp 10</div>} span={6}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTruong}
        </Item>
        <Item label={<span>Lớp 11</span>} span={6}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maTruong}
        </Item>
        <Item label={<span>Lớp 12</span>} span={6}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.maTruong}
        </Item>
      </Descriptions>
    </>
  );
};

export default BlockNoiHocTHPT;
