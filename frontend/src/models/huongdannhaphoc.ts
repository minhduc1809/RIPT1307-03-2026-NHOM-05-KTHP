import useInitModel from '@/hooks/useInitModel';
import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import {
  adminGetHuongDanNhapHocByKetQuaXetTuyen,
  getHuongDanNhapHocByDotNhapHoc,
  thiSinhGetHuongDanNhapHocByKetQuaXetTuyen,
} from '@/services/HuongDanNhapHoc/huongdannhaphoc';
import type { HuongDanNhapHoc } from '@/services/HuongDanNhapHoc/typings';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<HuongDanNhapHoc.Record>();
  const [danhSach, setDanhSach] = useState<HuongDanNhapHoc.Record[]>([]);
  const objInitModel = useInitModel('huong-dan-nhap-hoc', 'condition', setDanhSach, setRecord);
  const { setLoading, page, limit, condition, setTotal } = objInitModel;
  const [danhSachLePhi, setDanhSachLePhi] = useState<DotNhapHoc.LePhi[]>([]);
  const [editLePhi, setEditLePhi] = useState<boolean>(false);
  const [recordLePhi, setRecordLePhi] = useState<DotNhapHoc.LePhi>();
  const [visibleFormLePhi, setVisibleFormLePhi] = useState<boolean>(false);
  const [danhSachGiayTo, setDanhSachGiayTo] = useState<DotTuyenSinh.GiayTo[]>([]);
  const [editGiayTo, setEditGiayTo] = useState<boolean>(false);
  const [recordGiayTo, setRecordGiayTo] = useState<DotTuyenSinh.GiayTo>();
  const [visibleFormGiayTo, setVisibleFormGiayTo] = useState<boolean>(false);
  const [danhSachGiayToTheoDoiTuong, setDanhSachGiayToTheoDoiTuong] = useState<
    DotTuyenSinh.GiayTo[]
  >([]);
  const [editGiayToTheoDoiTuong, setEditGiayToTheoDoiTuong] = useState<boolean>(false);
  const [recordGiayToTheoDoiTuong, setRecordGiayToTheoDoiTuong] = useState<DotTuyenSinh.GiayTo>();
  const [visibleFormGiayToTheoDoiTuong, setVisibleFormGiayToTheoDoiTuong] =
    useState<boolean>(false);
  const [danhSachDoiTuongGiayTo, setDanhSachDoiTuongGiayTo] = useState<
    DotNhapHoc.GiayToTheoDoiTuong[]
  >([]);
  const [editDoiTuongGiayTo, setEditDoiTuongGiayTo] = useState<boolean>(false);
  const [recordDoiTuongGiayTo, setRecordDoiTuongGiayTo] = useState<DotNhapHoc.GiayToTheoDoiTuong>();
  const [visibleFormDoiTuongGiayTo, setVisibleFormDoiTuongGiayTo] = useState<boolean>(false);
  const [danhSachDoiTuongLePhi, setDanhSachDoiTuongLePhi] = useState<
    DotNhapHoc.LePhiTheoDoiTuong[]
  >([]);
  const [editDoiTuongLePhi, setEditDoiTuongLePhi] = useState<boolean>(false);
  const [recordDoiTuongLePhi, setRecordDoiTuongLePhi] = useState<DotNhapHoc.LePhiTheoDoiTuong>();
  const [visibleFormDoiTuongLePhi, setVisibleFormDoiTuongLePhi] = useState<boolean>(false);
  const [danhSachLePhiTheoDoiTuong, setDanhSachLePhiTheoDoiTuong] = useState<DotNhapHoc.LePhi[]>(
    [],
  );
  const [editLePhiTheoDoiTuong, setEditLePhiTheoDoiTuong] = useState<boolean>(false);
  const [recordLePhiTheoDoiTuong, setRecordLePhiTheoDoiTuong] = useState<DotNhapHoc.LePhi>();
  const [visibleFormLePhiTheoDoiTuong, setVisibleFormLePhiTheoDoiTuong] = useState<boolean>(false);
  const thiSinhGetHuongDanNhapHocByKetQuaXetTuyenModel = async (idKetQuaXetTuyen: string) => {
    if (!idKetQuaXetTuyen) return;
    setLoading(true);
    const response = await thiSinhGetHuongDanNhapHocByKetQuaXetTuyen(idKetQuaXetTuyen);
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  const adminGetHuongDanNhapHocByKetQuaXetTuyenModel = async (idKetQuaXetTuyen: string) => {
    setLoading(true);
    const response = await adminGetHuongDanNhapHocByKetQuaXetTuyen(idKetQuaXetTuyen);
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  const getHuongDanNhapHocByDotNhapHocModel = async (idDotNhapHoc: string) => {
    if (!idDotNhapHoc) return;
    setLoading(true);
    const response = await getHuongDanNhapHocByDotNhapHoc(idDotNhapHoc, { page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    adminGetHuongDanNhapHocByKetQuaXetTuyenModel,
    danhSachLePhiTheoDoiTuong,
    setDanhSachLePhiTheoDoiTuong,
    editLePhiTheoDoiTuong,
    setEditLePhiTheoDoiTuong,
    recordLePhiTheoDoiTuong,
    setRecordLePhiTheoDoiTuong,
    visibleFormLePhiTheoDoiTuong,
    setVisibleFormLePhiTheoDoiTuong,
    danhSachDoiTuongLePhi,
    setDanhSachDoiTuongLePhi,
    editDoiTuongLePhi,
    setEditDoiTuongLePhi,
    recordDoiTuongLePhi,
    setRecordDoiTuongLePhi,
    visibleFormDoiTuongLePhi,
    setVisibleFormDoiTuongLePhi,
    danhSachLePhi,
    setDanhSachLePhi,
    editLePhi,
    setEditLePhi,
    recordLePhi,
    setRecordLePhi,
    visibleFormLePhi,
    setVisibleFormLePhi,
    danhSachDoiTuongGiayTo,
    setDanhSachDoiTuongGiayTo,
    editDoiTuongGiayTo,
    setEditDoiTuongGiayTo,
    recordDoiTuongGiayTo,
    setRecordDoiTuongGiayTo,
    visibleFormDoiTuongGiayTo,
    setVisibleFormDoiTuongGiayTo,
    danhSachGiayToTheoDoiTuong,
    setDanhSachGiayToTheoDoiTuong,
    editGiayToTheoDoiTuong,
    setRecordGiayToTheoDoiTuong,
    setEditGiayToTheoDoiTuong,
    recordGiayToTheoDoiTuong,
    visibleFormGiayToTheoDoiTuong,
    setVisibleFormGiayToTheoDoiTuong,
    editGiayTo,
    setEditGiayTo,
    visibleFormGiayTo,
    setVisibleFormGiayTo,
    recordGiayTo,
    setRecordGiayTo,
    danhSachGiayTo,
    setDanhSachGiayTo,
    getHuongDanNhapHocByDotNhapHocModel,
    record,
    danhSach,
    setRecord,
    setDanhSach,
    ...objInitModel,
    thiSinhGetHuongDanNhapHocByKetQuaXetTuyenModel,
  };
};
