/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';
import _ from 'lodash';
import Upload from '@/components/Upload/UploadMultiFile';
import mm from 'moment-timezone';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormCongNo = () => {
  const [form] = Form.useForm();
  const access = useAccess();
  const {
    loading,
    setVisibleForm,
    edit,
    postInvoiceModel,
    postTypeCongNo,
    importInvoiceModel,
    importInvoicePaidModel,
    importType,
  } = useModel('thanhtoan');
  const { danhSach } = useModel('loaithanhtoan');
  const { danhSach: danhSachKyHoc } = useModel('kyhoc');
  const { danhSach: danhSachNamHoc } = useModel('namhoc');
  const {
    danhSach: danhSachUser,
    setCondition,
    condition,
    loading: loadingUser,
  } = useModel('user');
  const { danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  const [phamVi, setPhamVi] = useState<string>();
  const [hinhThucDaoTaoId, setHinhThucDaoTaoId] = useState<number>();
  const [recordLoaiThanhToan, setRecordLoaiThanhToan] = useState<LoaiThanhToan.Record>();
  const debouncedSearchUser = _.debounce((value) => {
    setCondition({ ...condition, ma_dinh_danh: value?.trim() });
  }, 800);
  return (
    <Card title={edit ? `${importType ? `Import ${importType}` : 'Chỉnh sửa'}` : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          switch (recordLoaiThanhToan?.dinhKy ?? '') {
            case 'Hàng tháng': {
              values.mocThoiGian = values?.mocThoiGian?.format('MM/YYYY');
              break;
            }
            case '6 tháng': {
              values.mocThoiGian = values?.mocThoiGian?.format('MM/YYYY');
              break;
            }
            case 'Hàng năm': {
              values.mocThoiGian = values?.mocThoiGian?.format('YYYY');
              break;
            }
            case 'Hàng quý': {
              values.mocThoiGian = `Q${values?.mocThoiGian?.quarter()}/${values?.mocThoiGian?.format(
                'YYYY',
              )}`;
              break;
            }
          }
          if (postTypeCongNo === 'normal') postInvoiceModel({ ...values, thongTinChiTiet: [] });
          else {
            if (importType === 'các khoản chưa thu')
              importInvoiceModel({ ...values, file: values?.file?.fileList?.[0]?.originFileObj });
            else
              importInvoicePaidModel({
                ...values,
                file: values?.file?.fileList?.[0]?.originFileObj,
              });
          }
        }}
        form={form}
      >
        {(access.admin || access.nhanVien) && (
          <>
            <Form.Item rules={[...rules.required]} name="phamVi" label="Phạm vi">
              <Select
                onChange={(val: string) => {
                  setPhamVi(val);
                  form.setFieldsValue({ loaiThanhToan: undefined });
                }}
                placeholder="Phạm vi"
              >
                {['Tất cả', 'Hình thức đào tạo'].map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {phamVi === 'Hình thức đào tạo' && (
              <Form.Item
                rules={[...rules.required]}
                name="hinhThucDaoTaoId"
                label="Hình thức đào tạo"
              >
                <Select
                  onChange={(val) => {
                    setHinhThucDaoTaoId(val);
                    form.setFieldsValue({ loaiThanhToan: undefined });
                    setRecordLoaiThanhToan(undefined);
                  }}
                  placeholder="Hình thức đào tạo"
                >
                  {danhSachHinhThucDaoTao?.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.ten_hinh_thuc_dao_tao}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </>
        )}
        <Form.Item name="loaiThanhToan" label="Loại thanh toán" rules={[...rules.required]}>
          <Select
            onChange={(val) => {
              setRecordLoaiThanhToan(danhSach?.find((item) => item.loaiThanhToan === val));
            }}
            placeholder="Chọn loại thanh toán"
            options={danhSach
              ?.filter((item) =>
                phamVi === 'Tất cả' ? item : item.hinhThucDaoTaoId === hinhThucDaoTaoId,
              )
              ?.map((item) => ({
                label: `${item?.loaiThanhToan} (Định kỳ: ${item?.dinhKy ?? ''})`,
                value: item?.loaiThanhToan,
              }))}
          />
        </Form.Item>

        {['Hàng tháng'].includes(recordLoaiThanhToan?.dinhKy ?? '') && (
          <Form.Item rules={[...rules.required]} name="mocThoiGian" label="Tháng">
            <DatePicker style={{ width: '100%' }} picker="month" format="MM/YYYY" />
          </Form.Item>
        )}
        {['6 tháng'].includes(recordLoaiThanhToan?.dinhKy ?? '') && (
          <Form.Item rules={[...rules.required]} name="mocThoiGian" label="Tháng">
            <DatePicker style={{ width: '100%' }} picker="month" format="MM/YYYY" />
          </Form.Item>
        )}
        {['Hàng năm'].includes(recordLoaiThanhToan?.dinhKy ?? '') && (
          <Form.Item rules={[...rules.required]} name="mocThoiGian" label="Năm">
            <DatePicker style={{ width: '100%' }} picker="year" format="YYYY" />
          </Form.Item>
        )}
        {['Hàng quý'].includes(recordLoaiThanhToan?.dinhKy ?? '') && (
          <Form.Item rules={[...rules.required]} name="mocThoiGian" label="Quý">
            <DatePicker style={{ width: '100%' }} picker="quarter" />
          </Form.Item>
        )}
        {['Theo năm học'].includes(recordLoaiThanhToan?.dinhKy ?? '') && (
          <Form.Item rules={[...rules.required]} name="mocThoiGian" label="Năm học">
            <Select showSearch placeholder="Chọn năm học">
              {danhSachNamHoc?.map((item) => (
                <Select.Option key={item.id} value={item?.ten_nam_hoc}>
                  {item?.ten_nam_hoc}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {['Theo kỳ học'].includes(recordLoaiThanhToan?.dinhKy ?? '') && (
          <Form.Item rules={[...rules.required]} name="mocThoiGian" label="Kỳ học">
            <Select showSearch placeholder="Chọn kỳ học">
              {danhSachKyHoc
                ?.filter((item) =>
                  hinhThucDaoTaoId ? item.hinh_thuc_dao_tao_id?.[0] === hinhThucDaoTaoId : item,
                )
                ?.map((item) => (
                  <Select.Option
                    key={item.id}
                    value={`Kỳ ${item.ten_ky_nam_hoc} năm học ${item.nam_hoc_id[1]}`}
                  >
                    Kỳ {item.ten_ky_nam_hoc} năm học {item.nam_hoc_id[1]}{' '}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        )}
        {['Theo đợt'].includes(recordLoaiThanhToan?.dinhKy ?? '') && (
          <Form.Item rules={[...rules.required]} name="mocThoiGian" label="Đợt">
            <Input placeholder="Nhập đợt" />
          </Form.Item>
        )}
        {postTypeCongNo === 'normal' && (
          <>
            <Form.Item rules={[...rules.required]} name="maSinhVien" label="Sinh viên">
              <Select
                loading={loadingUser}
                onSearch={(value) => {
                  debouncedSearchUser(value);
                }}
                showSearch
                allowClear
                placeholder="Tìm kiếm theo mã sinh viên"
              >
                {danhSachUser.map((item) => (
                  <Select.Option key={item?.ma_dinh_danh} value={item?.ma_dinh_danh}>
                    {item?.name} ({item?.ma_dinh_danh})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="soTienPhaiThu" label="Số tiền phải thu" rules={[...rules.required]}>
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: '100%' }}
                placeholder="Nhập số tiền"
                max={100000000}
                min={0}
              />
            </Form.Item>
          </>
        )}
        {postTypeCongNo === 'import' && (
          <Form.Item rules={[...rules.required]} name="file" label="File">
            <Upload
              otherProps={{
                maxCount: 1,
                accept: '.xls, .xlsx',
                multiple: false,
                showUploadList: { showDownloadIcon: false },
              }}
            />
          </Form.Item>
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {postTypeCongNo === 'normal' ? 'Thêm mới' : 'Import'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormCongNo;
