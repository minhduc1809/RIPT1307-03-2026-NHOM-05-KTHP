/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TinyEditor from '@/components/TinyEditor/Tiny';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getURLImg } from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import { includes, renderFileListUrl } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import _ from 'lodash';

const FormThongBaoAdmin = () => {
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm, postThongBaoGeneralModel } = useModel('thongbao');
  const [nguoiNhan, setNguoiNhan] = useState<string[]>([]);
  const { danhSach: danhSachDonVi } = useModel('donvi');
  const {
    danhSach: danhSachLopHanhChinh,
    setCondition: setCondLopHanhChinh,
    danhSachHinhThucDaoTao,
  } = useModel('lophanhchinh');
  const { danhSach: danhSachNganh } = useModel('nganh');
  const { danhSach: danhSachUser, setCondition: setCondUser } = useModel('user');
  const { danhSach: danhSachLopTinChi, setCondition } = useModel('loptinchi');
  const { danhSach: danhSachKhoaHoc } = useModel('khoahoc');

  const debouncedSearchLopTinChi = _.debounce((value) => {
    setCondition({ ten_lop_tin_chi: value });
  }, 500);

  const debouncedSearchLopHanhChinh = _.debounce((value) => {
    setCondLopHanhChinh({ ten_lop_hanh_chinh: value });
  }, 500);

  const debouncedSearchUser = _.debounce((value) => {
    setCondUser({ ma_dinh_danh: value });
  }, 500);
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
          postThongBaoGeneralModel({
            ...values,
            htmlContent: values?.htmlContent?.text,
            hinhThucDaoTaoId:
              values?.hinhThucDaoTaoId === -1 ? undefined : values?.hinhThucDaoTaoId,
          });
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

        <Form.Item label="Người nhận" name="loaiDoiTuong" rules={[...rules.required]}>
          <Select
            mode="multiple"
            showSearch
            onChange={(val: string[]) => {
              if (val.includes('Tất cả')) {
                form.setFieldsValue({
                  loaiDoiTuong: ['Tất cả'],
                });
              }
              setNguoiNhan(val.includes('Tất cả') ? ['Tất cả'] : val);
            }}
            placeholder="Người nhận"
          >
            {[
              'Tất cả',
              'Vai trò',
              'Lớp tín chỉ',
              'Lớp hành chính',
              'Ngành',
              'Đơn vị',
              'Khóa',
              'Người dùng cụ thể',
            ].map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {nguoiNhan?.includes('Tất cả') && (
          <Form.Item name="hinhThucDaoTaoId" label="Hình thức đào tạo">
            <Select placeholder="Hình thức đào tạo">
              <Select.Option value={-1} key={-1}>
                Tất cả hình thức đào tạo
              </Select.Option>
              {danhSachHinhThucDaoTao?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_hinh_thuc_dao_tao}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {nguoiNhan?.includes('Vai trò') && (
          <Form.Item
            rules={[...rules.required]}
            name="roles"
            label="Vai trò"
            initialValue={record?.roles}
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

        {nguoiNhan?.includes('Đơn vị') && (
          <Form.Item rules={[...rules.required]} name="donViList" label="Đơn vị">
            <Select
              showSearch
              filterOption={(value, option) => includes(option?.props.children, value)}
              mode="multiple"
              placeholder="Chọn đơn vị"
            >
              {danhSachDonVi.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_don_vi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {nguoiNhan.includes('Lớp hành chính') && (
          <Form.Item
            // rules={[...rules.required]}
            name="lopHanhChinhList"
            label="Lớp hành chính"
          >
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              onSearch={(value) => {
                debouncedSearchLopHanhChinh(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Lớp hành chính"
            >
              {danhSachLopHanhChinh.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_lop_hanh_chinh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {nguoiNhan.includes('Lớp tín chỉ') && (
          <Form.Item
            // rules={[...rules.required]}
            name="lopTinChiList"
            label="Lớp tín chỉ"
          >
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              onSearch={(value) => {
                debouncedSearchLopTinChi(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Tìm kiếm theo tên lớp"
            >
              {danhSachLopTinChi.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_lop_tin_chi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {nguoiNhan.includes('Khóa') && (
          <Form.Item
            // rules={[...rules.required]}
            name="khoaList"
            label="Khóa"
          >
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Chọn khóa"
            >
              {danhSachKhoaHoc?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.display_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {nguoiNhan.includes('Ngành') && (
          <Form.Item name="nganhList" label="Ngành học">
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Ngành học"
            >
              {danhSachNganh.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_nganh} ({item.ten_nganh_viet_tat})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {nguoiNhan.includes('Người dùng cụ thể') && (
          <Form.Item rules={[...rules.required]} name="userIds" label="Người dùng cụ thể">
            <Select
              onSearch={(value) => {
                debouncedSearchUser(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Tìm kiếm theo mã định danh"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {danhSachUser.map((item) => (
                <Select.Option key={item?.id?.toString() ?? ''} value={item?.id?.toString() ?? ''}>
                  {item?.name} ({item?.ma_dinh_danh})
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
          <Input.TextArea rows={3} placeholder="Nội dung" />
        </Form.Item>

        <Form.Item
          name="htmlContent"
          label="Nội dung HTML"
          // rules={[
          //   {
          //     validator: (ece, value, callback) => {
          //       const { text } = value;
          //       if (!text || !text.length || !text[0]) {
          //         callback('');
          //       }
          //       callback();
          //     },
          //     message: 'Hãy nhập nội dung',
          //   },
          //   ...rules.required,
          // ]}
          initialValue={{ text: record?.htmlContent || '' }}
        >
          <TinyEditor height={350} />
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

export default FormThongBaoAdmin;
