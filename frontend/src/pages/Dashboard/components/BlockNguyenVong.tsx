import { ETrangThaiHoSo, Setting } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { Card, Select, Spin } from 'antd';
import { useModel, useAccess } from 'umi';
import { getSoLuongNguyenVongByIdDot } from '@/services/Dashboard/dashboard';
import Donut from '@/components/Chart/Pie';
import _ from 'lodash';

const BlockNguyenVong = (props: {
  groupBy: 'coSo' | 'nganh' | 'doiTuong' | 'phuongThuc';
  title: string;
}) => {
  const { getAllCoSoDaoTaoModel, danhSach, record: recordCoSo } = useModel('cosodaotao');
  const access = useAccess();
  const { record } = useModel('dottuyensinh');
  const { initialState } = useModel('@@initialState');
  const [recordSoLuongNguyenVongTheoNganh, setRecordSoLuongNguyenVongTheoNganh] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [trangThai, setTrangThai] = useState<ETrangThaiHoSo | undefined>();
  const [thuTuNguyenVong, setThuTuNguyenVong] = useState<number | undefined>();
  const [idCoSo, setIdCoSo] = useState<string | undefined>(recordCoSo?._id);
  const getSoLuongNguyenVong = async () => {
    if (record?._id) {
      setLoading(true);
      const response = await getSoLuongNguyenVongByIdDot(record?._id, {
        groupBy: props?.groupBy,
        condition: {
          coSoDaoTao: idCoSo,
          trangThai,
          thuTuNguyenVong,
        },
      });
      setRecordSoLuongNguyenVongTheoNganh(response?.data?.data ?? {});
      setLoading(false);
    }
  };

  useEffect(() => {
    if (danhSach.length === 0) getAllCoSoDaoTaoModel(true);
  }, []);

  useEffect(() => {
    getSoLuongNguyenVong();
  }, [record?._id, idCoSo, trangThai, thuTuNguyenVong]);

  return (
    <Card
      bodyStyle={{ padding: 0 }}
      title={
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: Setting.primaryColor, marginBottom: 8 }}>
            {props?.title ?? ''}
          </div>
          {(access.admin || (access.quanTriVien && !initialState?.currentUser?.idCoSoDaoTao)) && (
            <Select
              allowClear
              onChange={(val) => {
                setIdCoSo(val);
              }}
              value={idCoSo}
              placeholder="Chọn cơ sở đào tạo"
              style={{ width: 400, marginRight: 8 }}
              options={danhSach?.map((item) => ({
                value: item._id,
                label: `${item.tenVietTat} - ${item.ten}`,
              }))}
            />
          )}
          <Select
            value={trangThai}
            onChange={(val) => setTrangThai(val)}
            style={{ width: 200, marginRight: 8 }}
            allowClear
            placeholder="Chọn trạng thái hồ sơ"
            options={Object.values(ETrangThaiHoSo)?.map((item) => ({
              label: item,
              value: item,
            }))}
          />
          <Select
            onChange={(val) => setThuTuNguyenVong(val)}
            placeholder="Chọn thứ tự nguyện vọng"
            allowClear
            style={{ width: 200 }}
            options={_.range(
              1,
              record?.soLuongNguyenVongToiDa ? record.soLuongNguyenVongToiDa + 1 : 6,
            )?.map((item) => ({
              value: item,
              label: `Nguyện vọng ${item}`,
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
