import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import rules from '@/utils/rules';
import { checkFileSize, uploadMultiFile } from '@/utils/utils';
import { Form, Row, Col, Input, Button, Divider, Popconfirm } from 'antd';
import { useModel } from 'umi';
import TableGiayToXacNhanNhapHoc from './TableGiayToXacNhanNhapHoc';

export const FormXacNhanNhapHoc = () => {
  const [form] = Form.useForm();
  const {
    loading,
    setVisibleForm,
    xacNhanNhapHocModel,
    record: recordKetQua,
  } = useModel('ketquaxettuyen');
  const { record } = useModel('dottuyensinh');

  return (
    <Form
      labelCol={{ xs: 24, md: 12, lg: 8, xl: 8 }}
      labelAlign="left"
      title="Xác nhận nhập học"
      form={form}
    >
      <Row gutter={[10, 0]}>
        {record?.danhSachThongTinKhaiXacNhan?.map((item, index) => (
          <Col key={item.maThongTin} xs={24}>
            <Form.Item
              initialValue={
                recordKetQua?.thongTinXacNhanNhapHoc?.danhSachThongTinKhaiXacNhan?.find(
                  (thongTin) => thongTin?.maThongTin === item?.maThongTin,
                )?.noiDung
              }
              rules={item?.required ? [...rules.required] : []}
              name={['danhSachThongTinKhaiXacNhan', index, 'noiDung']}
              label={item?.tieuDe}
            >
              <Input placeholder={item?.tieuDe} />
            </Form.Item>
          </Col>
        ))}
        <Divider plain>
          <b>Giấy tờ cần nộp</b>
        </Divider>
        <Col span={24}>
          <TableGiayToXacNhanNhapHoc />
        </Col>
      </Row>
      <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: 20 }}>
        {recordKetQua?.thongTinXacNhanNhapHoc?.trangThaiXacNhan ===
          ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN && (
          <Popconfirm
            okText="Đồng ý"
            onConfirm={async () => {
              const values = await form.validateFields();
              let index = 0;
              values.danhSachThongTinKhaiXacNhan = values?.danhSachThongTinKhaiXacNhan?.map(
                (item: KetQuaXetTuyen.ThongTinKhaiXacNhan, indexThongTin: number) => ({
                  ...record?.danhSachThongTinKhaiXacNhan?.[indexThongTin],
                  ...item,
                }),
              );
              for (const item of values?.danhSachGiayToXacNhanNhapHoc) {
                if (item?.fileList) {
                  const checkSize = checkFileSize(item?.fileList ?? []);
                  if (!checkSize) return;
                  const urlGiayTo = await uploadMultiFile(item?.fileList ?? []);
                  values.danhSachGiayToXacNhanNhapHoc[index] = {
                    ...record?.danhSachGiayToXacNhanNhapHoc?.[index],
                    urlGiayTo,
                  };
                }
                index += 1;
              }
              xacNhanNhapHocModel(recordKetQua?._id ?? '', values);
            }}
            title={
              <div>
                Bạn có chắc chắn xác nhận nhập học?
                <br />
                Sau khi Đồng ý sẽ không thể thay đổi kết quả xác nhận!
              </div>
            }
          >
            <Button loading={loading} style={{ marginRight: 8 }} type="primary">
              Gửi
            </Button>
          </Popconfirm>
        )}

        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </Form.Item>
    </Form>
  );
};
