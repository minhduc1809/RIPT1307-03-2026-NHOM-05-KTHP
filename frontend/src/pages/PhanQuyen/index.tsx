import { Card } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ChucNang from './ChucNang';

const PhanQuyen = () => {
  const { setVaiTro, vaiTro, setDanhSachNhomVaiTro } = useModel('phanquyen');

  useEffect(() => {
    return () => {
      setDanhSachNhomVaiTro([]);
      setVaiTro('nhan_vien');
    };
  }, []);

  return (
    <Card title="Chức năng">
      {/* <div>
        <b>Vai trò hệ thống: </b>
        <Select
          onChange={(val) => {
            setVaiTro(val);
          }}
          style={{ width: 200 }}
          value={vaiTro}
        >
          {['nhan_vien', 'quan_tri', 'Admin'].map((item) => (
            <Select.Option key={item} value={item}>
              {Role?.[item] ?? ''}
            </Select.Option>
          ))}
        </Select>
      </div> */}
      {/* <br />
      <NhomVaiTro />
      <br /> */}
      <ChucNang />
    </Card>
  );
};

export default PhanQuyen;
