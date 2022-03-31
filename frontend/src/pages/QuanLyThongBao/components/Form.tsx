/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import UploadAvatar from '@/components/Upload/UploadAvatar';
import rules from '@/utils/rules';
import { checkFileSize, includes, renderFileListUrl, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormThongBaoAdmin = () => {
  //const access = useAccess();
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm, postThongBaoGeneralModel, edit, putThongBaoModel } =
    useModel('quanlythongbao');
  const [nguoiNhan, setNguoiNhan] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const { danhSachNguoiDungCuThe, getUserModel } = useModel('user');

  useEffect(() => {
    getUserModel(1, 100);
  }, []);

  return (
    <Card title={'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const checkSize = checkFileSize(values?.imageUrl?.fileList ?? []);
          if (!checkSize) return;
          const imageUrl = await uploadMultiFile(values?.imageUrl?.fileList);
          if (edit)
            putThongBaoModel(
              {
                ...values,
                imageUrl: imageUrl?.[0],
              },
              record?._id,
            );
          else {
            postThongBaoGeneralModel({
              ...values,
              imageUrl: imageUrl?.[0],
            });
          }
        }}
        form={form}
      >
        <Form.Item
          style={{ marginBottom: 8 }}
          name="title"
          label="Tiêu đề"
          initialValue={record?.title}
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>

        {!edit && (
          <Row gutter={[8, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                style={{ marginBottom: 8, width: '100%' }}
                label="Người nhận"
                name="loaiDoiTuong"
                rules={[...rules.required]}
              >
                <Select
                  showSearch
                  onChange={(val: string) => {
                    setNguoiNhan(val);
                  }}
                  placeholder="Người nhận"
                  style={{ width: '100%' }}
                >
                  {[
                    { name: 'Tất cả', value: 'all' },
                    { name: 'Người dùng cụ thể', value: 'user' },
                    { name: 'Vai trò', value: 'vai-tro' },
                  ].map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        {nguoiNhan === 'vai-tro' && !edit && (
          <Form.Item
            style={{ marginBottom: 8 }}
            name="roles"
            //rules={isNguoiDungCuThe ? [] : [...rules.required]}
            label="Vai trò"
          >
            <Select
              maxTagCount={8}
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Vai trò"
            >
              {[
                { name: 'Chuyên viên', value: 'ChuyenVien' },
                { name: 'Thí sinh', value: 'ThiSinh' },
                { name: 'Phụ huynh', value: 'PhuHuynh' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {nguoiNhan === 'user' && !edit && (
          <div style={{ position: 'relative' }}>
            <Form.Item
              style={{ marginBottom: 8, width: '100%' }}
              rules={[...rules.required]}
              name="userIds"
              label="Người dùng cụ thể"
            >
              <Select
                showSearch
                allowClear
                mode="tags"
                placeholder="Tìm kiếm theo mã định danh"
                maxTagCount={8}
                filterOption={(value, option) => includes(option?.props.children, value)}
              >
                {danhSachNguoiDungCuThe.map((item) => (
                  <Select.Option key={item?.code} value={item?._id}>
                    {item?.hoDem} {item?.ten}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        )}

        <Form.Item
          style={{ marginBottom: 8 }}
          name="description"
          label="Mô tả"
          initialValue={record?.description}
          rules={[...rules.text, ...rules.length(500)]}
        >
          <Input.TextArea rows={2} placeholder="Mô tả" />
        </Form.Item>

        <Form.Item
          name="content"
          rules={[...rules.text]}
          label="Nội dung"
          initialValue={record?.content || ''}
        >
          <Input placeholder="Nội dung" />
        </Form.Item>

        <Form.Item
          name="htmlContent"
          rules={[...rules.text]}
          label="Nội dung HTML"
          initialValue={record?.htmlContent || ''}
        >
          <Input placeholder="Nội dung HTML" />
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

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
      <Modal
        footer={false}
        visible={visible}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisible(false);
        }}
        destroyOnClose
      >
        {/* <ImportExcel
          handleData={handleData}
          title={`Import ${TitleFormImport?.[ImportExcelType] ?? ''}`}
          onCancel={() => {
            setVisible(false);
          }}
        /> */}
      </Modal>
    </Card>
  );
};

export default FormThongBaoAdmin;
