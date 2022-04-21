import { useCheckAccess } from '@/utils/utils';
import TableHoSo from './components/TableHoSo';

const TatCaHoSo = () => {
  const thaoTacAll = useCheckAccess('tat-ca-ho-so-xet-tuyen:thao-tac-all');
  const exportAll = useCheckAccess('tat-ca-ho-so-xet-tuyen:export-all');

  return <TableHoSo phanQuyen={{ thaoTacAll, exportAll }} />;
};

export default TatCaHoSo;
