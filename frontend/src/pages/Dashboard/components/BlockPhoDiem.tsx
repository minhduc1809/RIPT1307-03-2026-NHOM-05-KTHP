import Basiccolumn from '@/components/Chart/Column';
import { getPhoDiemByIdDot } from '@/services/Dashboard/dashboard';
import { ETrangThaiHoSo, Setting } from '@/utils/constants';
import { Card, InputNumber, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const BlockPhoDiem = () => {
  const { danhSach, record: recordCoSo } = useModel('cosodaotao');
  const { record } = useModel('dottuyensinh');
  const [dataPhoDiem, setDataPhoDiem] = useState<{ diem: string; tong: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [trangThai, setTrangThai] = useState<ETrangThaiHoSo | undefined>();
  const [thuTuNguyenVong, setThuTuNguyenVong] = useState<number | undefined>();
  const [idCoSo, setIdCoSo] = useState<string | undefined>(recordCoSo?._id);
  const [idNganh, setIdNganh] = useState<string | undefined>();
  const [range, setRange] = useState<number | undefined>();
  const getPhoDiem = async () => {
    if (record?._id) {
      setLoading(true);
      const response = await getPhoDiemByIdDot(record?._id, {
        condition: {
          coSoDaoTao: idCoSo,
          trangThai,
          thuTuNguyenVong,
          nganhChuyenNganh: idNganh,
          range,
        },
      });
      setDataPhoDiem(response?.data?.data ?? []);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhoDiem();
  }, [record?._id, idCoSo, trangThai, thuTuNguyenVong, range]);

  const danhSachNganh = idCoSo
    ? record?.danhSachNganhTuyenSinh?.filter((item) =>
        item.danhSachCoSoDaoTao.map((coSo) => coSo._id)?.includes(idCoSo),
      ) ?? []
    : record?.danhSachNganhTuyenSinh ?? [];

  return (
    <Card
      bodyStyle={{ padding: 0 }}
      title={
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: Setting.primaryColor, marginBottom: 8 }}>
            Thống kê phổ điểm theo ngành
          </div>
          <Select
            allowClear
            onChange={(val) => {
              setIdCoSo(val);
            }}
            value={idCoSo}
            placeholder="Lọc theo cơ sở đào tạo"
            style={{ width: 350, marginRight: 8 }}
            options={danhSach?.map((item) => ({
              value: item._id,
              label: `${item.tenVietTat} - ${item.ten}`,
            }))}
          />
          <Select
            value={trangThai}
            onChange={(val) => setTrangThai(val)}
            style={{ width: 200, marginRight: 8 }}
            allowClear
            placeholder="Lọc theo trạng thái hồ sơ"
            options={Object.values(ETrangThaiHoSo)?.map((item) => ({
              label: item,
              value: item,
            }))}
          />
          <Select
            onChange={(val) => setThuTuNguyenVong(val)}
            placeholder="Lọc theo thứ tự nguyện vọng"
            allowClear
            style={{ width: 200, marginRight: 8 }}
            options={_.range(
              1,
              record?.soLuongNguyenVongToiDa ? record.soLuongNguyenVongToiDa + 1 : 6,
            )?.map((item) => ({
              value: item,
              label: `Nguyện vọng ${item}`,
            }))}
          />
          <br />
          <Select
            value={idNganh}
            onChange={(val) => setIdNganh(val)}
            placeholder="Lọc theo ngành"
            style={{ width: 350, marginTop: 8 }}
            options={danhSachNganh?.map((item) => ({
              label: `${item.nganh.ten} - ${item.nganh.ma}`,
              value: item.nganh._id,
            }))}
            allowClear
          />
          <InputNumber
            min={1}
            max={10000}
            onChange={(val) => setRange(val ? +val : undefined)}
            style={{ width: 200, marginLeft: 8 }}
            placeholder="Khoảng điểm"
          />
        </div>
      }
    >
      {' '}
      <Spin spinning={loading}>
        <Basiccolumn
          xLabel="Điểm"
          yLabel="Số lượng"
          data={dataPhoDiem?.map((item) => ({ x: item.diem, y: item.tong }))}
        />
      </Spin>
    </Card>
  );
};

export default BlockPhoDiem;
