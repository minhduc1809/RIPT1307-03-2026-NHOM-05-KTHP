import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification, Tooltip } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import GlobalFooter from './components/GlobalFooter';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import { getInfo, getInfoAdmin } from './services/ant-design-pro/api';
import type { Login } from './services/ant-design-pro/typings';
import { ESystemRole } from './utils/constants';
import data from './utils/data';

const loginPath = '/user/login';
const pathAuth = ['/admin/login', '/user/quenMatKhau'];
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
    const currentUser: Login.Profile & Login.ProfileAdmin = await fetchUserInfo();
    // const phanNhom = await getPhanNhom();
    return {
      fetchUserInfo,
      currentUser,
      settings: {
        primaryColor: 'daybreak',
        layout: currentUser?.systemRole === 'Admin' ? 'side' : 'top',
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
    unAccessible: <NotAccessible />,
    noFound: <NotFoundContent />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.ten,
    },
    // headerRender: (props, dom) => <div style={{ backgroundColor: '#CC0D00' }}>{dom}</div>,
    isMobile: true,
    footerRender: () => <GlobalFooter />,
    onPageChange: () => {
      const { location } = history;
      const token = localStorage.getItem('token');
      const vaiTro = initialState?.currentUser?.systemRole;
      const verifiedEmail = initialState?.currentUser?.emailVerify?.verified === true;
      const verifiedCCCD = initialState?.currentUser?.cmtCccd !== undefined;
      if (!token && location.pathname !== loginPath && !pathAuth.includes(location.pathname)) {
        history.push(loginPath);
      } else if (initialState?.currentUser && token) {
        if (
          vaiTro !== ESystemRole.ThiSinh ||
          (vaiTro === ESystemRole.ThiSinh && verifiedCCCD && verifiedEmail)
        ) {
          history.push(
            location.pathname === loginPath
              ? data.path[`${vaiTro || initialState?.currentUser?.systemRole}`]
              : location.pathname,
          );
        } else if (!verifiedEmail) history.push('/kichhoattaikhoan');
        else history.push('/verifycccd');
      }
    },
    menuItemRender: (item, dom) => {
      return (
        <Tooltip
          placement={
            initialState?.currentUser?.systemRole === ESystemRole.ThiSinh ? 'bottom' : 'right'
          }
          title={item.name}
        >
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

    menuHeaderRender: undefined,
    ...initialState?.settings,
    title: 'Xét tuyển PTIT',
  };
};
