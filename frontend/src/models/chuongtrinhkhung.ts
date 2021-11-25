import { getTienTrinhHocTap } from '@/services/chuongtrinhkhung/chuongtrinhkhung';
import { useState } from 'react';

export default () => {
  const [tienTrinhHocTap, setTienTrinhHocTap] = useState<
    ChuongTrinhKhung.IChuongTrinhKhungRecord[]
  >([]);
  const [loading, setLoading] = useState(true);

  const getTienTrinhHocTapModel = async () => {
    try {
      setLoading(true);
      const response = await getTienTrinhHocTap();
      setTienTrinhHocTap(response?.data?.data ?? []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return { tienTrinhHocTap, loading, setLoading, setTienTrinhHocTap, getTienTrinhHocTapModel };
};
