import data from '@/utils/data';
import rules from '@/utils/rules';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const ThongTinCaNhan = () => {
  const { initialState } = useModel('@@initialState');

  return (
    <>
      <h3 style={{ fontWeight: 'bold' }}>Thông tin cá nhân sinh viên</h3>
      <Row gutter={[16, 0]}>
        <br />
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            initialValue={initialState?.currentUser?.TenDayDu}
            name="hoTen"
            label="Họ tên"
            rules={[...rules.required, ...rules.ten]}
          >
            <Input readOnly placeholder="Họ và tên" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            initialValue={initialState?.currentUser?.ma_sv}
            name="maSv"
            label="Mã sinh viên"
            rules={[...rules.required]}
          >
            <Input readOnly placeholder="Mã sinh viên" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Form.Item
            initialValue={Number(initialState?.currentUser?.gioi_tinh ?? '0')}
            name="gioiTinh"
            label="Giới tính"
            rules={[...rules.required]}
          >
            <Select>
              {data.gioiTinh.map((item: string, index: number) => (
                <Select.Option key={item} value={index}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            initialValue={initialState?.currentUser?.so_cmnd || ''}
            name="cmtCccd"
            label="Số CMND (CCCD)"
            rules={[...rules.required, ...rules.CMND]}
          >
            <Input placeholder="Số CMND (CCCD)" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item name="ngayCap" label="Ngày cấp" rules={[...rules.required]}>
            <DatePicker
              disabledDate={(cur) => moment(cur).isAfter(moment())}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              placeholder="Ngày cấp"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item name="noiCap" label="Nơi cấp" rules={[...rules.required]}>
            <Input placeholder="Nơi cấp" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            initialValue={initialState?.currentUser?.lop_hanh_chinh_id?.[1]}
            name="lop"
            label="Lớp"
            rules={[...rules.required]}
          >
            <Input placeholder="Lớp" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ThongTinCaNhan;
