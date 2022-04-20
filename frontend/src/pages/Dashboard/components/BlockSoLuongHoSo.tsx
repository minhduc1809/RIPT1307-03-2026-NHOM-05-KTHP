import { Badge, Card, Statistic } from 'antd';

const BlockSoLuongHoSo = (props: { recordSoLuongHoSo: any; title: string }) => {
  const arrColor = ['orange', 'blue', 'green', 'red'];
  const { recordSoLuongHoSo } = props;
  return (
    <Card>
      <Statistic
        title={<div style={{ fontSize: 16 }}>{props?.title ?? ''}</div>}
        value={Object?.values(props.recordSoLuongHoSo)
          ?.filter((item) => typeof item === 'number')
          ?.map((item: any) => item)
          ?.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
          }, 0)}
      />

      {Array.from({ length: 4 - Object.keys(recordSoLuongHoSo)?.length ?? 0 }).map(() => (
        <br />
      ))}
      {Object.keys(recordSoLuongHoSo)
        ?.filter((item) => item !== '_id')
        ?.map((item, index) => (
          <>
            <Badge color={arrColor[index]} />
            {item}: {recordSoLuongHoSo?.[item] ?? 0}
            <br />
          </>
        ))}
    </Card>
  );
};

export default BlockSoLuongHoSo;
