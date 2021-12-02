import { getByKey, put } from '@/services/Setting/setting';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<Setting.Record>();
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getSettingByKeyModel = async (key: string) => {
    setLoading(true);
    const response = await getByKey(key);
    setRecord(response?.data ?? {});
    setLoading(false);
  };

  const putSettingModel = async (payload: { key: string; data: Setting.Record }) => {
    setLoading(true);
    await put(payload);
    message.success('Lưu thành công');
    getSettingByKeyModel('GIOI_THIEU_CHUNG');
    setVisibleForm(false);
  };

  return {
    visibleForm,
    setVisibleForm,
    putSettingModel,
    record,
    setRecord,
    loading,
    setLoading,
    getSettingByKeyModel,
  };
};
