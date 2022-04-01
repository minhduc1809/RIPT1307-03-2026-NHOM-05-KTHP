import rules from '@/utils/rules';
import { currencyFormat } from '@/utils/utils';
import { EditOutlined, FormOutlined } from '@ant-design/icons';
import { Button, DatePicker, Descriptions, Form, InputNumber, Popconfirm } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';

// import { DescriptionWrapper } from './index.style';

export interface ThongTinThanhToanProps {
  trangThaiThanhToan: string;
}

const ThongTinThanhToan = (props: ThongTinThanhToanProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const access = useAccess();
  const {
    invoice,
    payInvoiceByIdentityCodeModel,
    refundInvoiceByIdentityCodeModel,
    editInvoiceByIdentityCodeModel,
  } = useModel('thanhtoan');
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
            ? `${!access.thiSinh ? 'Sinh viên' : 'Bạn'} đã hoàn thành nộp Lệ phí`
            : `${!access.thiSinh ? 'Sinh viên' : 'Bạn'} chưa nộp đủ Lệ phí`}
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
        {!edit ? (
          <Descriptions.Item label="Số tiền đã nộp">
            {currencyFormat(invoice?.amountPaid ?? 0)} đ
          </Descriptions.Item>
        ) : (
          <Descriptions.Item label="Số tiền đã nộp">
            <div style={{ display: 'flex' }}>
              <Form.Item
                rules={[...rules.required]}
                name="amountPaidEdit"
                style={{ marginBottom: 0 }}
                initialValue={invoice?.amountPaid ?? 0}
              >
                <InputNumber
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  max={1000000000}
                  style={{ width: 180 }}
                  placeholder="Số tiền đã nộp"
                  min={0}
                />
              </Form.Item>
              <Popconfirm
                title="Bạn có chắc chắn chỉnh sửa số tiền đã thanh toán của thí sinh không?"
                onConfirm={async () => {
                  const amountPaid = form.getFieldValue('amountPaidEdit');
                  if (amountPaid >= 0)
                    editInvoiceByIdentityCodeModel(invoice?.identityCode ?? '', {
                      amountPaid,
                    });
                }}
              >
                <Button type="primary" style={{ marginLeft: 10 }}>
                  Lưu
                </Button>
              </Popconfirm>
              <Button
                onClick={() => {
                  setEdit(false);
                }}
                style={{ marginLeft: 8 }}
              >
                Hủy
              </Button>
            </div>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Số tiền còn lại phải nộp">
          {currencyFormat(invoice?.amountRemaining ?? 0)} đ
        </Descriptions.Item>
        <Descriptions.Item
          label={`Số tiền ${access.thiSinh ? 'thanh toán thừa' : 'phải hoàn trả'}`}
        >
          {currencyFormat(invoice?.amountRefund ?? 0)} đ
        </Descriptions.Item>
        {((invoice?.amountRemaining && invoice.amountRemaining > 0) ||
          (invoice?.amountRefund && invoice.amountRefund > 0)) &&
          access.chuyenVien && (
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

      {((invoice?.amountRemaining && invoice.amountRemaining > 0) ||
        (invoice?.amountRefund && invoice.amountRefund > 0)) &&
      access.chuyenVien ? (
        <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: 8 }}>
          {invoice?.amountPaid && invoice.amountPaid > 0 && access.chuyenVien ? (
            <Button
              onClick={() => {
                setEdit(true);
              }}
              style={{ marginRight: 8 }}
              icon={<FormOutlined />}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <></>
          )}
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
