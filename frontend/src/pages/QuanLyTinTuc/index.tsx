/* eslint-disable no-underscore-dangle */
import { getDataTinTuc } from '@/services/ant-design-pro/api';
import { Card, Col, Empty, Modal, Row, Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import type { IRecordTinTuc } from './index.d';
import './styles.less';

export default () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [record, setRecord] = useState<TinTuc.Record>();

  const viewMore = (rc: TinTuc.Record) => {
    setVisibleModal(true);
    setRecord(rc);
  };

  const [dataTinTuc, setdataTinTuc] = useState<IRecordTinTuc.RootObject>({});
  useEffect(() => {
    const getData = async () => {
      const res: any = await getDataTinTuc({});
      // console.log('res :>> ', res);
      setdataTinTuc(res);
    };
    getData();
  }, []);

  const dsTinTuc = dataTinTuc?.data?.result?.map((value, index) => ({
    ...value,
    index: index + 1,
  }));

  const renderTinTuc = (tinTuc: TinTuc.Record) => {
    if (!tinTuc) {
      return null;
    }

    return (
      // eslint-disable-next-line no-underscore-dangle
      <Card key={tinTuc._id} className="tin-tuc-card" hoverable onClick={() => viewMore(tinTuc)}>
        <div className="tin-tuc-image-wrapper">
          <img style={{ objectFit: 'cover' }} src={tinTuc?.urlAnhDaiDien ?? ''} />
        </div>
        <div className="tin-tuc-content">
          <Typography.Title level={4} ellipsis={{ rows: 2 }} className="tin-tuc-tieu-de">
            {tinTuc?.tieuDe ?? ''}
          </Typography.Title>
          <Typography.Paragraph ellipsis={{ rows: 2 }} type="secondary" className="tin-tuc-mo-ta">
            {tinTuc?.moTa ?? ''}
          </Typography.Paragraph>
        </div>
      </Card>
    );
  };

  const renderDanhSachTinTuc = () => {
    return (
      <Row className="tin-tuc-wrapper">
        <Col md={12} xs={24}>
          {renderTinTuc(_.get(dsTinTuc, '0'))}
        </Col>
        <Col md={12} xs={24}>
          <Row>
            {_.slice(dsTinTuc, 1, 4).map((tinTuc) => (
              <Col span={24} key={tinTuc?._id}>
                {renderTinTuc(tinTuc)}
              </Col>
            ))}
          </Row>
        </Col>
        {_.slice(dsTinTuc, 4).map((tinTuc) => (
          <Col md={8} xs={24} key={tinTuc?._id}>
            {renderTinTuc(tinTuc)}
          </Col>
        ))}
      </Row>
    );
  };

  if (_.isEmpty(dsTinTuc)) {
    return (
      <Empty
        image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
        imageStyle={{
          height: 60,
        }}
        description={<span>Không có tin nào</span>}
      ></Empty>
    );
  }

  return (
    <>
      {renderDanhSachTinTuc()}
      <Modal
        width="1000px"
        title={record?.moTa}
        visible={visibleModal}
        okText="Đóng"
        onOk={() => setVisibleModal(false)}
        cancelButtonProps={{ hidden: true }}
        onCancel={() => setVisibleModal(false)}
      >
        <div style={{ overflowX: 'auto' }}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <img style={{ maxWidth: '100%' }} alt="" src={record?.urlAnhDaiDien ?? ''} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: record?.noiDung ?? '' }} />
          <div style={{ textAlign: 'center' }}>
            {moment(record?.ngayDang).format('DD/MM/YYYY HH:mm')}
          </div>{' '}
        </div>
      </Modal>
    </>
  );
};
