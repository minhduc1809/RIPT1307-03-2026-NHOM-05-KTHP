/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TinyEditor from '@/components/TinyEditor/Tiny';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getURLImg } from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';

const FormTinTuc = () => {
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm, edit, putTinTucModel, addTinTucModel } =
    useModel('tintuc');
  const [doiTuong, setDoiTuong] = useState<string>(record?.doiTuong ?? 'Tất cả');
  const { danhSach } = useModel('chude');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (values.urlAnhDaiDien.fileList?.[0]?.originFileObj) {
            const response = await getURLImg({
              filename: 'url1',
              public: true,
              file: values?.urlAnhDaiDien.fileList?.[0].originFileObj,
            });
            values.urlAnhDaiDien = response?.data?.data?.url;
          } else values.urlAnhDaiDien = values.urlAnhDaiDien.fileList?.[0]?.url;
          // eslint-disable-next-line no-underscore-dangle
          if (edit)
            putTinTucModel({ id: record._id, data: { ...values, noiDung: values?.noiDung?.text } });
          else addTinTucModel({ ...values, noiDung: values?.noiDung?.text });
        }}
        form={form}
      >
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          initialValue={record?.tieuDe}
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>

        <Form.Item
          name="idTopic"
          label="Chủ đề"
          rules={[...rules.required]}
          initialValue={record?.idTopic}
        >
          <Select placeholder="Chọn chủ đề">
            {danhSach.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          initialValue={record?.moTa}
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
        >
          <Input placeholder="Mô tả" />
        </Form.Item>

        <Form.Item
          name="urlAnhDaiDien"
          label="Ảnh đại diện"
          initialValue={renderFileListUrl(record?.urlAnhDaiDien)}
          rules={[...rules.fileRequired]}
        >
          <UploadAvatar
            style={{
              width: 102,
              maxWidth: 102,
              height: 102,
              maxHeight: 102,
            }}
          />
        </Form.Item>
        <Row gutter={[20, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="doiTuong"
              label="Đối tượng"
              rules={[...rules.required]}
              initialValue={record?.doiTuong ?? 'Tất cả'}
            >
              <Select
                onChange={(val: string) => {
                  setDoiTuong(val);
                }}
                placeholder="Chọn đối tượng"
              >
                {['Tất cả', 'Vai trò'].map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ngayDang"
              label="Ngày đăng"
              rules={[...rules.required]}
              initialValue={moment(record?.ngayDang)}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                placeholder="Ngày đăng"
              />
            </Form.Item>
          </Col>
        </Row>
        {doiTuong === 'Vai trò' && (
          <Form.Item
            rules={[...rules.required]}
            name="danhSachVaiTro"
            label="Vai trò"
            initialValue={record?.danhSachVaiTro}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              {[
                { value: 'sinh_vien', name: 'Sinh viên' },
                { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="noiDung"
          label="Nội dung"
          rules={[
            {
              validator: (ece, value, callback) => {
                const { text } = value;
                if (!text || !text.length || !text[0]) {
                  callback('');
                }
                callback();
              },
              message: 'Hãy nhập nội dung',
            },
            ...rules.required,
          ]}
          initialValue={{ text: record?.noiDung || '' }}
        >
          <TinyEditor height={650} />
        </Form.Item>
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

export default FormTinTuc;
