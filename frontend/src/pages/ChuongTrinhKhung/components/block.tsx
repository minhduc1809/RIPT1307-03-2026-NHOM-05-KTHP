import { Popover } from 'antd';
import styles from './block.css';

type Props = {
  title?: string | number;
  number?: number;
  type: 'hocky' | 'hocphan';
  maHocPhan?: string;
  diem?: ChuongTrinhKhung.KetQuaHocTap;
};

const Block = (props: Props) => {
  const { title, number, type, diem } = props;
  return type === 'hocphan' ? (
    <Popover
      content={
        <>
          <div>Điểm thang 4: {diem?.diem_thang_4 ?? 'Chưa cập nhật'}</div>
          <div>Điểm thang 10: {diem?.diem_hoc_phan ?? 'Chưa cập nhật'}</div>
          <div>Điểm chữ: {diem?.diem_chu ?? 'Chưa cập nhật'}</div>
        </>
      }
    >
      <div
        className={styles[type]}
        style={{ backgroundColor: !diem ? 'rgb(177, 224, 252)' : 'pink' }}
      >
        <div style={{ textAlign: 'center' }}>{title}</div>
        <div>({number} TC)</div>
      </div>
    </Popover>
  ) : (
    <div className={styles[type]}>
      <div style={{ textAlign: 'center' }}>{title}</div>
      <div>({number} TC)</div>
    </div>
  );
};

export default Block;
