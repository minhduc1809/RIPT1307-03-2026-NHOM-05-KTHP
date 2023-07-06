import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import { AuthProvider } from 'react-oidc-context';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingPage from './components/Loading';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import './styles/global.less';
import { currentRole } from './utils/ip';
import { oidcConfig } from './utils/oidcConfig';
import { type IInitialState } from './utils/typing';
import OneSignalBounder from './components/OneSignalBounder';

// const loginPath = '/user/login';
// const pathAuth = ['/admin/login'];

/**  loading */
export const initialStateConfig = {
  loading: <LoadingPage />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * // Tobe removed
 * */
export async function getInitialState(): Promise<IInitialState> {
  return {};
}

// Tobe removed
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  return {};
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
    rightContentRender: () => (
      // OIDC Auth Provider for user Logout
      <AuthProvider
        {...oidcConfig}
        redirect_uri={window.location.href}
        automaticSilentRenew={false}
      >
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
      if (initialState?.currentUser)
        if (location.pathname === '/') {
          history.replace('/dashboard');
        } else if (
          currentRole &&
          initialState?.authorizedPermissions?.length &&
          !initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
        )
          history.replace('/403');
    },

    menuItemRender: (item: any, dom: any) => {
      return (
        <div
          // style={{ flex: 'auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
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
          redirect_uri={window.location.origin + window.location.pathname}
        >
          <ErrorBoundary>
            <TechnicalSupportBounder>
              <OneSignalBounder>{dom}</OneSignalBounder>
            </TechnicalSupportBounder>
          </ErrorBoundary>
        </AuthProvider>
      );
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
