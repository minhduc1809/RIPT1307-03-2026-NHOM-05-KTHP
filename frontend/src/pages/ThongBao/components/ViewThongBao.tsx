import { type ThongBao } from '@/services/ThongBao/typing';
import { getNameFile } from '@/utils/utils';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import OneSignalDataToPath from './OneSignalDataToPath';
import './style.less';

const ViewThongBao = (props: { record?: ThongBao.IRecord; afterViewDetail?: () => void }) => {
  const { record, afterViewDetail } = props;
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    const path = OneSignalDataToPath(record?.oneSignalData);
    setPathname(path);
  }, [record?._id]);

  const redirectNotif = () => {
    if (pathname) {
      if (afterViewDetail) afterViewDetail();
      history.push({ pathname, query: {} });
    }
  };

  return (
    <Card title={record?.title}>
      <Card.Meta
        avatar={record?.imageUrl ? <Avatar src={record?.imageUrl} size="large" /> : false}
        description={
          <>
            <div>{record?.description}</div>
            <UserOutlined /> {record?.senderName ?? ''} <Divider type="vertical" />
            <CalendarOutlined /> {moment(record?.createdAt).format('HH:mm DD/MM/YYYY')}
          </>
        }
      />
      <br />
      <div dangerouslySetInnerHTML={{ __html: record?.content ?? '' }} className="notif-content" />
      <Row style={{ marginTop: 12 }} gutter={[12, 12]}>
        {record?.urlFile?.length ? (
          <>
            <Col span={24}>File đính kèm: </Col>
            {record?.urlFile?.map((item) => (
              <Col span={24} key={item}>
                <a href={item} target="_blank" rel="noreferrer">
                  {getNameFile(item)}
                </a>
              </Col>
            ))}
          </>
        ) : null}

        {pathname && afterViewDetail ? (
          <Col span={24}>
            <Button type="primary" onClick={redirectNotif}>
              Xem chi tiết
            </Button>
          </Col>
        ) : null}
      </Row>
    </Card>
  );
};

export default ViewThongBao;
