import { Card } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ChucNang from './ChucNang';

const PhanQuyen = () => {
  const { vaiTro, setDanhSachNhomVaiTro, getAllVaiTroModel, getAllNhomVaiTroModel } =
    useModel('phanquyen');

  useEffect(() => {
    getAllVaiTroModel();

    return () => {
      setDanhSachNhomVaiTro([]);
    };
  }, []);

  useEffect(() => {
    getAllNhomVaiTroModel();
  }, [vaiTro]);

  return (
    <Card title="Chức năng">
      <ChucNang />
    </Card>
  );
};

export default PhanQuyen;
