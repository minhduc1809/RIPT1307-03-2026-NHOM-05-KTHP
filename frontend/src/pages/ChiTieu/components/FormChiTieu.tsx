import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import { useModel } from 'umi';

const FormChiTieu = (props: { idCoSo: string }) => {
  const {
    edit,
    setVisibleForm,
    recordChiTieuChiTiet,
    loading,
    putChiTieuModel,
    record: recordChiTieu,
  } = useModel('chitieu');

  const { record } = useModel('dottuyensinh');

  const [form] = Form.useForm();

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} chỉ tiêu`}>
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={(values) => {
          putChiTieuModel({
            dotTuyenSinh: record?._id ?? '',
            coSoDaoTao: props?.idCoSo ?? '',
            danhSachChiTieuChiTiet: !edit
              ? [
                  values,
                  ...(recordChiTieu?.danhSachChiTieuChiTiet?.map((item) => ({
                    ...item,
                    danhSachNganhChuyenNganh: item?.danhSachNganhChuyenNganh?.map(
                      (nganh) => nganh._id,
                    ),
                  })) ?? []),
                ]
              : recordChiTieu?.danhSachChiTieuChiTiet?.map((item) => {
                  if (item?._id === recordChiTieuChiTiet?._id) {
                    return values;
                  } else
                    return {
                      ...item,
                      danhSachNganhChuyenNganh: item?.danhSachNganhChuyenNganh?.map(
                        (nganh) => nganh._id,
                      ),
                    };
                }) ?? [],
          });
        }}
      >
        <Form.Item
          rules={[...rules.required]}
          label="Danh sách ngành"
          name="danhSachNganhChuyenNganh"
          initialValue={recordChiTieuChiTiet?.danhSachNganhChuyenNganh?.map((item) => item._id)}
        >
          <Select
            filterOption={(value, option) => includes(option?.label ?? '', value)}
            placeholder="Chọn ngành"
            mode="multiple"
            options={record?.danhSachNganhTuyenSinh?.map((item) => ({
              label: item.nganh.ten,
              value: item.nganh._id,
            }))}
          />
        </Form.Item>
        <Form.Item
          rules={[...rules.required]}
          label="Danh sách đối tượng"
          name="danhSachMaDoiTuong"
          initialValue={recordChiTieuChiTiet?.danhSachMaDoiTuong}
        >
          <Select
            filterOption={(value, option) => includes(option?.label ?? '', value)}
            placeholder="Chọn đối tượng"
            mode="multiple"
            options={record?.danhSachDoiTuongTuyenSinh?.map((item) => ({
              label: item.thongTinDoiTuong.tenDoiTuong,
              value: item.maDoiTuong,
            }))}
          />
        </Form.Item>
        <Form.Item
          rules={[...rules.required]}
          label="Danh sách tổ hợp"
          name="danhSachToHopXetTuyen"
          initialValue={recordChiTieuChiTiet?.danhSachToHopXetTuyen}
        >
          <Select
            placeholder="Chọn tổ hợp"
            mode="multiple"
            options={record?.danhSachToHopLuaChon?.map((item) => ({ label: item, value: item }))}
          />
        </Form.Item>
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item
              initialValue={recordChiTieuChiTiet?.chiTieuSoLuong}
              name="chiTieuSoLuong"
              label="Chỉ tiêu số lượng"
              rules={[...rules.required]}
            >
              <InputNumber
                min={0}
                max={1000000}
                style={{ width: '100%' }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              initialValue={recordChiTieuChiTiet?.phanTramTroi}
              name="phanTramTroi"
              label="Phần trăm trội"
              rules={[...rules.required]}
            >
              <InputNumber
                min={0}
                max={10000}
                style={{ width: '100%' }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              initialValue={recordChiTieuChiTiet?.chiTieuDiem}
              name="chiTieuDiem"
              label="Chỉ tiêu điểm"
              rules={[...rules.required]}
            >
              <InputNumber
                min={0}
                max={1000000}
                style={{ width: '100%' }}
                placeholder="Nhập số lượng"
              />
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

export default FormChiTieu;
