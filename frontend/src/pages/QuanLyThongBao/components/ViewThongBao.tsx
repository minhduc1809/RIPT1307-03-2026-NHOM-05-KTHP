import { Avatar, Card } from 'antd';
import moment from 'moment';

const ViewThongBao = (props: { record?: ThongBao.Record }) => {
  const { record } = props;
  return (
    <Card >
      <Card.Meta
        avatar={record?.imageUrl ? <Avatar src={record?.imageUrl} /> : false}
        title={<b>{record?.title}</b>}
        description={
          <div>
            {record?.senderName ?? ''} đã gửi vào lúc{' '}
            {moment(record?.createdAt).format('HH:mm DD/MM/YYYY')}
            <br />
            <br/>
            {record?.description}
          </div>
        }
      />
      <br />
    </Card>
  );
};

export default ViewThongBao;
