import useInitModel from '@/hooks/useInitModel';
import { SendEmail, SendEmailPreview } from '@/services/SendEmail/SendEmail';
import { useState } from 'react';

export default () => {
  const objInitModel = useInitModel();
  const [record, setRecord] = useState<any>([]);
  const { setLoading, loading, visibleForm, setVisibleForm } = objInitModel;
  const [visible, setVisible] = useState<boolean>(false);

  const SendEmailModel = async (payload: { content?: string; subject?: string; file?: any }) => {
    setLoading(true);
    await SendEmail(payload);
    setLoading(false);
  };

  const SendEmailPreviewModel = async (payload: {
    content?: string;
    subject?: string;
    file?: any;
  }) => {
    setLoading(true);
    const response = await SendEmailPreview(payload);
    setRecord(response.data.data);
    setVisible(true);
    setLoading(false);
  };

  return {
    SendEmailModel,
    SendEmailPreviewModel,
    record,
    setRecord,
    loading,
    setLoading,
    visibleForm,
    setVisibleForm,
    visible,
    setVisible,
  };
};
