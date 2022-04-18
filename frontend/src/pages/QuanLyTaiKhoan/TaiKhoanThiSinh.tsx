import TableTaiKhoan from './components/TableTaiKhoan';
import Form from './components/Form';
import { useModel } from 'umi';
import { ESystemRole } from '@/utils/constants';

const TaiKhoanThiSinh = () => {
  const { getUserPageableModel } = useModel('quanlytaikhoan');
  const form: any = () => <Form systemRole={ESystemRole.ThiSinh} />;
  return (
    <TableTaiKhoan
      title="Tài khoản thí sinh"
      Form={form}
      getData={() => getUserPageableModel({ systemRole: ESystemRole.ThiSinh })}
    />
  );
};

export default TaiKhoanThiSinh;
