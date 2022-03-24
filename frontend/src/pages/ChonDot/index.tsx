import GlobalFooter from '@/components/GlobalFooter';
import Header from '@/components/Header';
import ResultWithLogo from '@/components/ResultWithLogo';
import styles from '@/pages/ChonPhuongThuc/index.css';
import { Button, Divider, Spin } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import TimeLineChonDot from './components/Timeline';
import logo from '@/assets/logo.png';

const LuaChonDotXetTuyen = () => {
  const { getAllDotTuyenSinhModel, danhSach, loading, setDanhSach, setRecord } =
    useModel('dottuyensinh');
  const idPhuongThuc = localStorage.getItem('phuongThuc');
  const nam = localStorage.getItem('nam');
  const { getPhuongThucTuyenSinhByIdModel, record } = useModel('phuongthuctuyensinh');

  useEffect(() => {
    if (idPhuongThuc && !record?._id) {
      getPhuongThucTuyenSinhByIdModel(idPhuongThuc);
    }
  }, [idPhuongThuc]);

  useEffect(() => {
    if (record?._id && nam)
      getAllDotTuyenSinhModel({ phuongThucTuyenSinh: record._id, namTuyenSinh: +nam });
  }, [record?._id, nam]);

  useEffect(() => {
    return () => {
      setDanhSach([]);
    };
  }, []);

  return (
    <>
      <Header />
      <Spin spinning={loading}>
        <div style={{ display: 'flex' }}>
          <div style={{ fontSize: 16 }} className={styles.background}>
            <div className={styles.container}>
              <div style={{ width: 1000 }}>
                {danhSach.length ? (
                  <div className={styles.content}>
                    <div className={styles['content-top']}>
                      <b style={{ fontSize: 18 }}>{record?.tenPhuongThuc},</b>
                      <div>Vui lòng chọn 1 đợt xét tuyển để thực hiện đăng ký xét tuyển</div>
                    </div>
                  </div>
                ) : (
                  <div />
                )}
                <div className={styles.form}>
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
                        <Button type="default" size="large" shape="circle">
                          {index + 1}
                        </Button>
                        <div style={{ marginLeft: 8 }}>
                          <div>
                            <b>
                              Đợt {index + 1}: {item?.tenDotTuyenSinh ?? ''}
                            </b>
                            <TimeLineChonDot record={item} />
                            {/* <div>{item.isCoHoSo}</div>
                          <div>Trạng thái: {item?.trangThai ?? ''}</div> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {danhSach?.length === 0 && record?._id && (
                    <ResultWithLogo
                      logo={logo}
                      title={record?.tenPhuongThuc}
                      subTitle={`Chưa có thông tin về các đợt tuyển sinh ở kỳ tuyển sinh năm ${nam}`}
                    />
                  )}
                </div>
                <Divider style={{ marginBottom: 0 }} />
                <div className={styles.footer}>
                  <Button
                    className={styles['footer-btn']}
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: '/phuongthucxettuyen',
                      });
                    }}
                  >
                    Quay lại
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
      <GlobalFooter />
    </>
  );
};

export default LuaChonDotXetTuyen;
