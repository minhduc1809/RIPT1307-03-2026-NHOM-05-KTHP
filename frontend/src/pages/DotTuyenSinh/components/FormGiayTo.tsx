import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Radio, Row } from 'antd';
import { useModel } from 'umi';
import Upload from '@/components/Upload/UploadMultiFile';
import { checkFileSize, renderFileList, uploadMultiFile } from '@/utils/utils';
import { FormItem } from '@/components/FormItem';

const FormGiayTo = (props: {
  fieldName: 'danhSachGiayToNopHoSo' | 'danhSachGiayToNopOnline' | 'danhSachGiayToXacNhanNhapHoc';
}) => {
  const [form] = Form.useForm();
  const modelDotTuyenSinh = useModel('dottuyensinh');
  const {
    editGiayTo: edit,
    setVisibleFormGiayToNopHoSo,
    setVisibleFormGiayToNopOnline,
    setVisibleFormGiayToXacNhanNhapHoc,
    recordGiayTo,
  } = modelDotTuyenSinh;

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} giấy tờ`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const checkSize = checkFileSize(values?.urlHuongDan?.fileList ?? []);
          if (!checkSize) return;
          const urlHuongDan = await uploadMultiFile(values?.urlHuongDan?.fileList);
          const listGiayToTemp = [...modelDotTuyenSinh?.[props.fieldName]];
          if (!edit) {
            listGiayToTemp.push({ ...values, urlHuongDan });
          } else
            listGiayToTemp.splice(recordGiayTo?.index ? recordGiayTo.index - 1 : 0, 1, {
              ...values,
              urlHuongDan,
            });
          modelDotTuyenSinh?.[`set${props.fieldName}`](listGiayToTemp);
          if (props.fieldName === 'danhSachGiayToNopHoSo') setVisibleFormGiayToNopHoSo(false);
          else if (props.fieldName === 'danhSachGiayToXacNhanNhapHoc')
            setVisibleFormGiayToXacNhanNhapHoc(false);
          else setVisibleFormGiayToNopOnline(false);
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col span={24}>
            {' '}
            <FormItem
              rules={[...rules.required]}
              name="maGiayTo"
              label="Mã giấy tờ"
              initialValue={recordGiayTo?.maGiayTo}
            >
              <Input placeholder="Mã giấy tờ" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              name={props.fieldName === 'danhSachGiayToXacNhanNhapHoc' ? 'tieuDe' : 'ten'}
              label="Tên giấy tờ"
              initialValue={
                props.fieldName === 'danhSachGiayToXacNhanNhapHoc'
                  ? recordGiayTo?.tieuDe
                  : recordGiayTo?.ten
              }
              rules={[...rules.required]}
            >
              <Input placeholder="Tên giấy tờ" />
            </FormItem>
          </Col>
          {['danhSachGiayToNopHoSo', 'danhSachGiayToNopOnline'].includes(props.fieldName) && (
            <Col span={12}>
              <FormItem
                name="soLuong"
                label="Số lượng"
                initialValue={recordGiayTo?.soLuong ?? 0}
                rules={[...rules.required]}
              >
                <InputNumber min={1} max={100} placeholder="Số lượng" />
              </FormItem>
            </Col>
          )}
          <Col span={12}>
            {' '}
            <FormItem
              name="required"
              label="Bắt buộc nộp"
              initialValue={recordGiayTo?.required ?? false}
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

          {['danhSachGiayToNopHoSo'].includes(props.fieldName) && (
            <Col span={24}>
              {' '}
              <FormItem name="ghiChu" label="Ghi chú" initialValue={recordGiayTo?.ghiChu}>
                <Input.TextArea rows={2} placeholder="Ghi chú" />
              </FormItem>
            </Col>
          )}

          <Col span={24}>
            <FormItem
              name="textHuongDan"
              label="Hướng dẫn"
              rules={[...rules.text]}
              initialValue={recordGiayTo?.textHuongDan}
            >
              <Input.TextArea rows={3} placeholder="Hướng dẫn" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              extra={<div>Tối đa 5 file, kích thước mỗi file không quá 8MB.</div>}
              initialValue={renderFileList(recordGiayTo?.urlHuongDan ?? [])}
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
              if (props.fieldName === 'danhSachGiayToNopHoSo') setVisibleFormGiayToNopHoSo(false);
              else if (props.fieldName === 'danhSachGiayToXacNhanNhapHoc')
                setVisibleFormGiayToXacNhanNhapHoc(false);
              else setVisibleFormGiayToNopOnline(false);
            }}
          >
            Đóng
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default FormGiayTo;
