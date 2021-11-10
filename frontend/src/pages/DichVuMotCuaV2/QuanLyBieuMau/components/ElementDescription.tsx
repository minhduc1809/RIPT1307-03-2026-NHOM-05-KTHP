import { Card } from 'antd';

const ElementDescription = (props: { logo: any; text: string }) => {
  return (
    <Card hoverable style={{ width: 240 }} cover={<img alt="example" src={props.logo} />}>
      <Card.Meta title="Europe Street beat" description={props.text} />
    </Card>
  );
};

export default ElementDescription;
