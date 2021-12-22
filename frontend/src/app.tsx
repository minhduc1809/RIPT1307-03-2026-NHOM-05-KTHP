import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification, Tooltip } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { getInfo, getInfoAdmin } from './services/ant-design-pro/api';
import data from './utils/data';
// import { getPhanNhom } from './utils/utils';

const loginPath = '/user/login';
const pathAuth = ['/admin/login'];
/**  loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: Login.Profile & Login.ProfileAdmin;
  partner_id?: number;
  fetchUserInfo?: () => Promise<{ data: { data: Login.Profile & Login.ProfileAdmin } } | undefined>;
  authorizedRoles?: any[];
  phanNhom?: {
    userId: string;
    danhSachPhanNhom: {
      mucDo: string;
      tenDoiTuong: string;
      idDoiTuong: string;
      nhomVaiTroId: {
        _id: string;
        danhSachChucNang: string[];
      };
    }[];
    vaiTro: string;
  };
}> {
  const fetchUserInfo: () => Promise<any> = async () => {
    try {
      const auth = localStorage.getItem('vaiTro');
      const token = localStorage.getItem('token');
      let currentUser;

      if (auth && token) {
        if (auth === 'Admin') currentUser = (await getInfoAdmin())?.data?.data;
        else currentUser = (await getInfo())?.data?.data;
      }
      return currentUser;
    } catch (error) {
      const { location } = history;
      if (!pathAuth.includes(location.pathname)) history.push(loginPath);
    }
    return undefined;
  };

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    // const phanNhom = await getPhanNhom();
    return {
      fetchUserInfo,
      currentUser,
      settings: {
        primaryColor: 'daybreak',
      },
      authorizedRoles: [],
      // phanNhom,
    };
  }

  return {
    fetchUserInfo,
    settings: { primaryColor: 'daybreak' },
  };
}

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const token = localStorage.getItem('token');
  const authHeader = { ...(token && { Authorization: `Bearer ${token}` }) };
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
  errorHandler: (error: ResponseError) => {
    const { messages } = getIntl(getLocale());
    const { response } = error;

    if (response && response.status) {
      const { status, statusText, url } = response;
      const requestErrorMessage = messages['app.request.error'];
      const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
      const errorDescription = messages[`app.request.${status}`] || statusText;
      notification.error({
        message: errorMessage,
        description: errorDescription,
      });
    }

    if (!response) {
      notification.error({
        description: 'Yêu cầu gặp lỗi',
        message: 'Bạn hãy thử lại sau',
      });
    }
    throw error;
  },
  requestInterceptors: [authHeaderInterceptor],
};

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },

    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const token = localStorage.getItem('token');
      const vaiTro = localStorage.getItem('vaiTro');
      if (!token && location.pathname !== loginPath && !pathAuth.includes(location.pathname)) {
        history.push(loginPath);
      } else if (initialState?.currentUser && token && location.pathname === loginPath) {
        history.push(data.path[`${vaiTro || initialState?.currentUser?.systemRole}`]);
      }
    },
    menuItemRender: (item, dom) => {
      return (
        <Tooltip placement="right" title={item.name}>
          <div
            style={{ flex: 'auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
            onClick={() => {
              history.push(item?.path ?? '/');
            }}
          >
            {dom}
          </div>
        </Tooltip>
      );
    },

    // childrenRender: (dom) => {
    //   return (
    //     <>
    //       {dom}
    //       <SettingDrawer
    //         hideCopyButton
    //         hideHintAlert
    //         settings={initialState?.settings}
    //         disableUrlParams
    //         onSettingChange={(nextSettings) => {
    //           return setInitialState({
    //             ...initialState,
    //             settings: nextSettings,
    //           });
    //         }}
    //       />
    //     </>
    //   );
    // },
    menuHeaderRender: undefined,
    ...initialState?.settings,
    title: 'PTIT S-Link',
  };
};
