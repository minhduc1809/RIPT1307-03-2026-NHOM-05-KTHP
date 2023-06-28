import { getThongBao } from '@/services/ThongBao';
import { type ThongBao } from '@/services/ThongBao/typing';
import { useState } from 'react';

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [record, setRecord] = useState<ThongBao.IRecord>();
  const [danhSachNoticeIcon, setDanhSachNoticeIcon] = useState<ThongBao.IRecord[]>([]);
  const [pageNoticeIcon, setPageNoticeIcon] = useState<number>(1);
  const [limitNoticeIcon, setLimitNoticeIcon] = useState<number>(20);
  const [totalNoticeIcon, setTotalNoticeIcon] = useState<number>(0);
  const [unreadNoticeIcon, setUnreadNoticeIcon] = useState<number>(0);

  // const [danhSach, setDanhSach] = useState<ThongBao.IRecord[]>([]);
  // const [filterInfo, setFilterInfo] = useState<any>({});
  // const [condition, setCondition] = useState<any>({});
  // const [loaiThongBao, setLoaiThongBao] = useState<string>('TAT_CA');
  // const [edit, setEdit] = useState<boolean>(false);
  // const [visibleForm, setVisibleForm] = useState<boolean>(false);
  // const [total, setTotal] = useState<number>(0);
  // const [page, setPage] = useState<number>(1);
  // const [limit, setLimit] = useState<number>(10);
  // const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>('Tất cả');

  // const getThongBaoAdminModel = async (hinhThucDaoTaoId?: number) => {
  //   setLoading(true);
  //   const response = await getThongBaoAdmin({
  //     page,
  //     limit,
  //     condition: {
  //       ...condition,
  //       hinhThucDaoTaoId: hinhThucDaoTaoId || condition?.hinhThucDaoTaoId,
  //       phamVi,
  //     },
  //   });
  //   setDanhSach(response?.data?.data?.result ?? []);
  //   setTotal(response?.data?.data?.total ?? 0);
  //   setLoading(false);
  // };

  // const postThongBaoByVaiTroModel = async (payload: ThongBao.PostRecord) => {
  //   setLoading(true);
  //   await postThongBaoByVaiTro(payload);
  //   message.success('Gửi thành công');
  //   getThongBaoAdminModel();
  //   setLoading(false);
  //   setVisibleForm(false);
  // };

  // const postThongBaoAllModel = async (payload: ThongBao.PostRecord) => {
  //   setLoading(true);
  //   await postThongBaoAll(payload);
  //   message.success('Gửi thành công');
  //   getThongBaoAdminModel();
  //   setLoading(false);
  //   setVisibleForm(false);
  // };

  // const postThongBaoByDonViModel = async (payload: ThongBao.PostRecord) => {
  //   setLoading(true);
  //   await postThongBaoByDonVi(payload);
  //   message.success('Gửi thành công');
  //   getThongBaoAdminModel();
  //   setLoading(false);
  //   setVisibleForm(false);
  // };

  const getThongBaoModel = async (): Promise<ThongBao.IRecord[]> => {
    setLoading(true);
    try {
      const response = await getThongBao({
        page: pageNoticeIcon,
        limit: limitNoticeIcon,
        condition: undefined,
        sort: { createdAt: -1 },
      });
      setDanhSachNoticeIcon(response?.data?.data?.result ?? []);
      setUnreadNoticeIcon(response?.data?.data?.unread ?? 0);
      setTotalNoticeIcon(response?.data?.data?.total ?? 0);

      return response?.data?.data?.result;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  // const postThongBaoGeneralModel = async (payload: ThongBao.PostRecord) => {
  //   try {
  //     setLoading(true);
  //     await postThongBaoGeneral(payload);
  //     message.success('Gửi thành công');
  //     getThongBaoAdminModel();
  //     setLoading(false);
  //     setVisibleForm(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  // const putThongBaoModel = async (payload: ThongBao.IRecord, idThongBao?: string) => {
  //   if (!idThongBao) return;
  //   setLoading(true);
  //   await putThongBao(idThongBao, payload);
  //   message.success('Lưu thành công');
  //   getThongBaoAdminModel();
  //   setLoading(false);
  //   setVisibleForm(false);
  // };

  // const deleteThongBaoModel = async (idThongBao: string) => {
  //   setLoading(true);
  //   await deleteThongBao(idThongBao);
  //   message.success('Xóa thành công');
  //   setLoading(false);
  //   getThongBaoAdminModel();
  // };

  return {
    // putThongBaoModel,
    // deleteThongBaoModel,
    // phamVi,
    // setPhamVi,
    unreadNoticeIcon,
    totalNoticeIcon,
    danhSachNoticeIcon,
    setDanhSachNoticeIcon,
    pageNoticeIcon,
    setPageNoticeIcon,
    limitNoticeIcon,
    setLimitNoticeIcon,
    // postThongBaoGeneralModel,
    getThongBaoModel,
    // postThongBaoByDonViModel,
    // loaiThongBao,
    // setLoaiThongBao,
    // postThongBaoAllModel,
    // postThongBaoByVaiTroModel,
    // getThongBaoAdminModel,
    // danhSach,
    // setDanhSach,
    // filterInfo,
    // setFilterInfo,
    // condition,
    // setCondition,
    record,
    setRecord,
    loading,
    setLoading,
    // edit,
    // setEdit,
    // visibleForm,
    // setVisibleForm,
    // total,
    // setTotal,
    // page,
    // limit,
    // setPage,
    // setLimit,
  };
};
