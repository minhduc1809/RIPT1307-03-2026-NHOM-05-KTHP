import data from '@/utils/data';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormCoCauToChuc = () => {
  const [form] = Form.useForm();
  const { loading, record, edit, danhSach, setVisibleForm, postDonViModel, putDonViModel } =
    useModel('donvi');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) {
            putDonViModel(values, record?.id);
          } else {
            postDonViModel(values);
          }
        }}
        form={form}
      >
        <Form.Item
          name="ma_don_vi"
          label="Mã đơn vị"
          initialValue={record?.ma_don_vi}
          rules={[...rules.required, ...rules.text, ...rules.length(30)]}
        >
          <Input placeholder="Mã đơn vị" />
        </Form.Item>

        <Form.Item
          label="Tên đơn vị"
          name="ten_don_vi"
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
          initialValue={record?.ten_don_vi}
        >
          <Input placeholder="Tên đơn vị" />
        </Form.Item>

        {!edit && (
          <Form.Item
            name="ma_don_vi_cap_tren"
            label="Đơn vị cấp trên"
            initialValue={record?.ma_don_vi_cap_tren}
            // rules={[...rules.required]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Đơn vị cấp trên"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {danhSach?.map((item) => (
                <Select.Option key={item.id} value={item.ma_don_vi}>
                  {item.ten_don_vi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          rules={[...rules.required]}
          name="loai_don_vi"
          label="Loại đơn vị"
          initialValue={record?.loai_don_vi}
        >
          <Select placeholder="Loại đơn vị">
            {data.loaiDonVi.map((item: string) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          rules={[...rules.required]}
          name="cap_don_vi"
          label="Cấp đơn vị"
          initialValue={record?.cap_don_vi}
        >
          <Select placeholder="Cấp đơn vị" showSearch>
            {Object.keys(data.CapDonVi)?.map((item: string) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {edit ? 'Lưu' : 'Thêm'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormCoCauToChuc;
