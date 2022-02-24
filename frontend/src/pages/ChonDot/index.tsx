import Footer from '@/components/Footer';
import Header from '@/components/Header';
import styles from '@/pages/ChonPhuongThuc/index.css';
import { Button, Divider } from 'antd';
import { history } from 'umi';

const LuaChonDotXetTuyen = () => {
  const danhSachDotTuyenSinh = [
    {
      id: 1,
      title: 'Chính thức',
      time: 'Bắt đầu đăng ký xét tuyển: Còn 23 ngày 0 giờ 11 phút 44 giây (18:00 09/02/2022)',
      isCoHoSo: 'Thí sinh có hồ sơ xét tuyển',
      trangThai: 'Chưa khóa',
    },
    {
      id: 2,
      title: 'Bổ sung',
      time: 'Bắt đầu đăng ký xét tuyển: Còn 23 ngày 0 giờ 11 phút 44 giây (18:00 09/02/2022)',
      isCoHoSo: 'Thí sinh không có hồ sơ xét tuyển',
    },
  ];
  return (
    <>
      {/* <div style={{ position: 'fixed', zIndex: 1000, width: '100%' }}> */}
      <Header />
      {/* </div> */}

      <div style={{ display: 'flex' }}>
        <div style={{ fontSize: 16 }} className={styles.background}>
          <div className={styles.container}>
            <div style={{ width: 1000 }}>
              <div className={styles.content}>
                <div className={styles['content-top']}>
                  <b style={{ fontSize: 18 }}>
                    Phương thức xét tuyển theo đề án tuyển sinh của học viện,
                  </b>
                  <div>Vui lòng chọn 1 đợt xét tuyển để thực hiện đăng ký xét tuyển</div>
                </div>
              </div>
              <div className={styles.form}>
                <div>
                  {danhSachDotTuyenSinh?.map((item, index) => (
                    <div
                      key={item.id}
                      className={styles.answer}
                      onClick={() => {
                        localStorage.setItem('phuongThuc', item.id.toString());
                        localStorage.setItem('dot', item.id.toString());
                        history.push('/dangkyxettuyen');
                      }}
                    >
                      <Button type="default" size="large" shape="circle">
                        {index + 1}
                      </Button>
                      <div style={{ marginLeft: 8 }}>
                        <div>
                          <b>
                            Đợt {index + 1}: {item?.title ?? ''}
                          </b>
                          <div>{item.time}</div>
                          <div>{item.isCoHoSo}</div>
                          <div>Trạng thái: {item?.trangThai ?? ''}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {danhSachDotTuyenSinh?.length === 0 && (
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
                      pathname: '/hosothisinh/phuongthucxettuyen/chitiet',
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
      <div style={{ width: '100%', position: 'absolute', bottom: 0, left: 0 }}>
        <Footer />
      </div>
    </>
  );
};

export default LuaChonDotXetTuyen;
