/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { useModel, useAccess } from 'umi';

const FormBaiHoc = () => {
  const [form] = Form.useForm();
  const access = useAccess();
  const { loading, record, setVisibleForm, edit, addThuMucModel, putThuMucModel } =
    useModel('vanbanhuongdan');
  const { danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  const [phamVi, setPhamVi] = useState<string>(record?.phamVi ?? '');
  const [doiTuong, setDoiTuong] = useState<string>(record?.doiTuong ?? 'Tất cả');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: VanBanHuongDan.ThuMuc) => {
          // eslint-disable-next-line no-underscore-dangle
          if (edit)
            putThuMucModel({
              id: record._id,
              data: values,
            });
          else addThuMucModel(values);
        }}
        form={form}
      >
        <Form.Item
          name="ten"
          label="Tên thư mục"
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          initialValue={record?.ten}
        >
          <Input placeholder="Tên thư mục" />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.text, ...rules.length(200)]}
          initialValue={record?.moTa}
        >
          <Input.TextArea rows={3} placeholder="Mô tả" />
        </Form.Item>
        <Form.Item
          rules={[...rules.required]}
          name="doiTuong"
          label="Đối tượng"
          initialValue={doiTuong}
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
        {doiTuong === 'Vai trò' && (
          <Form.Item
            rules={[...rules.required]}
            name="vaiTro"
            label="Vai trò"
            initialValue={record?.vaiTro}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              {[
                { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
                { value: 'sinh_vien', name: 'Sinh viên' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {(access.admin || access.nhanVien) && (
          <Form.Item
            initialValue={record?.phamVi}
            rules={[...rules.required]}
            name="phamVi"
            label="Phạm vi"
          >
            <Select onChange={(val: string) => setPhamVi(val)} placeholder="Phạm vi">
              {['Tất cả', 'Hình thức đào tạo'].map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {phamVi === 'Hình thức đào tạo' && (access.admin || access.nhanVien) && (
          <Form.Item
            initialValue={record?.hinhThucDaoTaoId}
            rules={[...rules.required]}
            name="hinhThucDaoTaoId"
            label="Hình thức đào tạo"
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

export default FormBaiHoc;
