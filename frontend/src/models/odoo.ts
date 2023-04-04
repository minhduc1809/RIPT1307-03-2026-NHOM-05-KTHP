import { EOObject } from '@/services/OdooObject/constants';
import { getOdooObject } from '@/services/OdooObject/odooobject';
import { useState } from 'react';

export default () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getAllNamHocModel = async (
    fields: (keyof OdooObject.INamHoc)[],
    condition?: { [k in keyof OdooObject.INamHoc]: any },
  ): Promise<OdooObject.INamHoc[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.NAM_HOC, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllLopTinChiModel = async (
    fields: (keyof OdooObject.ILopTinChi)[],
    condition?: { [k in keyof OdooObject.ILopTinChi]: any },
  ): Promise<OdooObject.ILopTinChi[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.LOP_TIN_CHI, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllLopHanhChinhModel = async (
    fields: (keyof OdooObject.ILopHanhChinh)[],
    condition?: { [k in keyof OdooObject.ILopHanhChinh]: any },
  ): Promise<OdooObject.ILopHanhChinh[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.LOP_HANH_CHINH, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllNienKhoaModel = async (
    fields: (keyof OdooObject.IKhoaSinhVien)[],
    condition?: { [k in keyof OdooObject.IKhoaSinhVien]: any },
  ): Promise<OdooObject.IKhoaSinhVien[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.KHOA_SINH_VIEN, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllNganhModel = async (
    fields: (keyof OdooObject.INganh)[],
    condition?: { [k in keyof OdooObject.INganh]: any },
  ): Promise<OdooObject.INganh[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.NGANH, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllChuyenNganhModel = async (
    fields: (keyof OdooObject.IChuyenNganh)[],
    condition?: { [k in keyof OdooObject.IChuyenNganh]: any },
  ): Promise<OdooObject.IChuyenNganh[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.CHUYEN_NGANH, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllHinhThucDaoTaoModel = async (
    fields: (keyof OdooObject.IHinhThucDaoTao)[],
    condition?: { [k in keyof OdooObject.IHinhThucDaoTao]: any },
  ): Promise<OdooObject.IHinhThucDaoTao[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.HINH_THUC_DAO_TAO, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllKhoaModel = async (
    fields: (keyof OdooObject.IKhoa)[],
    condition?: { [k in keyof OdooObject.IKhoa]: any },
  ): Promise<OdooObject.IKhoa[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.KHOA, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllHocKyModel = async (
    fields: (keyof OdooObject.IHocKy)[],
    condition?: { [k in keyof OdooObject.IHocKy]: any },
  ): Promise<OdooObject.IHocKy[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.HOC_KY, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllCoSoDaoTaoModel = async (
    fields: (keyof OdooObject.ICoSoDaoTao)[],
    condition?: { [k in keyof OdooObject.ICoSoDaoTao]: any },
  ): Promise<OdooObject.ICoSoDaoTao[]> => {
    setLoading(true);

    try {
      const res = await getOdooObject(EOObject.CO_SO_DAO_TAO, 'many', {
        fields: JSON.stringify(fields),
        condition,
      });
      return res.data?.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAllNamHocModel,
    getAllLopTinChiModel,
    getAllLopHanhChinhModel,
    getAllNganhModel,
    getAllChuyenNganhModel,
    getAllNienKhoaModel,
    getAllHinhThucDaoTaoModel,
    getAllKhoaModel,
    getAllCoSoDaoTaoModel,
    getAllHocKyModel,
  };
};
