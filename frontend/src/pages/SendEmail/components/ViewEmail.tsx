import { Card, Tag } from 'antd';

const ViewEmail = (props?: { recordPost?: any }) => {
  const object1 = props?.recordPost[0];
  const object2 = props?.recordPost[1];
  return (
    <Card>
      <Card.Meta />
      <br />
      <p>
        {' '}
        <b>Người nhận:</b> &nbsp;
        <Tag color="success">{object1?.to}</Tag>
        <Tag color="success">{object2?.to}</Tag>
      </p>
      <p>
        <b>Chủ đề:</b> {object1?.title}
      </p>
      <p>
        <b>Nội dung:</b>
      </p>
      <div
        dangerouslySetInnerHTML={{ __html: object1?.content ?? '' }}
        style={{ width: '100%', overflowX: 'auto' }}
      />
    </Card>
  );
};

export default ViewEmail;
