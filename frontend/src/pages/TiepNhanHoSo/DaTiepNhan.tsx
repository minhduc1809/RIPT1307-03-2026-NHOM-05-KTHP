import { ETrangThaiHoSo } from '@/utils/constants';
import { useCheckAccess } from '@/utils/utils';
import TableHoSo from './components/TableHoSo';

const DaTiepNhan = () => {
  const thaoTacAll = useCheckAccess('ho-so-xet-tuyen-da-tiep-nhan:thao-tac-all');
  const exportAll = useCheckAccess('ho-so-xet-tuyen-da-tiep-nhan:export-all');
  return <TableHoSo phanQuyen={{ thaoTacAll, exportAll }} type={ETrangThaiHoSo.DA_TIEP_NHAN} />;
};

export default DaTiepNhan;
