import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { checkFileSize, renderFileList, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row } from 'antd';
import { useModel } from 'umi';

const FormKhaiThongTinNhapHoc = () => {
  const [form] = Form.useForm();
  const modelDotTuyenSinh = useModel('dottuyensinh');
  const {
    editGiayTo: edit,
    setVisibleFormThongTinKhaiXacNhan,
    recordThongTinKhaiXacNhan,
    danhSachThongTinKhaiXacNhan,
    setdanhSachThongTinKhaiXacNhan,
  } = modelDotTuyenSinh;

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} thông tin khai xác nhận`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const checkSize = checkFileSize(values?.urlHuongDan?.fileList ?? []);
          if (!checkSize) return;
          const urlHuongDan = await uploadMultiFile(values?.urlHuongDan?.fileList);
          const listThongTinTemp = [...danhSachThongTinKhaiXacNhan];
          if (!edit) {
            listThongTinTemp.push({ ...values, urlHuongDan });
          } else
            listThongTinTemp.splice(
              recordThongTinKhaiXacNhan?.index ? recordThongTinKhaiXacNhan.index - 1 : 0,
              1,
              {
                ...values,
                urlHuongDan,
              },
            );
          setdanhSachThongTinKhaiXacNhan(listThongTinTemp);
          setVisibleFormThongTinKhaiXacNhan(false);
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col span={24}>
            {' '}
            <FormItem
              rules={[...rules.required]}
              name="maThongTin"
              label="Mã thông tin"
              initialValue={recordThongTinKhaiXacNhan?.maThongTin}
            >
              <Input placeholder="Mã thông tin" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              name={'tieuDe'}
              label="Tiêu đề"
              initialValue={recordThongTinKhaiXacNhan?.tieuDe}
              rules={[...rules.required]}
            >
              <Input placeholder="Mã thông tin" />
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              name="required"
              label="Bắt buộc"
              initialValue={recordThongTinKhaiXacNhan?.required ?? false}
              rules={[...rules.required]}
              style={{ marginBottom: 6 }}
            >
              <Radio.Group
                options={[
                  { value: true, label: 'Có' },
                  { value: false, label: 'Không' },
                ].map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
              />
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem
              name="textHuongDan"
              label="Hướng dẫn"
              initialValue={recordThongTinKhaiXacNhan?.textHuongDan}
            >
              <Input.TextArea rows={3} placeholder="Hướng dẫn" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              extra={<div>Tối đa 5 file, kích thước mỗi file không quá 8MB.</div>}
              initialValue={renderFileList(recordThongTinKhaiXacNhan?.urlHuongDan ?? [])}
              label={'File hướng dẫn'}
              name="urlHuongDan"
            >
              <Upload
                otherProps={{
                  accept: 'application/pdf, image/png, .jpg, .doc, .docx',
                  multiple: true,
                  showUploadList: { showDownloadIcon: false },
                }}
                limit={5}
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button
            onClick={() => {
              setVisibleFormThongTinKhaiXacNhan(false);
            }}
          >
            Đóng
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default FormKhaiThongTinNhapHoc;
