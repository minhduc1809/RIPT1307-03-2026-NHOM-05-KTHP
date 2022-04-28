import { ETrangThaiHoSo } from '@/utils/constants';
import { useCheckAccess } from '@/utils/utils';
import TableHoSo from './components/TableHoSo';

const ChuaKhoa = () => {
  const thaoTacAll = useCheckAccess('ho-so-xet-tuyen-chua-khoa:thao-tac-all');
  const exportAll = useCheckAccess('ho-so-xet-tuyen-chua-khoa:export-all');
  return <TableHoSo phanQuyen={{ thaoTacAll, exportAll }} type={ETrangThaiHoSo.CHUA_KHOA} />;
};

export default ChuaKhoa;
