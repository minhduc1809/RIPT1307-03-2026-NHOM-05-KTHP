import GlobalFooter from '@/components/GlobalFooter';
import Header from '@/components/Header';
import styles from '@/pages/ChonPhuongThuc/index.css';
import { Setting } from '@/utils/constants';
import { Button, Divider, Spin, Statistic } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import { useMediaQuery } from 'react-responsive';

const { Countdown } = Statistic;

const LuaChonDotXetTuyen = () => {
  const isMediumScreen = useMediaQuery({
    query: '(min-width: 753px)',
  });

  const { getAllDotTuyenSinhModel, danhSach, loading, setDanhSach, setRecord } =
    useModel('dottuyensinh');
  const idPhuongThuc = localStorage.getItem('phuongThuc');
  const { getPhuongThucTuyenSinhByIdModel, record } = useModel('phuongthuctuyensinh');
  useEffect(() => {
    if (idPhuongThuc) {
      getPhuongThucTuyenSinhByIdModel(idPhuongThuc);
      getAllDotTuyenSinhModel({ phuongThucTuyenSinh: idPhuongThuc });
    }
  }, [idPhuongThuc]);

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
                <div className={styles.content}>
                  <div className={styles['content-top']}>
                    <b style={{ fontSize: 18 }}>{record?.tenPhuongThuc},</b>
                    <div>Vui lòng chọn 1 đợt xét tuyển để thực hiện đăng ký xét tuyển</div>
                  </div>
                </div>
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
                            <div style={{ display: isMediumScreen ? 'flex' : 'block' }}>
                              Bắt đầu đăng ký xét tuyển:{' '}
                              <Countdown
                                style={{ marginRight: 5 }}
                                value={item.thoiGianMoDangKy}
                                format="Còn D ngày H giờ m phút s giây"
                                valueStyle={{
                                  color: Setting.primaryColor,
                                  fontSize: 16,
                                  marginLeft: isMediumScreen ? 5 : 0,
                                }}
                                // onFinish={finishStep}
                              />{' '}
                              ({moment(item.thoiGianMoDangKy)?.format('HH:mm DD/MM/YYYY')})
                            </div>
                            {/* <div>{item.isCoHoSo}</div>
                          <div>Trạng thái: {item?.trangThai ?? ''}</div> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {danhSach?.length === 0 && (
                    <div>Chưa có thông tin về các đợt tuyển sinh ở kỳ tuyển sinh năm nay</div>
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
