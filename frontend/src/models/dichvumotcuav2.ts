/* eslint-disable no-underscore-dangle */
import {
  getBieuMauAdmin,
  postBieuMauAdmin,
  putBieuMauAdmin,
  deleteBieuMauAdmin,
  getAllBieuMau,
  getDonSinhVien,
  postDonSinhVien,
  chuyenVienDieuPhoiDuyetDon,
  getDonThaoTacChuyenVienDieuPhoi,
  getAllBieuMauChuyenVien,
  getDonThaoTacChuyenVienXuLy,
  chuyenVienXuLyDuyetDon,
  dieuPhoiDon,
  getTrangThaiDon,
} from '@/services/DichVuMotCuaV2/dichvumotcuav2';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<DichVuMotCuaV2.BieuMau[]>([]);
  const [danhSachDon, setDanhSachDon] = useState<DichVuMotCuaV2.Don[]>([]);
  const [danhSachDonThaoTac, setDanhSachDonThaoTac] = useState<DichVuMotCuaV2.DonThaoTac[]>([]);
  const [danhSachDataTable, setDanhSachDataTable] =
    useState<Record<string, { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }>[]>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [record, setRecord] = useState<DichVuMotCuaV2.BieuMau>();
  const [recordDon, setRecordDon] = useState<DichVuMotCuaV2.Don>();
  const [recordCauHinhBieuMau, setRecordCauHinhBieuMau] = useState<DichVuMotCuaV2.BieuMau>({
    ten: '',
    _id: '',
    ghiChu: '',
    cauHinhBieuMau: [],
    quyTrinh: {
      danhSachBuoc: [],
    },
  });
  const [recordDonThaoTac, setRecordDonThaoTac] = useState<DichVuMotCuaV2.DonThaoTac>();
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [thuTuc, setThuTuc] = useState<DichVuMotCuaV2.ThuTuc>();
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleFormBieuMau, setVisibleFormBieuMau] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [current, setCurrent] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [typeForm, setTypeForm] = useState<string>('add');
  const [trangThaiQuanLyDon, setTrangThaiQuanLyDon] = useState<string>('PENDING');
  const [recordTrangThaiDon, setRecordTrangThaiDon] = useState<DichVuMotCuaV2.TrangThaiBuoc[]>([]);

  const getBieuMauAdminModel = async () => {
    setLoading(true);
    const response = await getBieuMauAdmin({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getDonSinhVienModel = async () => {
    setLoading(true);
    const response = await getDonSinhVien({ page, limit, condition });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllBieuMauModel = async () => {
    setLoading(true);
    const response = await getAllBieuMau();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const postBieuMauAdminModel = async (payload: DichVuMotCuaV2.BieuMau) => {
    setLoading(true);
    await postBieuMauAdmin(payload);
    message.success('Thêm thành công');
    setLoading(false);
    setVisibleForm(false);
    getBieuMauAdminModel();
  };

  const putBieuMauAdminModel = async (payload: { data: DichVuMotCuaV2.BieuMau; id?: string }) => {
    // setLoading(true);
    await putBieuMauAdmin(payload);
    message.success('Lưu thành công');
    // setLoading(false);
    setVisibleForm(false);
    getBieuMauAdminModel();
  };

  const deleteBieuMauAdminModel = async (id: string) => {
    if (!id) return;
    setLoading(true);
    await deleteBieuMauAdmin(id);
    message.success('Xóa thành công');
    setLoading(false);
    getBieuMauAdminModel();
  };

  const postDonSinhVienModel = async (payload: {
    duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
    dichVuId: string;
  }) => {
    setLoading(true);
    await postDonSinhVien(payload);
    message.success('Gửi đơn thành công');
    setLoading(false);
    setVisibleFormBieuMau(false);
  };

  const getDonThaoTacChuyenVienDieuPhoiModel = async () => {
    setLoading(true);
    const response = await getDonThaoTacChuyenVienDieuPhoi({
      page,
      limit,
      condition: { ...condition, trangThai: trangThaiQuanLyDon, idDichVu: record?._id },
    });
    setDanhSachDonThaoTac(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const chuyenVienDieuPhoiDuyetDonModel = async (payload: {
    type: string;
    idDonThaoTac: string;
  }) => {
    await chuyenVienDieuPhoiDuyetDon(payload);
    message.success('Xử lý thành công');
    setVisibleFormBieuMau(false);
    getDonThaoTacChuyenVienDieuPhoiModel();
  };

  const getDonThaoTacChuyenVienXuLyModel = async () => {
    setLoading(true);
    const response = await getDonThaoTacChuyenVienXuLy({
      page,
      limit,
      condition: { ...condition, trangThai: trangThaiQuanLyDon, idDichVu: record?._id },
    });
    setDanhSachDonThaoTac(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const chuyenVienXuLyDuyetDonModel = async (payload: { type: string; idDonThaoTac: string }) => {
    await chuyenVienXuLyDuyetDon(payload);
    message.success('Xử lý thành công');
    setVisibleFormBieuMau(false);
    getDonThaoTacChuyenVienXuLyModel();
  };

  const getAllBieuMauChuyenVienModel = async () => {
    const response = await getAllBieuMauChuyenVien();
    setDanhSach(response?.data?.data ?? {});
  };

  const dieuPhoiDonModel = async (payload: {
    idDonThaoTac: string;
    data: {
      nguoiDuocGiao: {
        _id: string;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: string;
        maDinhDanh: string;
      };
    };
  }) => {
    setLoading(true);
    await dieuPhoiDon(payload);
    message.success('Điều phối thành công');
    setLoading(false);
    setVisibleFormBieuMau(false);
    getDonThaoTacChuyenVienDieuPhoiModel();
  };

  const getTrangThaiDonModel = async (idDon: string) => {
    setLoading(true);
    const response = await getTrangThaiDon(idDon, { condition });
    setRecordTrangThaiDon(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    thuTuc,
    setThuTuc,
    getTrangThaiDonModel,
    recordTrangThaiDon,
    setRecordTrangThaiDon,
    dieuPhoiDonModel,
    getDonThaoTacChuyenVienXuLyModel,
    chuyenVienXuLyDuyetDonModel,
    danhSachDataTable,
    setDanhSachDataTable,
    recordDonThaoTac,
    setRecordDonThaoTac,
    getAllBieuMauChuyenVienModel,
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    danhSachDonThaoTac,
    setDanhSachDonThaoTac,
    getDonThaoTacChuyenVienDieuPhoiModel,
    chuyenVienDieuPhoiDuyetDonModel,
    recordCauHinhBieuMau,
    setRecordCauHinhBieuMau,
    current,
    setCurrent,
    typeForm,
    setTypeForm,
    postDonSinhVienModel,
    danhSachDon,
    setDanhSachDon,
    recordDon,
    setRecordDon,
    getDonSinhVienModel,
    getAllBieuMauModel,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    deleteBieuMauAdminModel,
    putBieuMauAdminModel,
    postBieuMauAdminModel,
    getBieuMauAdminModel,
    danhSach,
    setDanhSach,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    record,
    setRecord,
    loading,
    setLoading,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
    page,
    limit,
    setPage,
    setLimit,
  };
};
