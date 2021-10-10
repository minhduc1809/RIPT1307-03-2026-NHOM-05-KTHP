import { Popover, Typography } from 'antd';
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
          <div>
            <b>{title}</b>
          </div>
          <div>Điểm thang 4: {diem?.diem_thang_4 ?? 'Chưa cập nhật'}</div>
          <div>Điểm thang 10: {diem?.diem_hoc_phan ?? 'Chưa cập nhật'}</div>
          <div>Điểm chữ: {diem?.diem_chu ?? 'Chưa cập nhật'}</div>
        </>
      }
    >
      <div className={styles[type]} style={{ backgroundColor: !diem ? '#f0f0f0' : 'pink' }}>
        <div style={{ textAlign: 'center' }}>
          <Typography.Paragraph
            style={{ marginBottom: 0 }}
            ellipsis={{ rows: 2, expandable: false }}
          >
            {title}
          </Typography.Paragraph>
        </div>
        <div>({number} TC)</div>
        <div>GPA: {diem?.diem_thang_4 || '-'}</div>
      </div>
    </Popover>
  ) : (
    <div className={styles[type]}>
      <div style={{ textAlign: 'center' }}>{title}</div>
      <div>({number} TC)</div>
      <div>GPA: {diem?.diem_thang_4 || '-'}</div>
    </div>
  );
};

export default Block;
