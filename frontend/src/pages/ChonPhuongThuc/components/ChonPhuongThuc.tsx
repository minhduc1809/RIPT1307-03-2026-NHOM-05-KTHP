import { Button } from 'antd';
import { history, useModel } from 'umi';
import styles from '../index.css';

const ModePhuongThuc = () => {
  const { record: recordNamTuyenSinh } = useModel('namtuyensinh');
  const { setRecord } = useModel('phuongthuctuyensinh');
  return (
    <div>
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
            <Button type="primary" style={{ fontWeight: 'bold' }} size="large" shape="circle">
              {index + 1}
            </Button>
            <div style={{ marginLeft: 8 }}>
              <div>
                <b>
                  Phương thức {index + 1}: {item?.phuongThucTuyenSinh.tenPhuongThuc ?? ''}
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
        <div>Chưa có thông tin về các phương thức tuyển sinh ở kỳ tuyển sinh năm nay</div>
      )}
    </div>
  );
};

export default ModePhuongThuc;
