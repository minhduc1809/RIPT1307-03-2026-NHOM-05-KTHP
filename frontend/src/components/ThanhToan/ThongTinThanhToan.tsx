import rules from '@/utils/rules';
import { currencyFormat } from '@/utils/utils';
import { EditOutlined } from '@ant-design/icons';
import { Button, DatePicker, Descriptions, Form, InputNumber } from 'antd';
import moment from 'moment';
import { useAccess, useModel } from 'umi';

// import { DescriptionWrapper } from './index.style';

export interface ThongTinThanhToanProps {
  trangThaiThanhToan: string;
}

const ThongTinThanhToan = (props: ThongTinThanhToanProps) => {
  // const [edit, setEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const access = useAccess();
  const { invoice, payInvoiceByIdentityCodeModel, refundInvoiceByIdentityCodeModel } =
    useModel('thanhtoan');
  return (
    <Form
      form={form}
      onFinish={(values) => {
        values.amountPaid = Number(values?.amountPaid) < 0 ? 0 : Number(values?.amountPaid);
        if (invoice?.amountRemaining && invoice.amountRemaining > 0)
          payInvoiceByIdentityCodeModel(invoice?.identityCode ?? '', values);
        else refundInvoiceByIdentityCodeModel(invoice?.identityCode ?? '', values);
      }}
    >
      <>
        <b>
          <u>Trạng thái </u>
        </b>
        :{' '}
        <b
          style={{
            color:
              props?.trangThaiThanhToan === 'Đã thanh toán đủ' ||
              props?.trangThaiThanhToan === 'Thanh toán thừa'
                ? 'blue'
                : 'red',
          }}
        >
          {props?.trangThaiThanhToan === 'Đã thanh toán đủ' ||
          props?.trangThaiThanhToan === 'Thanh toán thừa'
            ? `${!access.sinhVien ? 'Sinh viên' : 'Bạn'} đã hoàn thành nộp Lệ phí`
            : `${!access.sinhVien ? 'Sinh viên' : 'Bạn'} chưa nộp đủ Lệ phí`}
        </b>
        <p>{`Số lượng: ${invoice?.items?.[0]?.quantity ?? 0} ${
          invoice?.items?.[0]?.unitLabel ?? ''
        }. Mức lệ phí: ${currencyFormat(invoice?.items?.[0]?.unitAmount ?? 0)} đ/${
          invoice?.items?.[0]?.unitLabel ?? ''
        }`}</p>
      </>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Số tiền phải nộp">
          {currencyFormat(invoice?.amountDue ?? 0)} đ
        </Descriptions.Item>
        {/* {edit ? (
          <Descriptions.Item label="Số tiền đã nộp">
            {currencyFormat(invoice?.amountPaid ?? 0)} đ
          </Descriptions.Item>
        ) : ( */}
        <Descriptions.Item label="Số tiền đã nộp">
          {currencyFormat(invoice?.amountPaid ?? 0)} đ
          {/* <Form.Item name='amountPaidEdit'>
         <InputNumber
                        max={1000000000}
                        style={{ width: 180 }}
                        placeholder="Số tiền đã nộp"
                        min={0}
                      />
         </Form.Item> */}
          {/* <Popconfirm
                      title="Bạn có chắc chắn chỉnh sửa số tiền đã thanh toán của thí sinh không?"
                      onConfirm={async () => {
                        const amountPaid = form.getFieldValue('amountPaidEdit');

                        await this.props.dispatch({
                          type: 'timeline/editThanhToan',
                          payload: {
                            amountPaid,
                            _id: this.props?._id,
                          },
                        });
                        if (this.props.onCancel) {
                          this.props.onCancel();
                        }
                      }}
                    >
                      <Button type="primary" style={{ marginLeft: 10 }}>
                        Lưu
                      </Button>
                    </Popconfirm>

                    <Button
                      type="danger"
                      onClick={() => {
                        this.setState({ edit: false });
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      Hủy
                    </Button> */}
        </Descriptions.Item>
        {/* )} */}
        <Descriptions.Item label="Số tiền còn lại phải nộp">
          {currencyFormat(invoice?.amountRemaining ?? 0)} đ
        </Descriptions.Item>
        <Descriptions.Item
          label={`Số tiền ${access.sinhVien ? 'thanh toán thừa' : 'phải hoàn trả'}`}
        >
          {currencyFormat(invoice?.amountRefund ?? 0)} đ
        </Descriptions.Item>
        {((invoice?.amountRemaining && invoice.amountRemaining > 0) ||
          (invoice?.amountRefund && invoice.amountRefund > 0)) &&
          access.nhanVien && (
            <>
              <Descriptions.Item
                label={invoice?.amountRemaining ?? 0 > 0 ? 'Thanh toán' : 'Hoàn trả'}
              >
                <div style={{ display: 'flex' }}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    initialValue={currencyFormat(0)}
                    rules={[...rules.required]}
                    name="amountPaid"
                  >
                    <InputNumber
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      max={
                        invoice?.amountRefund && invoice.amountRefund > 0
                          ? invoice.amountRefund
                          : 99999999
                      }
                      style={{ width: 180 }}
                      placeholder={
                        invoice?.amountRemaining && invoice.amountRemaining > 0
                          ? 'Số tiền cần thanh toán'
                          : 'Số tiền cần hoàn trả'
                      }
                      min={0}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    onClick={() => {
                      form.setFieldsValue({
                        amountPaid:
                          invoice?.amountRemaining && invoice.amountRemaining > 0
                            ? invoice.amountDue - invoice.amountPaid
                            : invoice.amountPaid - invoice.amountDue,
                      });
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    Thanh toán hết
                  </Button>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian thanh toán">
                <Form.Item initialValue={moment(invoice?.transactionDate)} name="transactionDate">
                  <DatePicker
                    style={{ width: 180, minWidth: 180 }}
                    showTime
                    format="HH:mm DD/MM/YYYY"
                    placeholder="Chọn thời gian"
                    disabledDate={(cur) => moment(cur).isAfter(moment())}
                  />
                </Form.Item>
              </Descriptions.Item>
            </>
          )}
      </Descriptions>

      {/* {invoice?.amountPaid&&invoice.amountPaid > 0 && (
                <Button
                  onClick={() => {
                    this.setState({ edit: true });
                  }}
                  style={{ marginRight: 8 }}
                  icon="form"
                  type="danger"
                >
                  Chỉnh sửa
                </Button>
              )} */}
      {((invoice?.amountRemaining && invoice.amountRemaining > 0) ||
        (invoice?.amountRefund && invoice.amountRefund > 0)) &&
      access.nhanVien ? (
        <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: 8 }}>
          <Button
            icon={<EditOutlined />}
            type="primary"
            htmlType="submit"
            style={{ marginTop: 10 }}
          >
            Cập nhật thông tin thanh toán
          </Button>
        </Form.Item>
      ) : (
        <div />
      )}
    </Form>
  );
};

export default ThongTinThanhToan;
