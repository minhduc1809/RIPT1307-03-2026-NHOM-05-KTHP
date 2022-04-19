import { Card, Select } from 'antd';
import NhomVaiTro from './components/NhomVaiTro';
import { useModel } from 'umi';
import { Role } from '@/utils/constants';
import ChucNang from './ChucNang';
import { useEffect } from 'react';

const PhanQuyen = () => {
  const { setVaiTro, vaiTro, setDanhSachNhomVaiTro } = useModel('phanquyen');

  useEffect(() => {
    return () => {
      setDanhSachNhomVaiTro([]);
      setVaiTro('nhan_vien');
    };
  }, []);

  return (
    <Card title="Phân chức năng">
      <div>
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
      </div>
      <br />
      <NhomVaiTro />
      <br />
      <ChucNang />
    </Card>
  );
};

export default PhanQuyen;
