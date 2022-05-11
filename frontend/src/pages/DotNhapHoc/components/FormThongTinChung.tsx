import rules from '@/utils/rules';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useModel } from 'umi';
import TableGiayTo from './TableGiayTo';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormDotNhapHoc = () => {
  const [form] = Form.useForm();
  const { edit, record, danhSachGiayToCanNop, setRecord, setCurrent } = useModel('dotnhaphoc');

  const { danhSach } = useModel('dottuyensinh');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt nhập học`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          values.thongTinDotTuyenSinh = values?.thongTinDotTuyenSinh?.map((item: string) => ({
            idDotTuyenSinh: item,
          }));
          const payload = {
            ...values,
            thoiGian: undefined,
            ngayBatDau: values.thoiGian?.[0],
            ngayKetThuc: values.thoiGian?.[1],
            danhSachGiayToCanNop,
          };
          setRecord({ ...record, ...payload });
          setCurrent(1);
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              initialValue={record?.tenDot}
              rules={[...rules.required]}
              name="tenDot"
              label="Tên đợt"
            >
              <Input placeholder="Tên đợt" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              rules={[...rules.required]}
              name="thoiGian"
              label="Thời gian bắt đầu - Thời gian kết thúc"
              initialValue={[
                record?.ngayBatDau ? moment(record?.ngayBatDau) : undefined,
                record?.ngayKetThuc ? moment(record?.ngayKetThuc) : undefined,
              ]}
              style={{ marginBottom: 8 }}
            >
              <DatePicker.RangePicker
                format="HH:mm DD-MM-YYYY"
                style={{ width: '100%' }}
                placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                showTime
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          rules={[...rules.required]}
          initialValue={record?.thongTinDotTuyenSinh?.map((item) => item.idDotTuyenSinh)}
          name="thongTinDotTuyenSinh"
          label="Thông tin đợt tuyển sinh"
        >
          <Select
            mode="multiple"
            placeholder="Chọn đợt"
            options={danhSach.map((item) => ({ label: item.tenDotTuyenSinh, value: item._id }))}
          />
        </Form.Item>

        <Form.Item initialValue={record?.moTa} name="moTa" label="Mô tả">
          <Input.TextArea placeholder="Mô tả" rows={2} />
        </Form.Item>

        <Form.Item name="danhSachGiayToCanNop" label="Danh sách giấy tờ cần nộp">
          <TableGiayTo fieldName="danhSachGiayToCanNop" />
        </Form.Item>
        <Form.Item
          style={{ textAlign: 'center', marginBottom: 0, position: 'fixed', top: 14, right: 48 }}
        >
          <Button
            icon={<ArrowRightOutlined />}
            loading={false}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            Tiếp theo
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormDotNhapHoc;
