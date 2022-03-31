import GlobalFooter from '@/components/GlobalFooter';
import Header from '@/components/Header';
import ResultWithLogo from '@/components/ResultWithLogo';
import { EHinhThucDangKyXetTuyen } from '@/utils/constants';
import { Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ModeDot from './components/ChonDot';
import ModePhuongThuc from './components/ChonPhuongThuc';
import styles from './index.css';
import logo from '@/assets/logo.png';

const LuaChonPhuongThuc = () => {
  const { initialState } = useModel('@@initialState');
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
    setRecord: setRecordHinhThucDaoTao,
  } = useModel('hinhthucdaotao');

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
  }, []);

  useEffect(() => {
    if (record?._id) getAllNamTuyenSinhModel(record?._id);
  }, [record?._id]);

  useEffect(() => {
    if (recordNamTuyenSinh?.hinhThucDangKyXetTuyen === EHinhThucDangKyXetTuyen.THEO_DOT) {
      localStorage.removeItem('phuongThuc');
    }
  }, [recordNamTuyenSinh?.hinhThucDangKyXetTuyen]);

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
                    placeholder="Chọn hình thức đào tạo"
                    onChange={(val) => {
                      setRecordNamTuyenSinh(undefined);
                      setRecordHinhThucDaoTao(
                        danhSachHinhThucDaoTao?.find((item) => item._id === val),
                      );
                    }}
                    value={record?._id}
                    options={danhSachHinhThucDaoTao?.map((item) => ({
                      value: item._id,
                      label: item.ten,
                    }))}
                    style={{ width: 200, marginRight: 8 }}
                  />
                  <Select
                    placeholder="Chọn năm tuyển sinh"
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
                  {recordNamTuyenSinh?._id && record?._id ? (
                    <div>
                      {recordNamTuyenSinh?.hinhThucDangKyXetTuyen ===
                        EHinhThucDangKyXetTuyen.THEO_DOT && <ModeDot />}
                      {recordNamTuyenSinh?.hinhThucDangKyXetTuyen ===
                        EHinhThucDangKyXetTuyen.THEO_PHUONG_THUC && <ModePhuongThuc />}
                    </div>
                  ) : (
                    <ResultWithLogo
                      logo={logo}
                      title={`Chưa có thông tin về hình thức đào tạo và năm tuyển sinh`}
                    />
                  )}
                </div>
                <br />
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
