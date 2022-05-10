import { FormItem } from '@/components/FormItem';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useModel } from 'umi';
import TableLePhi from './TableLePhi';

const FormDoiTuongLePhi = () => {
  const [form] = Form.useForm();
  const {
    danhSachDoiTuongLePhi,
    setDanhSachDoiTuongLePhi,
    recordDoiTuongLePhi,
    editDoiTuongLePhi: edit,
    setVisibleFormDoiTuongLePhi,
    danhSachLePhiTheoDoiTuong,
  } = useModel('huongdannhaphoc');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} lệ phí theo đối tượng`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const listDoiTuongLePhiTemp = [...danhSachDoiTuongLePhi];
          if (!edit) {
            listDoiTuongLePhiTemp.push({
              ...values,
              danhSachLePhiCanNop: danhSachLePhiTheoDoiTuong,
            });
          } else
            listDoiTuongLePhiTemp.splice(
              recordDoiTuongLePhi?.index ? recordDoiTuongLePhi.index - 1 : 0,
              1,
              {
                ...values,
                danhSachLePhiCanNop: danhSachLePhiTheoDoiTuong,
              },
            );
          setDanhSachDoiTuongLePhi(listDoiTuongLePhiTemp);
          setVisibleFormDoiTuongLePhi(false);
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <FormItem
              rules={[...rules.required]}
              name="loaiDoiTuong"
              label="Đối tượng"
              initialValue={recordDoiTuongLePhi?.loaiDoiTuong}
            >
              <Input placeholder="Loại đối tượng" />
            </FormItem>
          </Col>
        </Row>
        <Form.Item name="danhSachLePhiCanNop" label="Danh sách lệ phí cần nộp">
          <TableLePhi modelName="huongdannhaphoc" fieldName="LePhiTheoDoiTuong" />
        </Form.Item>
        <FormItem style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button
            onClick={() => {
              setVisibleFormDoiTuongLePhi(false);
            }}
          >
            Đóng
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default FormDoiTuongLePhi;
