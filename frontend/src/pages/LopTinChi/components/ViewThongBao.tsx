import type { IResThongBaoLopTinChi } from '@/services/LopTinChi/typings';
import { Avatar, Card } from 'antd';

const ViewThongBao = (props: { record: IResThongBaoLopTinChi.Result }) => {
  const { record } = props;
  return (
    <Card>
      <Card.Meta
        avatar={<Avatar src={record.imageUrl} />}
        title={record.title}
        description={record.content}
      />
      <br />
      <div
        dangerouslySetInnerHTML={{ __html: record.htmlContent || '' }}
        // style={{ width: '100%', overflow: 'scroll' }}
      />
    </Card>
  );
};

export default ViewThongBao;
