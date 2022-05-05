import useInitModel from '@/hooks/useInitModel';
import { SendEmail, SendEmailPreview, getEmailPageable } from '@/services/SendEmail/SendEmail';
import { useState } from 'react';
import { message } from 'antd';

export default () => {
  const objInitModel = useInitModel('mailer');
  const [recordPost, setRecordPost] = useState<any>([]);
  const {
    setLoading,
    loading,
    visibleForm,
    setVisibleForm,
    page,
    setPage,
    limit,
    setLimit,
    edit,
    setEdit,
    condition,
    setCondition,
    total,
    setTotal,
    filterInfo,
    setFilterInfo,
  } = objInitModel;
  const [visible, setVisible] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<any>([]);
  const [visibleTable, setVisibleTable] = useState<boolean>(false);
  const [danhSach, setDanhSach] = useState<SendEmail.Record[]>([]);
  const [record, setRecord] = useState<SendEmail.Record>();

  const SendEmailPreviewModel = async (payload: {
    content?: string;
    subject?: string;
    file?: any;
  }) => {
    setLoading(true);
    const response = await SendEmailPreview(payload);
    setRecordPost(response.data.data);
    setDataTable(response.data.data);
    setLoading(false);
  };

  const SendEmailModel = async (payload: { content?: string; subject?: string; file?: any }) => {
    setLoading(true);
    const response = await SendEmail(payload);
    setDataTable(response.data.data);
    message.success('Gửi thành công');
    setLoading(false);
  };

  const getEmailPageableModel = async () => {
    setLoading(true);
    const response = await getEmailPageable({ page, limit, condition });
    setDanhSach(response.data.data.result ?? []);
    setTotal(response.data.data.total ?? 0);
    setLoading(false);
  };

  return {
    SendEmailModel,
    SendEmailPreviewModel,
    recordPost,
    setRecordPost,
    loading,
    setLoading,
    visibleForm,
    setVisibleForm,
    visible,
    setVisible,
    dataTable,
    visibleTable,
    setVisibleTable,
    danhSach,
    setDanhSach,
    getEmailPageableModel,
    page,
    setPage,
    condition,
    setCondition,
    limit,
    setLimit,
    total,
    edit,
    setEdit,
    record,
    setRecord,
    filterInfo,
    setFilterInfo,
  };
};
