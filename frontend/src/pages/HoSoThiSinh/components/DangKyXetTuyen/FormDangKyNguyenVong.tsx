import { CloseOutlined, PlusOutlined, RetweetOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Tooltip } from 'antd';
import _ from 'lodash';
import { useModel } from 'umi';

const FormDangKyNguyenVong = () => {
  const [form] = Form.useForm();
  const { edit, setVisibleFormNguyenVong, danhSachNguyenVong, setDanhSachNguyenVong } =
    useModel('hosothisinh');

  return (
    <Card title={edit ? 'Chỉnh sửa nguyện vọng' : 'Thêm nguyện vọng'} bordered>
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={(values) => {
          setDanhSachNguyenVong([
            ...danhSachNguyenVong,
            {
              ...values,
              soThuTu: danhSachNguyenVong.length + 1,
              tenNganh: 'Công nghệ thông tin',
              diemQuyDoi: {
                thanhPhan: [
                  { tenThanhPhan: 'Toán học', diem: 9 },
                  { tenThanhPhan: 'Vật lý', diem: 10 },
                  { tenThanhPhan: 'Hóa học', diem: 8 },
                  { tenThanhPhan: 'Ưu tiên khu vực', diem: 0.5 },
                ],
                tongDiem: 28,
              },
            },
          ]);
          setVisibleFormNguyenVong(false);
        }}
      >
        <Form.Item label="Chọn phương thức đăng ký xét tuyển" name="phuongthuc">
          <Select
            style={{ width: '100%' }}
            placeholder="Phương thức xét tuyển"
            // onChange={this.handleChange}
            optionLabelProp="label"
          >
            {[
              {
                maHeThong: 'PT1',
                _id: 1,
                tenPhuongThuc:
                  'Xét tuyển dựa trên kết quả học tập THPT dành cho thí sinh tham gia thi HSG quốc gia',
              },
            ]?.map((item, ind) => (
              <Select.Option
                key={item?.maHeThong}
                value={`${item?.maHeThong}||${item?._id}`}
                label={item?.tenPhuongThuc ?? ''}
              >
                <Tooltip placement="left" title={_.get(item, 'tenPhuongThuc', '')}>
                  Phương thức {ind + 1}: {_.get(item, 'tenPhuongThuc', '')}
                </Tooltip>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Chọn ngành xét tuyển" name="maNganh">
          <Select
            // value={maNganh}
            placeholder="Chọn ngành/chương trình đăng ký xét tuyển"
            style={{ width: '100%' }}
            // onChange={this.onChangeNganh}
          >
            {[
              {
                tenNganh: 'Công nghệ thông tin',
                maNganh: 'CNTT',
                toHopXetTuyen: ['A00', 'A01', 'C00', 'C01'],
              },
            ]?.map((item) => (
              <Select.Option
                key={item.maNganh}
                label={item?.tenNganh}
                value={item?.maNganh}
                toHop={item?.toHopXetTuyen}
              >
                {item?.maNganh ?? ''} - {item?.tenNganh ?? ''} (
                {item?.toHopXetTuyen?.map(
                  (toHop, index) =>
                    `${toHop}${index < item?.toHopXetTuyen?.length - 1 ? ', ' : ''}`,
                )}
                )
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="toHopXetTuyen" label="Chọn tổ hợp xét tuyển">
          <Select
            showSearch
            style={{ width: '100%' }}
            // value={this.state.toHopXetTuyen}
            placeholder="Tổ hợp xét tuyển"
            optionFilterProp="children"
            // notFoundContent={
            //   maNganh ? (
            //     <div>
            //       {`Ngành đang chọn không hỗ trợ tổ hợp ${data?.danhSachToHopXetTuyen?.map(
            //         (toHop, index) =>
            //           `${toHop}${index < data?.danhSachToHopXetTuyen?.length - 1 ? ', ' : ''}`
            //       )}.`}
            //       <br />
            //       Vui lòng quay lại bước 3 để cập nhật danh sách tổ hợp xét tuyển.
            //     </div>
            //   ) : (
            //     'Bạn chưa chọn ngành xét tuyển'
            //   )
            // }
            // onChange={this.onChangeToHop}
            filterOption={(input, option) =>
              option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {['A00', 'A01', 'C00', 'C01']?.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            onClick={() => form.resetFields()}
            icon={<RetweetOutlined />}
            style={{ marginRight: 10 }}
          >
            Làm sạch
          </Button>
          <Button
            icon={<PlusOutlined />}
            // onClick={() => this.handleSubmit(0)}
            type="primary"
            htmlType="submit"
            style={{ marginRight: 10, marginBottom: 10 }}
            // disabled={this.state.disable}
          >
            Lưu
          </Button>
          <Button icon={<CloseOutlined />} onClick={() => setVisibleFormNguyenVong(false)}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormDangKyNguyenVong;
