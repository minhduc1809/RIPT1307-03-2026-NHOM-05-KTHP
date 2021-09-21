import { Card, Avatar } from 'antd';

const ViewThongBao = (props: { record?: ThongBao.Record }) => {
  const { record } = props;
  return (
    <Card>
      <Card.Meta
        avatar={record?.imageUrl ? <Avatar src={record?.imageUrl} /> : false}
        title={record?.title}
        description={record?.description}
      />
      <br />
      <div>{record?.content}</div>
      <div
        dangerouslySetInnerHTML={{ __html: record?.htmlContent || '' }}
        style={{ width: '100%', overflowX: 'auto' }}
      />
    </Card>
  );
};

export default ViewThongBao;
