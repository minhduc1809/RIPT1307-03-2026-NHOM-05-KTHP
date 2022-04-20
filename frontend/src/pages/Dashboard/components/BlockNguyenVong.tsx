import { ETrangThaiHoSo, Setting } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { Card, Select, Spin } from 'antd';
import { useModel } from 'umi';
import { getSoLuongNguyenVongByIdDot } from '@/services/Dashboard/dashboard';
import Donut from '@/components/Chart/Pie';

const BlockNguyenVong = () => {
  const { getAllCoSoDaoTaoModel, danhSach, record: recordCoSo, setRecord } = useModel('cosodaotao');
  const { record } = useModel('dottuyensinh');
  const [recordSoLuongNguyenVongTheoNganh, setRecordSoLuongNguyenVongTheoNganh] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [trangThai, setTrangThai] = useState<ETrangThaiHoSo | undefined>();
  const getSoLuongNguyenVong = async () => {
    if (record?._id) {
      setLoading(true);
      const response = await getSoLuongNguyenVongByIdDot(record?._id, {
        groupBy: 'nganh',
        condition: {
          coSoDaoTao: recordCoSo?._id,
          trangThai,
        },
      });
      setRecordSoLuongNguyenVongTheoNganh(response?.data?.data ?? {});
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCoSoDaoTaoModel();
  }, []);

  useEffect(() => {
    getSoLuongNguyenVong();
  }, [record?._id, recordCoSo?._id, trangThai]);

  return (
    <Card
      title={
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: Setting.primaryColor, marginBottom: 8 }}>
            Số lượng nguyện vọng đăng ký theo ngành
          </div>
          <Select
            onChange={(val) => {
              setRecord(danhSach?.find((item) => item._id === val));
            }}
            value={recordCoSo?._id}
            placeholder="Chọn cơ sở đào tạo"
            style={{ width: 300, marginRight: 8 }}
            options={danhSach?.map((item) => ({
              value: item._id,
              label: `${item.tenVietTat} - ${item.ten}`,
            }))}
          />
          <Select
            value={trangThai}
            onChange={(val) => setTrangThai(val)}
            style={{ width: 200 }}
            allowClear
            placeholder="Chọn trạng thái hồ sơ"
            options={Object.values(ETrangThaiHoSo)?.map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </div>
      }
    >
      {' '}
      <Spin spinning={loading}>
        <Donut
          height={400}
          labelTong=" Nguyện vọng"
          data={Object.keys(recordSoLuongNguyenVongTheoNganh)
            ?.map((item) => ({
              x: item,
              y: recordSoLuongNguyenVongTheoNganh[item],
            }))
            ?.filter((item) => item.y !== 0)}
        />{' '}
      </Spin>
    </Card>
  );
};

export default BlockNguyenVong;
