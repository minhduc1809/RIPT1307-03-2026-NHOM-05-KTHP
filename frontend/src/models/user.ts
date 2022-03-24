import { register, updateCCCD } from '@/services/ant-design-pro/api';
import type { Login } from '@/services/ant-design-pro/typings';
import { message, Modal } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const registerModel = async (payload: Login.RegisterPayload) => {
    const response = await register(payload);
    if (response?.data?.success === false) {
      Modal.error({
        title: response?.data?.message,
      });
    } else {
      Modal.success({
        onOk: () => setIsLogin(true),
        title:
          'Đăng ký tài khoản thành công, vui lòng kiểm tra email kích hoạt tài khoản trong hòm thư điện tử của bạn.',
      });
    }
  };

  const updateCCCDModel = async (payload: {
    cmtCccd: string;
    ngayCapCmtCccd: string;
    noiCapCmtCccd: string;
  }) => {
    const response = await updateCCCD(payload);
    setInitialState({ ...initialState, currentUser: response?.data?.data });
    message.success('Cập nhật thành công');
  };

  return {
    isLogin,
    setIsLogin,
    updateCCCDModel,
    registerModel,
  };
};
