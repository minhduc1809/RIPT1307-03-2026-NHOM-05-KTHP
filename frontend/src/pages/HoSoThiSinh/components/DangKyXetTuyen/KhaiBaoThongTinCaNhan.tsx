import { Card, Col, DatePicker, Descriptions, Divider, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';
import { useModel } from 'umi';

const KhaiBaoThongTinCaNhan = () => {
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { danhSachDanToc, danhSachTonGiao } = useModel('dantoctongiao');
  const isMobile = useMediaQuery({
    query: '(max-width: 576px)',
  });
  return (
    <Card
      bordered
      title={
        <div className="cardTitle">
          <b>Kê khai thông tin cá nhân chi tiết</b>
        </div>
      }
    >
      <Descriptions
        bordered
        column={isMobile ? 3 : 6}
        style={{ marginBottom: 30 }}
        layout={isMobile ? 'vertical' : 'horizontal'}
      >
        <Descriptions.Item label="Họ và tên" span={3}>
          {initialState?.currentUser?.name ?? ''}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Ngày sinh" span={3}>
          {moment(initialState?.currentUser?.ngaySinh).format('DD/MM/YYYY')}
        </Descriptions.Item> */}
        <Descriptions.Item label="CMTND/CCCD" span={3}>
          {initialState?.currentUser?.so_cmnd}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cấp " span={3}>
          {moment(initialState?.currentUser?.ngayCapCmtCccd).format('DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Nơi cấp " span={3}>
          {initialState?.currentUser?.noiCapCmtCccd ?? ''}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Dân tộc" span={3}>
          {initialState?.currentUser?.dan_toc ?? ''}
        </Descriptions.Item>
        <Descriptions.Item label="Tôn giáo" span={3}>
          {initialState?.currentUser?.ton_giao ?? ''}
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính" span={3}>
          {initialState?.currentUser?.gioiTinh ? 'Nữ' : 'Nam'}
        </Descriptions.Item> */}

        <Descriptions.Item label="Email" span={3}>
          {initialState?.currentUser?.email ?? ''}
        </Descriptions.Item>
        <Descriptions.Item label="Quốc tịch" span={3}>
          {initialState?.currentUser?.quocTich ?? 'Việt Nam'}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại" span={3}>
          {initialState?.currentUser?.so_dien_thoai ?? ''}
        </Descriptions.Item>
      </Descriptions>
      <Divider plain>
        <strong>Thông tin bổ sung</strong>
      </Divider>
      <Form labelCol={{ span: 24 }} form={form}>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item name="ngaySinh" label="Ngày sinh">
              <DatePicker
                placeholder="Ngày sinh DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label="Giới tính" name="gioiTinh">
              <Select placeholder="Giới tính">
                {['Nam', 'Nữ', 'Khác'].map((item, index) => (
                  <Select.Option key={item} value={index}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label="Dân tộc" name="danToc">
              <Select showSearch placeholder="Dân tộc">
                {danhSachDanToc.map((item) => (
                  <Select.Option key={item.tenDanToc} value={item.tenDanToc}>
                    {item.tenDanToc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label="Quốc tịch" name="quocTich">
              <Input placeholder="Nhập quốc tịch" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label="Tôn giáo" name="tonGiao">
              <Select placeholder="Tôn giáo">
                {danhSachTonGiao.map((item) => (
                  <Select.Option key={item.tenTonGiao} value={item.tenTonGiao}>
                    {item.tenTonGiao}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={8} />
          <Col xs={24} lg={8} />
        </Row>
      </Form>
    </Card>
  );
};

export default KhaiBaoThongTinCaNhan;
