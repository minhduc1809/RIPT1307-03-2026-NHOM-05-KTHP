import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FilterDotTuyenSinh = () => {
  const {
    getAllDotTuyenSinhModel,
    record: recordDotTuyenSinh,
    danhSach: danhSachDot,
    setRecord: setRecordDotTuyenSinh,
    setDanhSach: setDanhSachDot,
  } = useModel('dottuyensinh');
  const {
    getAllHinhThucDaoTaoModel,
    record,
    setRecord,
    danhSach: danhSachHinhThuc,
  } = useModel('hinhthucdaotao');
  const {
    getAllNamTuyenSinhModel,
    record: recordNamTuyenSinh,
    danhSach: danhSachNam,
    setRecord: setRecordNamTuyenSinh,
  } = useModel('namtuyensinh');

  const { setDanhSach, setPage, setLimit } = useModel('hosoxettuyen');

  const { setDanhSach: setDanhSachTrungTuyen } = useModel('ketquaxettuyen');

  useEffect(() => {
    if (danhSachHinhThuc.length === 0) getAllHinhThucDaoTaoModel();
    return () => {
      setDanhSach([]);
      setPage(1);
      setLimit(10);
    };
  }, []);

  useEffect(() => {
    if (record?._id && !recordNamTuyenSinh?._id) getAllNamTuyenSinhModel(record?._id);
  }, [record?._id]);

  useEffect(() => {
    if (recordNamTuyenSinh?._id && !recordDotTuyenSinh?._id) {
      getAllDotTuyenSinhModel({ namTuyenSinh: recordNamTuyenSinh?.nam }, true);
    }
  }, [recordNamTuyenSinh?._id]);

  return (
    <>
      <Select
        placeholder="Hình thức đào tạo"
        onChange={(val) => {
          setDanhSachDot([]);
          setDanhSach([]);
          setRecordNamTuyenSinh(undefined);
          setRecordDotTuyenSinh(undefined);
          setRecord(danhSachHinhThuc?.find((item) => item._id === val));
          setDanhSachTrungTuyen([]);
        }}
        value={record?._id}
        options={danhSachHinhThuc?.map((item) => ({
          value: item._id,
          label: item.ten,
        }))}
        style={{ width: 120, marginRight: 8, marginBottom: 8 }}
      />
      <Select
        placeholder="Năm tuyển sinh"
        onChange={(val) => {
          setRecordDotTuyenSinh(undefined);
          setRecordNamTuyenSinh(danhSachNam?.find((item) => item.nam === val));
        }}
        value={recordNamTuyenSinh?.nam}
        options={danhSachNam?.map((item) => ({
          value: item.nam,
          label: `Năm ${item.nam}`,
        }))}
        style={{ width: 120, marginRight: 8, marginBottom: 8 }}
      />
      <Select
        placeholder="Đợt tuyển sinh"
        onChange={(val) => setRecordDotTuyenSinh(danhSachDot?.find((item) => item._id === val))}
        value={recordDotTuyenSinh?._id}
        options={danhSachDot?.map((item) => ({
          value: item?._id,
          label: item?.tenDotTuyenSinh,
        }))}
        style={{ width: 300, marginRight: 8, marginBottom: 8 }}
      />
    </>
  );
};

export default FilterDotTuyenSinh;
