import { FormItem } from '@/components/FormItem';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useModel } from 'umi';
import TableGiayTo from './TableGiayTo';

const FormDoiTuongGiayTo = () => {
  const [form] = Form.useForm();
  const {
    danhSachDoiTuongGiayTo,
    setDanhSachDoiTuongGiayTo,
    recordDoiTuongGiayTo,
    editDoiTuongGiayTo: edit,
    setVisibleFormDoiTuongGiayTo,
    danhSachGiayToTheoDoiTuong,
  } = useModel('huongdannhaphoc');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} giấy tờ`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const listDoiTuongGiayToTemp = [...danhSachDoiTuongGiayTo];
          if (!edit) {
            listDoiTuongGiayToTemp.push({
              ...values,
              danhSachGiayToCanNop: danhSachGiayToTheoDoiTuong,
            });
          } else
            listDoiTuongGiayToTemp.splice(
              recordDoiTuongGiayTo?.index ? recordDoiTuongGiayTo.index - 1 : 0,
              1,
              {
                ...values,
                danhSachGiayToCanNop: danhSachGiayToTheoDoiTuong,
              },
            );
          setDanhSachDoiTuongGiayTo(listDoiTuongGiayToTemp);
          setVisibleFormDoiTuongGiayTo(false);
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <FormItem
              rules={[...rules.required]}
              name="loaiDoiTuong"
              label="Đối tượng"
              initialValue={recordDoiTuongGiayTo?.loaiDoiTuong}
            >
              <Input placeholder="Loại đối tượng" />
            </FormItem>
          </Col>
        </Row>
        <Form.Item name="danhSachGiayToCanNop" label="Danh sách giấy tờ cần nộp">
          <TableGiayTo modelName="huongdannhaphoc" fieldName="GiayToTheoDoiTuong" />
        </Form.Item>
        <FormItem style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button
            onClick={() => {
              setVisibleFormDoiTuongGiayTo(false);
            }}
          >
            Đóng
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default FormDoiTuongGiayTo;
