import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Radio, Row, Select } from 'antd';
import { useModel } from 'umi';

const FormDoiTuong = (props: {
  hinhThucDaoTao: string;
  danhSachPhuongThuc: PhuongThucTuyenSinh.Record[];
}) => {
  const [form] = Form.useForm();

  const {
    editGiayTo: edit,
    setVisibleFormDoiTuong,
    recordDoiTuong,
    danhSachDoiTuong,
    setDanhSachDoiTuong,
  } = useModel('dottuyensinh');

  const { danhSach: danhSachDoiTuongTuyenSinh } = useModel('doituongtuyensinh');
  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đối tượng`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const listDoiTuongTemp = [...danhSachDoiTuong];
          if (!edit) {
            listDoiTuongTemp.splice(0, 0, {
              ...values,
              cauHinhDoiTuong: JSON.parse(values?.cauHinhDoiTuong),
            });
          } else
            listDoiTuongTemp.splice(recordDoiTuong?.index ? recordDoiTuong.index - 1 : 0, 1, {
              ...recordDoiTuong,
              ...values,
              cauHinhDoiTuong: JSON.parse(values?.cauHinhDoiTuong),
            });
          setDanhSachDoiTuong(listDoiTuongTemp);
          setVisibleFormDoiTuong(false);
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={12}>
            {' '}
            <Form.Item
              name="maDoiTuong"
              label="Đối tượng tuyển sinh"
              initialValue={recordDoiTuong?.maDoiTuong}
              rules={[...rules.required]}
            >
              <Select
                notFoundContent="Bạn chưa chọn hình thức đào tạo hoặc không có đối tượng tuyển sinh nào cho hình thức đào tạo này"
                placeholder="Đối tượng tuyển sinh"
                options={danhSachDoiTuongTuyenSinh
                  ?.filter((item) => item?.hinhThucDaoTao?._id === props?.hinhThucDaoTao)
                  ?.map((item) => ({
                    value: item.maDoiTuong,
                    label: item.tenDoiTuong,
                  }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            {' '}
            <Form.Item
              name="phuongThucTuyenSinh"
              label="Phương thức tuyển sinh"
              initialValue={recordDoiTuong?.phuongThucTuyenSinh}
              rules={[...rules.required]}
            >
              <Select
                placeholder="Phương thức tuyển sinh"
                options={props?.danhSachPhuongThuc?.map((item) => ({
                  value: item?._id,
                  label: item?.tenPhuongThuc,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            {' '}
            <Form.Item
              style={{ marginBottom: 8 }}
              name="yeuCauLuaChonToHop"
              label="Yêu cầu lựa chọn tổ hợp"
              initialValue={recordDoiTuong?.yeuCauLuaChonToHop ?? false}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Col span={24}>
          <Form.Item
            style={{ marginBottom: 8 }}
            name="cauHinhDoiTuong"
            label="Cấu hình đối tượng"
            rules={[...rules.required]}
            initialValue={JSON.stringify(recordDoiTuong?.cauHinhDoiTuong ?? {})}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
        </Col>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => setVisibleFormDoiTuong(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormDoiTuong;
