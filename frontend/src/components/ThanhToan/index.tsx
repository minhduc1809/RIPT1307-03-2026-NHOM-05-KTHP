import { useEffect } from 'react';
import { useModel, useAccess } from 'umi';
import ThongTinThanhToan from './ThongTinThanhToan';

const ThanhToan = (props: { record?: DichVuMotCuaV2.Don }) => {
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

  return (
    <div>
      <ThongTinThanhToan trangThaiThanhToan={props?.record?.trangThaiThanhToan ?? ''} />
      {access.sinhVien && (
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
