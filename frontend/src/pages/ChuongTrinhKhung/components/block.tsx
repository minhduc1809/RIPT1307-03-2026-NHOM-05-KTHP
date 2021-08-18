import { Popover } from 'antd';
import styles from './block.css';

type Props = {
  title: string;
  number: number;
  type: 'hocky' | 'hocphan';
  hocphantruoc?: ChuongTrinhKhung.IHocPhanRecord[];
  hocphantienquyet?: ChuongTrinhKhung.IHocPhanRecord[];
  maHocPhan?: string;
};

const Block = (props: Props) => {
  const { title, number, type, hocphantienquyet, hocphantruoc } = props;
  return type === 'hocphan' &&
    ((hocphantruoc?.length ?? 0) > 0 || (hocphantienquyet?.length ?? 0) > 0) ? (
    <Popover
      content={
        <>
          {(hocphantruoc?.length ?? 0) > 0 && (
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: 8 }}>
                <b>Học phần trước: </b>
              </div>
              <div>
                {hocphantruoc?.map((item) => (
                  <div>
                    {item.name} ({item.so_tin_chi} TC)
                  </div>
                ))}
              </div>
            </div>
          )}
          {(hocphantienquyet?.length ?? 0) > 0 && (
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: 8 }}>
                <b>Học tiên quyết: </b>
              </div>
              <div>
                {hocphantienquyet?.map((item) => (
                  <div>
                    {item.name} ({item.so_tin_chi} TC)
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      }
    >
      <div className={styles[type]} style={{ backgroundColor: 'pink' }}>
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
