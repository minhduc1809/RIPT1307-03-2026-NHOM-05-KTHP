import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import TableChucNang from './components/TableChucNang';

const ChucNang = () => {
  const {
    getAllLoaiChucNangModel,
    getAllChucNangModel,
    danhSachChucNang,
    danhSachLoaiChucNang,
    vaiTro,
  } = useModel('phanquyen');

  const [data, setData] = useState<{ tenChucNang: string; children: PhanQuyen.ChucNang[] }[]>([]);

  useEffect(() => {
    getAllChucNangModel();
  }, [vaiTro]);

  useEffect(() => {
    getAllLoaiChucNangModel();
  }, [vaiTro]);

  useEffect(() => {
    const dataTemp: { tenChucNang: string; children: PhanQuyen.ChucNang[] }[] =
      danhSachLoaiChucNang?.map((item) => {
        const arrChucNang = danhSachChucNang?.filter((chucNang) => chucNang.loai === item);
        return {
          tenChucNang: item,
          children: arrChucNang,
        };
      });
    setData(dataTemp);
  }, [danhSachLoaiChucNang, danhSachChucNang]);

  return <TableChucNang data={data} />;
};

export default ChucNang;
