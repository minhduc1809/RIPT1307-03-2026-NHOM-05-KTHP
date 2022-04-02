import logo from '@/assets/logo.png';
import ResultWithLogo from '@/components/ResultWithLogo';
import TimeLineChonDot from '@/pages/ChonDot/components/Timeline';
import styles from '@/pages/ChonPhuongThuc/index.css';
import { Button, Spin } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const ModeDot = () => {
  const { getAllDotTuyenSinhModel, danhSach, loading, setDanhSach, setRecord } =
    useModel('dottuyensinh');
  const { record } = useModel('namtuyensinh');
  useEffect(() => {
    if (record?.nam) getAllDotTuyenSinhModel({ namTuyenSinh: record?.nam });
  }, [record?.nam]);

  useEffect(() => {
    return () => {
      setDanhSach([]);
    };
  }, []);

  return (
    <Spin spinning={loading}>
      <div>
        {danhSach?.map((item, index) => (
          <div
            key={item._id}
            className={styles.answer}
            onClick={() => {
              setRecord(item);
              localStorage.setItem('dot', item._id);
              history.push('/hosothisinh/phuongthucxettuyen/chitiet');
            }}
          >
            <Button type="primary" size="large" shape="circle">
              {index + 1}
            </Button>
            <div style={{ marginLeft: 8 }}>
              <div>
                <b>
                  Đợt {index + 1}: {item?.tenDotTuyenSinh ?? ''}
                </b>
                <br />
                <TimeLineChonDot record={item} />
                {/* <div>{item.isCoHoSo}</div>
      <div>Trạng thái: {item?.trangThai ?? ''}</div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
      {danhSach?.length === 0 && (
        <ResultWithLogo
          logo={logo}
          title={`Chưa có thông tin về các đợt tuyển sinh ở kỳ tuyển sinh năm ${record?.nam}`}
        />
      )}
    </Spin>
  );
};

export default ModeDot;
