import { Avatar, Card } from 'antd';

const ViewTinTuc = (props: { record: TinTuc.Record }) => {
  const { record } = props;
  return (
    <Card>
      <Card.Meta
        avatar={<Avatar src={record.urlAnhDaiDien} />}
        title={record.tieuDe}
        description={record.moTa}
      />
      <br />
      <div
        dangerouslySetInnerHTML={{ __html: record.noiDung || '' }}
        style={{ width: '100%', overflowX: 'scroll' }}
      />
    </Card>
  );
};

export default ViewTinTuc;
