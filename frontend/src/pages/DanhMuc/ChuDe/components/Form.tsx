/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input, InputNumber, Select } from 'antd';
import { useModel, useAccess } from 'umi';

const FormChuDe = () => {
  const [form] = Form.useForm();
  const access = useAccess();
  const {
    loading,
    record,
    setVisibleForm,
    edit,
    danhSachLoaiChuDe,
    putChuDeModel,
    addChuDeModel,
    condition,
  } = useModel('chude');
  const { initialState } = useModel('@@initialState');
  const { danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: ChuDe.Record) => {
          // eslint-disable-next-line no-underscore-dangle
          if (edit) putChuDeModel({ id: record._id, data: values });
          else
            addChuDeModel({
              ...values,
              hinhThucDaoTaoId:
                access.quanTri === true
                  ? initialState?.currentUser?.hinh_thuc_dao_tao_id ?? 0
                  : values?.hinhThucDaoTaoId,
            });
        }}
        form={form}
      >
        <Form.Item
          name="name"
          label="Tên chủ đề"
          rules={[...rules.required, ...rules.text, ...rules.length(30)]}
          initialValue={record?.name}
        >
          <Input placeholder="Tên chủ đề" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại chủ đề"
          rules={[...rules.required]}
          initialValue={record?.type}
        >
          <Select placeholder="Chọn loại chủ đề">
            {danhSachLoaiChuDe.map((item: string) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="order"
          label="Thứ tự hiển thị"
          rules={[...rules.required]}
          initialValue={record?.order ?? 0}
        >
          <InputNumber min={0} max={1000} placeholder="Thứ tự hiển thị" />
        </Form.Item>
        {access.admin && (
          <Form.Item
            rules={[...rules.required]}
            name="hinhThucDaoTaoId"
            label="Hình thức đào tạo"
            initialValue={
              record?.hinhThucDaoTaoId ||
              (condition?.hinhThucDaoTaoId !== -1 ? condition?.hinhThucDaoTaoId : undefined)
            }
          >
            <Select placeholder="Hình thức đào tạo">
              {danhSachHinhThucDaoTao?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_hinh_thuc_dao_tao}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormChuDe;
