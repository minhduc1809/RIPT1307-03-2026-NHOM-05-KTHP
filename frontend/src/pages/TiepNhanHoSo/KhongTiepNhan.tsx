import { ETrangThaiHoSo } from '@/utils/constants';
import { useCheckAccess } from '@/utils/utils';
import TableHoSo from './components/TableHoSo';

const KhongTiepNhan = () => {
  const thaoTacAll = useCheckAccess('ho-so-xet-tuyen-khong-tiep-nhan:thao-tac-all');
  const exportAll = useCheckAccess('ho-so-xet-tuyen-khong-tiep-nhan:export-all');
  return <TableHoSo phanQuyen={{ thaoTacAll, exportAll }} type={ETrangThaiHoSo.khongtiepnhan} />;
};

export default KhongTiepNhan;
