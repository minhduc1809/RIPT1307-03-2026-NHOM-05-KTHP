import { ETrangThaiHoSo } from '@/utils/constants';
import { useCheckAccess } from '@/utils/utils';
import TableHoSo from './components/TableHoSo';

const DaKhoa = () => {
  const thaoTacAll = useCheckAccess('ho-so-xet-tuyen-da-khoa:thao-tac-all');
  const exportAll = useCheckAccess('ho-so-xet-tuyen-da-khoa:export-all');
  return <TableHoSo phanQuyen={{ thaoTacAll, exportAll }} type={ETrangThaiHoSo.dakhoa} />;
};

export default DaKhoa;
