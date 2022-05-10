import rules from '@/utils/rules';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import TableGiayTo from './TableGiayTo';
import TableGiayToTheoDoiTuong from './TableGiayToTheoDoiTuong';
import TableLePhi from './TableLePhi';
import TableDoiTuongLePhi from './TableLePhiTheoDoiTuong';

const FormHuongDanNhapHoc = () => {
  const [form] = Form.useForm();
  const {
    loading,
    setVisibleForm,
    postModel,
    edit,
    record,
    putModel,
    danhSachGiayTo,
    danhSachDoiTuongGiayTo,
    getHuongDanNhapHocByDotNhapHocModel,
    danhSachLePhi,
    danhSachDoiTuongLePhi,
  } = useModel('huongdannhaphoc');

  const { record: recordDotNhapHoc } = useModel('dotnhaphoc');

  const { danhSach } = useModel('nganhchuyennganh');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} hướng dẫn nhập học`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const payload = {
            ...values,
            danhSachGiayToCanNop: danhSachGiayTo,
            danhSachGiayToCanNopTheoDoiTuong: danhSachDoiTuongGiayTo,
            danhSachLePhiCanNopTheoDoiTuong: danhSachDoiTuongLePhi,
            danhSachLePhiCanNop: danhSachLePhi?.map((item) => ({
              maLePhi: item.maLePhi,
              ghiChu: item.ghiChu,
              required: item.required,
            })),
            thoiGianBatDau: values.thoiGian[0],
            thoiGianKetThuc: values.thoiGian[1],
            thoiGian: undefined,
            idDotNhapHoc: recordDotNhapHoc?._id,
          };
          if (edit)
            putModel(record?._id ?? '', payload, () => {
              getHuongDanNhapHocByDotNhapHocModel(recordDotNhapHoc?._id ?? '');
            });
          else
            postModel(payload, () => {
              getHuongDanNhapHocByDotNhapHocModel(recordDotNhapHoc?._id ?? '');
            });
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              rules={[...rules.required]}
              name="thoiGian"
              label="Thời gian bắt đầu - Thời gian kết thúc"
              initialValue={[
                record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined,
                record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined,
              ]}
              style={{ marginBottom: 8 }}
            >
              <DatePicker.RangePicker
                format="HH:mm DD-MM-YYYY"
                style={{ width: '100%' }}
                placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                showTime
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              initialValue={record?.diaDiem}
              rules={[...rules.required]}
              name="diaDiem"
              label="Địa điểm"
            >
              <Input placeholder="Địa điểm" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          initialValue={record?.danhSachNganhChuyenNganh?.map((item) => item._id)}
          rules={[...rules.required]}
          name="danhSachNganhChuyenNganh"
          label="Danh sách ngành"
        >
          <Select
            placeholder="Chọn ngành"
            mode="multiple"
            options={danhSach.map((item) => ({
              label: item.ten,
              value: item._id,
            }))}
          />
        </Form.Item>
        <Form.Item name="danhSachGiayToCanNop" label="Danh sách giấy tờ cần nộp">
          <TableGiayTo modelName="huongdannhaphoc" fieldName="GiayTo" />
        </Form.Item>

        <Form.Item
          name="danhSachGiayToCanNopTheoDoiTuong"
          label="Danh sách giấy tờ cần nộp theo đối tượng"
        >
          <TableGiayToTheoDoiTuong />
        </Form.Item>

        <Form.Item name="danhSachLePhiCanNop" label="Danh sách lệ phí cần nộp">
          <TableLePhi modelName="huongdannhaphoc" fieldName="LePhi" />
        </Form.Item>

        <Form.Item
          name="danhSachLePhiCanNopTheoDoiTuong"
          label="Danh sách lệ phí cần nộp theo đối tượng"
        >
          <TableDoiTuongLePhi />
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

export default FormHuongDanNhapHoc;
