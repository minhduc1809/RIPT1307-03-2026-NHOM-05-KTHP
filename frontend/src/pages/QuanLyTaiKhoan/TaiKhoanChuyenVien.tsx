import TableTaiKhoan from './components/TableTaiKhoan';
import Form from './components/Form';
import { useModel } from 'umi';
import { ESystemRole } from '@/utils/constants';
import { useCheckAccess } from '@/utils/utils';

const TaiKhoanChuyenVien = () => {
  const { getUserPageableModel } = useModel('quanlytaikhoan');
  const updateAll = useCheckAccess('tai-khoan-quan-tri-vien:update-all');
  const resetAll = useCheckAccess('tai-khoan-quan-tri-vien:reset-all');
  const deleteAll = useCheckAccess('tai-khoan-quan-tri-vien:delete-all');
  const form: any = () => <Form systemRole={ESystemRole.QuanTriVien} />;
  return (
    <TableTaiKhoan
      phanQuyen={{ updateAll, resetAll, deleteAll }}
      title="Tài khoản quản trị viên"
      Form={form}
      getData={() => getUserPageableModel({ systemRole: ESystemRole.QuanTriVien })}
    />
  );
};

export default TaiKhoanChuyenVien;
