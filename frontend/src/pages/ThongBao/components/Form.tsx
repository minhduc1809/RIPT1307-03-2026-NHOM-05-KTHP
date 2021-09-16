/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TinyEditor from '@/components/TinyEditor/Tiny';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getURLImg } from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormTinTuc = () => {
  const [form] = Form.useForm();
  const {
    loading,
    record,
    setVisibleForm,
    postThongBaoAllModel,
    postThongBaoByDonViModel,
    postThongBaoByVaiTroModel,
  } = useModel('thongbao');
  const [nguoiNhan, setNguoiNhan] = useState<string>('Tất cả tài khoản');
  const { danhSach, getAllDonViModel } = useModel('donvi');
  useEffect(() => {
    getAllDonViModel();
  }, []);
  return (
    <Card title={'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (values.imageUrl.fileList?.[0]?.originFileObj) {
            const response = await getURLImg({
              filename: 'url1',
              public: true,
              file: values?.imageUrl.fileList?.[0].originFileObj,
            });
            values.imageUrl = response?.data?.data?.url;
          } else values.imageUrl = values.imageUrl.fileList?.[0]?.url;
          if (values.nguoiNhan === 'Tất cả tài khoản') {
            postThongBaoAllModel({
              ...values,
              nguoiNhan: undefined,
              htmlContent: values.htmlContent.text,
            });
          } else if (values.nguoiNhan === 'Gửi theo vai trò') {
            postThongBaoByVaiTroModel({
              ...values,
              nguoiNhan: undefined,
              htmlContent: values.htmlContent.text,
            });
          } else {
            postThongBaoByDonViModel({
              ...values,
              nguoiNhan: undefined,
              htmlContent: values.htmlContent.text,
            });
          }
        }}
        form={form}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          initialValue={record?.title}
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>

        <Form.Item
          label="Người nhận"
          name="nguoiNhan"
          rules={[...rules.required]}
          initialValue={nguoiNhan}
        >
          <Select showSearch onChange={(val: string) => setNguoiNhan(val)} placeholder="Người nhận">
            {['Tất cả tài khoản', 'Gửi theo vai trò', 'Gửi theo đơn vị'].map((item) => (
              <Select.Option value={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        {nguoiNhan === 'Gửi theo vai trò' && (
          <Form.Item
            rules={[...rules.required]}
            name="roles"
            label="Vai trò"
            initialValue={record?.roles}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              {[
                { value: 'giang_vien', name: 'Giảng viên' },
                { value: 'sinh_vien', name: 'Sinh viên' },
                { value: 'can_bo', name: 'Cán bộ' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {nguoiNhan === 'Gửi theo đơn vị' && (
          <Form.Item
            rules={[...rules.required]}
            name="donViIds"
            label="Đơn vị"
            initialValue={record?.donViIds}
          >
            <Select mode="multiple" placeholder="Chọn đơn vị">
              {danhSach.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_don_vi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label="Mô tả"
          initialValue={record?.description}
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
        >
          <Input placeholder="Mô tả" />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Ảnh đại diện"
          initialValue={renderFileListUrl(record?.imageUrl ?? '')}
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

        <Form.Item
          name="content"
          label="Nội dung"
          initialValue={record?.content}
          rules={[...rules.required, ...rules.text]}
        >
          <Input placeholder="Mô tả" />
        </Form.Item>

        <Form.Item
          name="htmlContent"
          label="Nội dung HTML"
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
          initialValue={{ text: record?.htmlContent || '' }}
        >
          <TinyEditor height={650} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {'Gửi'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormTinTuc;
