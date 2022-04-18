import TableTaiKhoan from './components/TableTaiKhoan';
import Form from './components/Form';
import { useModel } from 'umi';
import { ESystemRole } from '@/utils/constants';

const TaiKhoanChuyenVien = () => {
  const { getUserPageableModel } = useModel('quanlytaikhoan');
  const form: any = () => <Form systemRole={ESystemRole.ChuyenVien} />;
  return (
    <TableTaiKhoan
      title="Tài khoản chuyên viên"
      Form={form}
      getData={() => getUserPageableModel({ systemRole: ESystemRole.ChuyenVien })}
    />
  );
};

export default TaiKhoanChuyenVien;
