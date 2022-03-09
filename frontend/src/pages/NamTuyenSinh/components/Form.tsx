/* eslint-disable no-param-reassign */
import TinyEditor from '@/components/TinyEditor/Tiny';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import rules from '@/utils/rules';
import { getURLImg, renderFileListUrl } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormNamTuyenSinh = () => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, postNamTuyenSinhModel, edit, record, putNamTuyenSinhModel } =
    useModel('namtuyensinh');
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<string>(record?.hinhThucDaoTao?._id ?? '');
  const { danhSach } = useModel('hinhthucdaotao');
  const { danhSach: danhSachPhuongThuc } = useModel('phuongthuctuyensinh');
  // const [danhSachIdPhuongThuc, setDanhSachIdPhuongThuc] = useState<string[]>(
  //   record?.danhSachPhuongThuc?.map((item) => item.phuongThucTuyenSinh._id) ?? [],
  // );
  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} năm tuyển sinh`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          values.danhSachPhuongThuc = values?.danhSachPhuongThuc?.map(
            (item: string, index: number) => ({
              phuongThucTuyenSinh: item,
              moTaPhuongThuc: values?.moTaPhuongThuc?.[index]?.text,
            }),
          );

          if (values.urlAnhMoTa.fileList?.[0]?.originFileObj) {
            const response = await getURLImg({
              filename: 'url1',
              public: true,
              file: values?.urlAnhMoTa.fileList?.[0].originFileObj,
            });
            values.urlAnhMoTa = response?.data?.data?.url;
          } else values.urlAnhMoTa = values.urlAnhMoTa.fileList?.[0]?.url;
          if (edit) {
            putNamTuyenSinhModel(record?._id ?? '', {
              ...values,
              noiDung: values?.noiDung?.text ?? '',
              moTaPhuongThuc: undefined,
            });
          } else {
            postNamTuyenSinhModel({
              ...values,
              noiDung: values?.noiDung?.text ?? '',
              moTaPhuongThuc: undefined,
            });
          }
        }}
        form={form}
      >
        <Row gutter={[12, 0]}>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.hinhThucDaoTao?._id}
              name="hinhThucDaoTao"
              label="Hình thức đào tạo"
              rules={[...rules.required]}
            >
              <Select
                allowClear
                onChange={(val) => {
                  setHinhThucDaoTao(val);
                  form.setFieldsValue({
                    danhSachPhuongThuc: undefined,
                  });
                }}
                placeholder="Hình thức đào tạo"
                options={danhSach?.map((item) => ({ value: item._id, label: item.ten }))}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              initialValue={record?.nam}
              rules={[...rules.required]}
              name="nam"
              label="Năm"
            >
              <InputNumber
                placeholder="Năm tuyển sinh"
                style={{ width: '100%' }}
                max={2030}
                min={2010}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="danhSachPhuongThuc"
          label="Phương thức tuyển sinh"
          initialValue={record?.danhSachPhuongThuc?.map((item) => item.phuongThucTuyenSinh._id)}
          rules={[...rules.required]}
        >
          <Select
            // onChange={(val) => setDanhSachIdPhuongThuc(val)}
            notFoundContent="Bạn chưa chọn hình thức đào tạo hoặc không có phương thức tuyển sinh nào cho hình thức đào tạo này"
            placeholder="Phương thức tuyển sinh"
            mode="multiple"
            options={danhSachPhuongThuc
              ?.filter((item) => item.hinhThucDaoTao._id === hinhThucDaoTao)
              ?.map((item) => ({
                value: item._id,
                label: item.tenPhuongThuc,
              }))}
          />
        </Form.Item>
        {/* {danhSachIdPhuongThuc?.map((item, index) => {
          const recordPhuongThuc = danhSachPhuongThuc?.find((pt) => pt._id === item);
          return (
            <Form.Item
              key={item}
              name={['moTaPhuongThuc', index]}
              label={`Mô tả phương thức ${recordPhuongThuc?.tenPhuongThuc}`}
              initialValue={{ text: record?.danhSachPhuongThuc?.[index]?.moTaPhuongThuc || '' }}
              rules={[...rules.textEditor]}
            >
              <TinyEditor height={350} />
            </Form.Item>
          );
        })} */}
        <Form.Item
          name="urlAnhMoTa"
          label="Ảnh mô tả"
          initialValue={renderFileListUrl(record?.urlAnhMoTa ?? '')}
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
        <Form.Item initialValue={record?.moTa} name="moTa" label="Mô tả">
          <Input.TextArea placeholder="Mô tả" rows={2} />
        </Form.Item>
        <Form.Item
          name="noiDung"
          label="Nội dung"
          initialValue={{ text: record?.noiDung || '' }}
          rules={[...rules.textEditor]}
        >
          <TinyEditor height={350} />
        </Form.Item>
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

export default FormNamTuyenSinh;
