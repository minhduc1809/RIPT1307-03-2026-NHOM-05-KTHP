import { Card, Tag } from 'antd';

const ViewEmail = (props?: {record?: any}) => {

  // const record = props;
  // const {record} = props;
  const object1 = props?.record[0]
  const object2 = props?.record[1]
  return (
    <Card>
      <Card.Meta
      />
      <br />
      <p> To: &nbsp;
        <Tag color="success">{object1?.to}</Tag>
        <Tag color="success">{object2?.to}</Tag>
      </p>
      <p>Title: {object1?.title}</p>
      <p>Content: {object1?.content}</p>
      <div
        // dangerouslySetInnerHTML={{ __html: record?.htmlContent || '' }}
        style={{ width: '100%', overflowX: 'auto' }}
      />
    </Card>
  );
};

export default ViewEmail;
