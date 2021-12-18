import TinyEditor from '@/components/TinyEditor/Tiny';
import Upload from '@/components/Upload/UploadMultiFile';
import { uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { renderFileListUrlWithName } from '@/utils/utils';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';

const FormThongTinChung = () => {
  const access = useAccess();
  const [form] = Form.useForm();
  const { loading, edit, setCurrent, record: recordDichVu, setRecord } = useModel('dichvumotcuav2');
  const [phamVi, setPhamVi] = useState<string>(recordDichVu?.phamVi ?? '');
  const { record } = useModel('thanhtoan');
  const { danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  useEffect(() => {
    form.setFieldsValue({
      mucLePhi: record?.currentPrice?.unitAmount,
      donViTinh: record?.unitLabel,
    });
  }, [record]);

  const [yeuCauTraPhi, setYeuCauTraPhi] = useState<boolean>(
    recordDichVu?.thongTinThuTuc?.yeuCauTraPhi ?? false,
  );

  const [tinhTienTheoSoLuong, setTinhTienTheoSoLuong] = useState<boolean>(
    recordDichVu?.thongTinThuTuc?.tinhTienTheoSoLuong ?? false,
  );

  const buildUpLoadFile = async (values: any, name: string) => {
    if (values?.[name]?.fileList?.[0]?.originFileObj) {
      const response = await uploadFile({
        file: values?.[name]?.fileList?.[0]?.originFileObj,
        filename: values?.[name]?.fileList?.[0]?.name?.split('.')?.[0] ?? 'fileName',
        public: true,
      });
      return {
        ...response?.data?.data?.file,
        _id: response?.data?.data?.file?.id,
      };
    } else return values?.[name]?.fileList?.[0]?.url ? recordDichVu?.[name] : {};
  };

  return (
    <Card title={edit ? 'Chỉnh sửa thông tin chung' : 'Thêm mới thông tin chung'}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          values.fileMau = await buildUpLoadFile(values, 'fileMau');
          values.fileTraLoi = await buildUpLoadFile(values, 'fileTraLoi');
          setRecord({
            ...recordDichVu,
            ...values,
            thongTinThuTuc: {
              ...values?.thongTinThuTuc,
              yeuCauTraPhi,
              tinhTienTheoSoLuong,
              maLePhi: record?.code,
            },
            thongTinHoSo: values?.thongTinHoSo?.text ?? '',
            thongTinQuyTrinh: values?.thongTinQuyTrinh?.text ?? '',
            thongTinYeuCau: values?.thongTinYeuCau?.text ?? '',
            ten: values?.ten,
            ghiChu: values?.ghiChu,
          });
          setCurrent(1);
        }}
        form={form}
      >
        <h3 style={{ fontWeight: 'bold' }}>Thông tin thủ tục</h3>
        <Row gutter={[20, 0]}>
          <Col xs={24}>
            <Form.Item
              name="ten"
              label="Tên biểu mẫu"
              initialValue={recordDichVu?.ten}
              rules={[...rules.required, ...rules.text, ...rules.length(100)]}
            >
              <Input placeholder="Tên biểu mẫu" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="ghiChu"
              label="Ghi chú"
              initialValue={recordDichVu?.ghiChu}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input.TextArea placeholder="Ghi chú" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              rules={[...rules.fileName]}
              name="fileMau"
              label="Biểu mẫu đơn"
              initialValue={
                recordDichVu?.fileMau?.url
                  ? renderFileListUrlWithName(
                      recordDichVu?.fileMau?.url,
                      recordDichVu?.fileMau?.filename,
                    )
                  : { fileList: [] }
              }
            >
              <Upload
                otherProps={{
                  maxCount: 1,
                  accept: '.docx',
                  multiple: false,
                  showUploadList: { showDownloadIcon: false },
                }}
              />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              rules={[...rules.fileName]}
              name="fileTraLoi"
              label="Biểu mẫu kết quả"
              initialValue={
                recordDichVu?.fileTraLoi?.url
                  ? renderFileListUrlWithName(
                      recordDichVu?.fileTraLoi?.url,
                      recordDichVu?.fileTraLoi?.filename,
                    )
                  : { fileList: [] }
              }
            >
              <Upload
                otherProps={{
                  maxCount: 1,
                  accept: '.docx',
                  multiple: false,
                  showUploadList: { showDownloadIcon: false },
                }}
              />
            </Form.Item>
          </Col>
          {access.admin && (
            <>
              <Col md={12}>
                <Form.Item
                  initialValue={recordDichVu?.phamVi}
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
              </Col>

              {phamVi === 'Hình thức đào tạo' && (
                <Col md={12}>
                  <Form.Item
                    initialValue={recordDichVu?.hinhThucDaoTaoId}
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
                </Col>
              )}
            </>
          )}
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'maThuTuc']}
              label="Mã thủ tục"
              initialValue={recordDichVu?.thongTinThuTuc?.maThuTuc}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Mã thủ tục" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'linhVuc']}
              label="Lĩnh vực"
              initialValue={recordDichVu?.thongTinThuTuc?.linhVuc}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Lĩnh vực" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'donViThucHien']}
              label="Đơn vị thực hiện"
              initialValue={recordDichVu?.thongTinThuTuc?.donViThucHien}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Đơn vị thực hiện" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'capDo']}
              label="Cấp độ"
              initialValue={recordDichVu?.thongTinThuTuc?.capDo}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Cấp độ" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'thoiHanGiaiQuyet']}
              label="Thời hạn giải quyết"
              initialValue={recordDichVu?.thongTinThuTuc?.thoiHanGiaiQuyet}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Thời hạn giải quyết" />
            </Form.Item>
          </Col>

          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'coQuanCoThamQuyen']}
              label="Cơ quan có thẩm quyền"
              initialValue={recordDichVu?.thongTinThuTuc?.coQuanCoThamQuyen}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Cơ quan có thẩm quyền" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'phamViPhucVu']}
              label="Phạm vi phục vụ"
              initialValue={recordDichVu?.thongTinThuTuc?.phamViPhucVu}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Phạm vi phục vụ" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'ketQuaThucHien']}
              label="Kết quả thực hiện"
              initialValue={recordDichVu?.thongTinThuTuc?.ketQuaThucHien}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Kết quả thực hiện" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'mauBieu']}
              label="Mẫu biểu"
              initialValue={recordDichVu?.thongTinThuTuc?.mauBieu}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Mẫu biểu" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'luuY']}
              label="Lưu ý"
              initialValue={recordDichVu?.thongTinThuTuc?.luuY}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Lưu ý" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'yeuCauTraPhi']}
              initialValue={recordDichVu?.thongTinThuTuc?.yeuCauTraPhi}
            >
              <Checkbox
                checked={yeuCauTraPhi}
                onChange={(e) => {
                  setYeuCauTraPhi(e.target.checked);
                }}
              />{' '}
              Yêu cầu trả phí
            </Form.Item>
          </Col>
          {yeuCauTraPhi && (
            <>
              <Col md={12}>
                <Form.Item
                  name={['thongTinThuTuc', 'tinhTienTheoSoLuong']}
                  initialValue={recordDichVu?.thongTinThuTuc?.tinhTienTheoSoLuong}
                >
                  <Checkbox
                    checked={tinhTienTheoSoLuong}
                    onChange={(e) => {
                      setTinhTienTheoSoLuong(e.target.checked);
                    }}
                  />{' '}
                  Tính tiền theo số lượng
                </Form.Item>
              </Col>
              <Col style={{ marginTop: '-12px' }} md={12}>
                <Form.Item
                  name="mucLePhi"
                  label="Mức lệ phí"
                  rules={[...rules.required]}
                  initialValue={record?.currentPrice?.unitAmount}
                >
                  <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    style={{ width: '100%' }}
                    placeholder="Mức lệ phí"
                    max={10000000}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col style={{ marginTop: '-12px' }} md={12}>
                <Form.Item
                  name="donViTinh"
                  label="Đơn vị tính"
                  initialValue={record?.unitLabel}
                  rules={[...rules.text, ...rules.required, ...rules.length(30)]}
                >
                  <Input placeholder="Đơn vị tính" />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
        <h3 style={{ fontWeight: 'bold' }}>Thông tin hồ sơ</h3>
        <Row>
          <Form.Item
            name="thongTinHoSo"
            label=""
            initialValue={{ text: recordDichVu?.thongTinHoSo ?? '' }}
            // rules={[...rules.text]}
          >
            <TinyEditor height={350} />
          </Form.Item>
        </Row>
        <h3 style={{ fontWeight: 'bold' }}>Quy trình thực hiện</h3>
        <Row>
          <Form.Item
            name="thongTinQuyTrinh"
            label=""
            initialValue={{ text: recordDichVu?.thongTinQuyTrinh ?? '' }}
            // rules={[...rules.text]}
          >
            <TinyEditor height={350} />
          </Form.Item>
        </Row>
        <h3 style={{ fontWeight: 'bold' }}>Yêu cầu</h3>
        <Row>
          <Form.Item
            name="thongTinYeuCau"
            label=""
            initialValue={{ text: recordDichVu?.thongTinYeuCau ?? '' }}
            // rules={[...rules.text]}
          >
            <TinyEditor height={350} />
          </Form.Item>
        </Row>

        <Form.Item
          style={{ textAlign: 'center', marginBottom: 0, position: 'fixed', top: 14, right: 48 }}
        >
          <Button
            icon={<ArrowRightOutlined />}
            loading={loading}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            Tiếp theo
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormThongTinChung;
