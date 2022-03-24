import GlobalFooter from '@/components/GlobalFooter';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { Button, Divider, Select, Spin } from 'antd';
import { history, useModel } from 'umi';
import styles from './index.css';

const LuaChonPhuongThuc = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const {
    getAllNamTuyenSinhModel,
    danhSach,
    record: recordNamTuyenSinh,
    loading,
    setRecord: setRecordNamTuyenSinh,
  } = useModel('namtuyensinh');
  const {
    getAllHinhThucDaoTaoModel,
    danhSach: danhSachHinhThucDaoTao,
    record,
  } = useModel('hinhthucdaotao');

  const { setRecord } = useModel('phuongthuctuyensinh');

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
  }, []);

  useEffect(() => {
    if (record?._id) getAllNamTuyenSinhModel(record?._id);
  }, [record?._id]);

  return (
    <>
      <Header />
      <Spin spinning={loading}>
        <div style={{ display: 'flex' }}>
          <div style={{ fontSize: 16 }} className={styles.background}>
            <div className={styles.container}>
              {/* <div className={styles.contentleft}>
              <img
                style={{ margin: '0 auto', maxWidth: 150, maxHeight: 250 }}
                width="60%"
                src={logo}
                alt=""
              />
            </div> */}
              <div style={{ width: 1000 }}>
                <div className={styles.content}>
                  <div className={styles['content-top']}>
                    <b style={{ fontSize: 18 }}>Xin chào {initialState?.currentUser?.ten},</b>
                    <div>
                      Bạn đang tham gia hệ thống xét tuyển trực tuyến đại học chính quy của Học viện
                      Công nghệ Bưu chính Viễn Thông
                    </div>
                  </div>
                </div>
                <div className={styles.form}>
                  <div className={styles.title}>Vui lòng chọn phương thức để tiếp tục:</div>
                  <br />
                  <Select
                    value={record?._id}
                    options={danhSachHinhThucDaoTao?.map((item) => ({
                      value: item._id,
                      label: item.ten,
                    }))}
                    style={{ width: 200, marginRight: 8 }}
                  />
                  <Select
                    onChange={(val) =>
                      setRecordNamTuyenSinh(danhSach?.find((item) => item.nam === val))
                    }
                    value={recordNamTuyenSinh?.nam}
                    options={danhSach?.map((item) => ({
                      value: item.nam,
                      label: `Năm tuyển sinh ${item.nam}`,
                    }))}
                    style={{ width: 200 }}
                  />

                  <div>
                    {recordNamTuyenSinh?.danhSachPhuongThuc?.map((item, index) => (
                      <div
                        key={item.phuongThucTuyenSinh._id}
                        className={styles.answer}
                        onClick={() => {
                          localStorage.setItem('phuongThuc', item.phuongThucTuyenSinh._id);
                          localStorage.setItem('nam', recordNamTuyenSinh.nam.toString());
                          setRecord(item.phuongThucTuyenSinh);
                          history.push('/dotxettuyen');
                        }}
                      >
                        <Button
                          type="primary"
                          style={{ fontWeight: 'bold' }}
                          size="large"
                          shape="circle"
                        >
                          {index + 1}
                        </Button>
                        <div style={{ marginLeft: 8 }}>
                          <div>
                            <b>
                              Phương thức {index + 1}:{' '}
                              {item?.phuongThucTuyenSinh.tenPhuongThuc ?? ''}
                            </b>
                            {/* <div>{item.time}</div>
                          <div>{item.isCoHoSo}</div> */}
                            {/* <div>Trạng thái: {item?.trangThai ?? ''}</div> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {recordNamTuyenSinh?.danhSachPhuongThuc?.length === 0 && (
                    <div>
                      Chưa có thông tin về các phương thức tuyển sinh ở kỳ tuyển sinh năm nay
                    </div>
                  )}
                </div>
                <Divider style={{ marginBottom: 0 }} />
                <div className={styles.footer}>
                  <Button
                    className={styles['footer-btn']}
                    type="link"
                    onClick={() => {
                      setInitialState({ ...initialState, currentUser: undefined });
                      localStorage.removeItem('vaiTro');
                      localStorage.removeItem('token');
                      localStorage.removeItem('accessTokens');
                      localStorage.removeItem('phuongThuc');
                      localStorage.removeItem('dot');
                      localStorage.removeItem('nam');
                      history.push({
                        pathname: '/user/login',
                      });
                    }}
                  >
                    Quay lại đăng nhập
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

export default LuaChonPhuongThuc;
