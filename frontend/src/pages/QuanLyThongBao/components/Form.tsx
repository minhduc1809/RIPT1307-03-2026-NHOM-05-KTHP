import TinyEditor from '@/components/TinyEditor/Tiny';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import {
  ETrangThaiHoSo,
  ETrangThaiTrungTuyen,
  ETrangThaiNhapHoc,
  ETrangThaiXacNhanNhapHoc,
} from '@/utils/constants';
import rules from '@/utils/rules';
import { checkFileSize, includes, renderFileListUrl, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormThongBaoAdmin = () => {
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm, postThongBaoGeneralModel, edit, putThongBaoModel } =
    useModel('quanlythongbao');
  const [nguoiNhan, setNguoiNhan] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const { danhSachNguoiDungCuThe } = useModel('user');
  const { danhSach } = useModel('dottuyensinh');
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
                htmlContent: values?.htmlContent?.text,
              },
              record?._id,
            );
          else {
            postThongBaoGeneralModel({
              ...values,
              imageUrl: imageUrl?.[0],
              htmlContent: values?.htmlContent?.text,
            });
          }
        }}
        form={form}
      >
        {!edit && (
          <Row gutter={[8, 0]}>
            <Col xs={24} md={16}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="title"
                label="Tiêu đề"
                initialValue={record?.title}
                rules={[...rules.required, ...rules.text, ...rules.length(100)]}
              >
                <Input placeholder="Tiêu đề" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
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
                    { name: 'Đợt xét tuyển', value: 'dot-xet-tuyen' },
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
                { name: 'Quản trị viên', value: 'QuanTriVien' },
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
        )}

        {nguoiNhan === 'dot-xet-tuyen' && !edit && (
          <>
            <Col xs={24}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="danhSachDotTuyenSinh"
                label="Danh sách đợt xét tuyển"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn đợt"
                  options={danhSach?.map((item) => ({
                    label: `${item.tenDotTuyenSinh} (năm ${item.namTuyenSinh})`,
                    value: item._id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="danhSachTrangThai"
                label="Danh sách trạng thái"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn trạng thái"
                  options={[
                    ...Object.values(ETrangThaiHoSo),
                    ...Object.values(ETrangThaiTrungTuyen),
                    ...Object.values(ETrangThaiNhapHoc),
                    ...Object.values(ETrangThaiXacNhanNhapHoc),
                  ]?.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </Form.Item>
            </Col>
          </>
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
          rules={[...rules.text, ...rules.required]}
          label="Nội dung tóm tắt"
          initialValue={record?.content || ''}
        >
          <Input placeholder="Nhập nội dung tóm tắt" />
        </Form.Item>

        <Form.Item
          name="htmlContent"
          rules={[...rules.textEditor]}
          label="Nội dung"
          initialValue={{ text: record?.htmlContent || '' }}
        >
          <TinyEditor height={350} />
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
