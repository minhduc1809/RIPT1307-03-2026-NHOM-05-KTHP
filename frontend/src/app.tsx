import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import PageLoading from '@ant-design/pro-layout/es/PageLoading';
import { notification } from 'antd';
import jwt_decode from 'jwt-decode';
import 'moment/locale/vi';
import { AuthProvider } from 'react-oidc-context';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import { getInfo } from './services/ant-design-pro/api';
import './styles/global.less';
import { oidcConfig } from './utils/oidcConfig';
import { type IInitialState } from './utils/typing';
import { type Login } from './services/ant-design-pro/typings';

const loginPath = '/user/login';
const pathAuth = ['/admin/login'];
/**  loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<IInitialState> {
  const fetchUserInfo: () => Promise<Login.User> = async () => {
    try {
      const token = localStorage.getItem('token');
      let currentUser;
      if (token) {
        const decoded = jwt_decode(token) as any;
        currentUser = (await getInfo())?.data?.data;
        currentUser.permissions = decoded?.authorization?.permissions;
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

    return {
      fetchUserInfo,
      currentUser,
    };
  }

  return {
    fetchUserInfo,
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
  /**
   * Xử lý token, get info sau khi đăng nhập
   */
  const handleRole = async (role: { access_token: string; refresh_token: string }) => {
    localStorage.setItem('token', role?.access_token);
    localStorage.setItem('refreshToken', role?.refresh_token);
  };

  return {
    unAccessible: <NotAccessible />,
    noFound: <NotFoundContent />,
    rightContentRender: () => (
      <AuthProvider {...oidcConfig} redirect_uri={window.location.href} automaticSilentRenew>
        <RightContent />
      </AuthProvider>
    ),
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.fullname,
    },

    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const token = localStorage.getItem('token');
      let checkPathAuth = false;
      pathAuth.map((item) => {
        if (location.pathname.includes(item)) checkPathAuth = true;
      });
      if (!token && location.pathname !== loginPath && !checkPathAuth) {
        history.push(loginPath);
      } else if (initialState?.currentUser && token && location.pathname === loginPath) {
        history.push('/dashboard');
      }
    },
    menuItemRender: (item: any, dom: any) => {
      return (
        <div
          style={{ flex: 'auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
          onClick={() => {
            history.push(item?.path ?? '/');
          }}
        >
          {dom}
        </div>
      );
    },
    childrenRender: (dom) => {
      return (
        <AuthProvider
          {...oidcConfig}
          redirect_uri={window.location.href}
          onSigninCallback={(user) => handleRole(user as any)}
        >
          <ErrorBoundary>
            <TechnicalSupportBounder>
              {dom}
              {/* <ReactKeycloakProvider authClient={keycloak}>{dom}</ReactKeycloakProvider> */}
            </TechnicalSupportBounder>
          </ErrorBoundary>
        </AuthProvider>
      );
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
