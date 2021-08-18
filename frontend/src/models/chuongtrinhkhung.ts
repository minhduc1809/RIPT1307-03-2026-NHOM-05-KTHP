import { useState } from 'react';

export default () => {
  const [danhSachChuongTrinhKhung, setdanhSachChuongTrinhKhung] = useState<
    ChuongTrinhKhung.IChuongTrinhKhungRecord[]
  >([]);
  const [loading, setloading] = useState(true);
  return { danhSachChuongTrinhKhung, loading, setloading, setdanhSachChuongTrinhKhung };
};
