import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { Gender, ESystemRole, LoaiNoiSinh } from '@/utils/constants';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getURLImg, renderFileListUrl } from '@/utils/utils';
import { useModel } from 'umi';

const FormQuanLy = () => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, edit, record, postUserModal, putUserModal } =
    useModel('quanlytaikhoan');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} tài khoản`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (values.urlAnhMoTa.fileList?.[0]?.originFileObj) {
            const response = await getURLImg({
              filename: 'url1',
              public: true,
              file: values?.urlAnhMoTa.fileList?.[0].originFileObj,
            });
            values.urlAnhMoTa = response?.data?.data?.url;
          } else values.urlAnhMoTa = values.urlAnhMoTa.fileList?.[0]?.url;

          if (edit) {
            putUserModal(record?._id ?? '', { ...values });
          } else {
            postUserModal(values);
          }
          // setVisibleForm(false)
        }}
        form={form}
      >
        <Row gutter={[12, 0]}>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.hoDem}
              name="hoDem"
              label="Họ đệm"
              rules={[...rules.required]}
            >
              <Input placeholder="Họ đệm" />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item
              initialValue={record?.ten}
              rules={[...rules.required]}
              name="ten"
              label="Tên"
            >
              <Input placeholder="Tên giấy tờ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 0]}>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.ten}
              rules={[...rules.required]}
              name="soDienThoai"
              label="Số điện thoại"
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.email}
              rules={[...rules.required]}
              name="email"
              label="Email"
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 0]}>
          <Col xs={12}>
            <Form.Item
              name="cmtCccd"
              label="Căn cước công dân"
              initialValue={record?.cmtCccd}
              // rules={[...rules.required]}
            >
              <Input placeholder="Căn cước công dân" disabled={edit ? true : false} />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.systemRole}
              name="systemRole"
              label="Vai trò"
              rules={[...rules.required]}
            >
              {/* <Input placeholder="Vai trò" value={ESystemRole.ThiSinh} /> */}
              <Select
                placeholder="Vai trò"
                options={Object.keys(ESystemRole)?.map((item) => ({
                  value: ESystemRole[item],
                  label: ESystemRole[item],
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 0]}>
          <Col xs={12}>
            <Form.Item
              name="urlAnhMoTa"
              label="Ảnh mô tả"
              initialValue={renderFileListUrl(record?.anhDaiDien ?? '')}
              // rules={[...rules.fileRequired]}
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
          </Col>

          <Col xs={12}>
            <Form.Item
              initialValue={record?.gioiTinh}
              rules={[...rules.required]}
              name="gioiTinh"
              label="Giới tính"
            >
              <Select
                placeholder="Giới tính"
                options={Object.keys(Gender)?.map((item) => ({
                  value: Gender[item],
                  label: Gender[item],
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 0]}>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.loaiNoiSinh}
              name="loaiNoiSinh"
              label="Loại nơi sinh"
              rules={[...rules.required]}
            >
              <Select
                placeholder="Nơi sinh"
                options={Object.keys(LoaiNoiSinh)?.map((item) => ({
                  value: LoaiNoiSinh[item],
                  label: LoaiNoiSinh[item],
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.ngaySinh}
              name="ngaySinh"
              label="Ngày sinh"
              rules={[...rules.required]}
            >
              <Input placeholder="Ngày sinh" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 0]}>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.ngayCapCmtCccd}
              name="ngayCapCmtCccd"
              label="Ngày cấp CMT-CCCD"
              // rules={[...rules.required]}
            >
              <Input placeholder="Ngày cấp CMT-CCCD" />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.noiCapCmtCccd}
              name="noiCapCmtCccd"
              label="Nơi cấp CMT-CCCD"
              // rules={[...rules.required]}
            >
              <Input placeholder="Nơi cấp" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormQuanLy;
