import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel, useAccess } from 'umi';
import ThongTinThanhToan from './ThongTinThanhToan';
import Table from '@/components/Table/Table';
import { currencyFormat } from '@/utils/utils';
import moment from 'moment';

const ThanhToan = (props: { record?: { identityCode: string; trangThaiThanhToan: string } }) => {
  // const { record, getSettingByKeyModel } = useModel('setting');
  const { getInvoiceByIdentityCodeModel, invoice, setInvoice } = useModel('thanhtoan');
  const access = useAccess();
  useEffect(() => {
    // getSettingByKeyModel('HDTT');
    return () => {
      setInvoice(undefined);
    };
  }, []);

  useEffect(() => {
    getInvoiceByIdentityCodeModel(props?.record?.identityCode);
  }, [props?.record?.identityCode]);
  let tongTien = 0;
  const listChiTiet: { index: number; quantity: number; unitAmount: number }[] = [];
  invoice?.items?.map((item: { quantity: number; unitAmount: number }, index: number) => {
    tongTien += item?.quantity * item?.unitAmount;
    listChiTiet.push({
      ...item,
      index: index + 1,
    });
  });
  return (
    <div>
      <ThongTinThanhToan trangThaiThanhToan={props?.record?.trangThaiThanhToan ?? ''} />
      <br />
      <Tabs>
        <Tabs.TabPane tab="Chi tiết" key="chitiet">
          <Table
            otherProps={{
              scroll: { x: 600 },
              pagination: false,
            }}
            data={[
              ...listChiTiet,
              {
                productName: 'Tổng',
                quantity: 1,
                unitAmount: tongTien,
              },
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'index',
                width: 80,
                align: 'center',
              },
              {
                title: 'Danh mục',
                dataIndex: 'productName',
                align: 'center',
                render: (val: string) => <div style={{ textAlign: 'left' }}>{val}</div>,
              },
              {
                title: 'Số tiền',
                width: 200,
                align: 'center',
                render: (record: any) => (
                  <div>{currencyFormat(record?.quantity * record?.unitAmount)} đồng</div>
                ),
              },
            ]}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lịch sử thanh toán" key="lichsu">
          <Table
            otherProps={{
              scroll: { x: 600 },
              pagination: false,
            }}
            data={invoice?.paidHistory?.map((item, index) => ({
              ...item,
              index: index + 1,
            }))}
            columns={[
              {
                title: 'STT',
                dataIndex: 'index',
                width: 80,
                align: 'center',
              },
              {
                title: 'Số tiền',
                width: 100,
                align: 'center',
                dataIndex: 'amountPaid',
                render: (val: number) => <div>{currencyFormat(val)}</div>,
              },

              {
                title: 'Thời gian',
                width: 200,
                dataIndex: 'transactionDate',
                align: 'center',
                render: (val: string) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
              },
              {
                title: 'Người thực hiện',
                dataIndex: ['nguoiThucHien', 'hoTen'],
                width: 120,
                align: 'center',
              },
              {
                title: 'Hình thức',
                dataIndex: 'paymentType',
                align: 'center',
                width: 200,
                render: (val: string) => (
                  <div>
                    {val === 'manual' ? 'Chuyên viên cập nhật' : 'Thanh toán bằng mã định danh'}
                  </div>
                ),
              },
            ]}
          />
        </Tabs.TabPane>
      </Tabs>
      {access.thiSinh && (
        <>
          <br />
          <b>
            <u>Hướng dẫn thanh toán:</u>
          </b>

          <p>
            - Nếu sinh viên sử dụng tài khoản BIDV thì mã thanh toán là:{' '}
            <b>{invoice?.identityCode}</b>{' '}
          </p>
          <p>
            - Nếu sinh viên sử dụng tài khoản Ngân hàng khác thì mã thanh toán là:{' '}
            <b>963666{invoice?.identityCode}</b>
          </p>
          <p>
            - Sinh viên có thể tham khảo hướng dẫn thanh toán chi tiết tại{' '}
            <a
              target="_blank"
              href="https://tuyensinhvlvh.ptit.edu.vn/api/documents/fileUpload-1635269140137-ptit_vlvh___hd_thanh_to_n_nh_p_h_c.pdf"
              rel="noreferrer"
            >
              đây
            </a>
          </p>
          <p>
            <b>
              Lưu ý: Sinh viên vui lòng thanh toán chính xác số tiền yêu cầu (không làm tròn) để hệ
              thống ghi nhận giao dịch là hợp lệ
            </b>
          </p>
        </>
      )}
    </div>
  );
};

export default ThanhToan;
