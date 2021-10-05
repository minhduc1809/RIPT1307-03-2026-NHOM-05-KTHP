import type { IResThongBaoLopTinChi } from '@/services/LopTinChi/typings';
import { Avatar, Card } from 'antd';

const ViewThongBao = (props: { record: IResThongBaoLopTinChi.Result }) => {
  const { record } = props;
  return (
    <Card>
      <Card.Meta
        avatar={record?.imageUrl ? <Avatar src={record.imageUrl} /> : false}
        title={record.title}
        description={record.content}
      />
      <br />
      <div
        dangerouslySetInnerHTML={{ __html: record.htmlContent || '' }}
        style={{ width: '100%', overflowX: 'auto' }}
      />
    </Card>
  );
};

export default ViewThongBao;
