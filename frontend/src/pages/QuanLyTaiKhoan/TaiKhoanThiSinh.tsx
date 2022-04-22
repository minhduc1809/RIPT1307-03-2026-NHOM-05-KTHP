import TableTaiKhoan from './components/TableTaiKhoan';
import Form from './components/Form';
import { useModel } from 'umi';
import { ESystemRole } from '@/utils/constants';
import { useCheckAccess } from '@/utils/utils';

const TaiKhoanThiSinh = () => {
  const { getUserPageableModel } = useModel('quanlytaikhoan');
  const updateAll = useCheckAccess('tai-khoan-thi-sinh:update-all');
  const resetAll = useCheckAccess('tai-khoan-thi-sinh:reset-all');
  const deleteAll = useCheckAccess('tai-khoan-thi-sinh:delete-all');
  const form: any = () => <Form systemRole={ESystemRole.ThiSinh} />;
  return (
    <TableTaiKhoan
      phanQuyen={{ updateAll, resetAll, deleteAll }}
      title="Tài khoản thí sinh"
      Form={form}
      getData={() => getUserPageableModel({ systemRole: ESystemRole.ThiSinh })}
    />
  );
};

export default TaiKhoanThiSinh;
