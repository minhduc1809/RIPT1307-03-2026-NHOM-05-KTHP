import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
// import LoadingPage from './components/Loading';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';

/**  loading */
export const initialStateConfig = {
	loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<IInitialState> {
	const token = localStorage.getItem('token');
	if (token) {
		try {
			const { getUserInfo } = await import('@/services/base/api');
			const response = await getUserInfo();
			const userData = response?.data?.data ?? response?.data;
			return {
				currentUser: userData,
				permissionLoading: false,
			};
		} catch (error: any) {
			// Access token expired — try refresh
			if (error?.response?.status === 401) {
				const refreshToken = localStorage.getItem('refreshToken');
				if (refreshToken) {
					try {
						const axios = (await import('@/utils/axios')).default;
						const { ip3 } = await import('@/utils/ip');
						const refreshRes = await axios.post(`${ip3}/auth/refresh`, { refreshToken }, { headers: {} });
						const refreshData = refreshRes?.data?.data ?? refreshRes?.data;
						if (refreshData?.accessToken) {
							localStorage.setItem('token', refreshData.accessToken);
							if (refreshData.refreshToken) localStorage.setItem('refreshToken', refreshData.refreshToken);
							const { getUserInfo } = await import('@/services/base/api');
							const retryRes = await getUserInfo();
							const userData = retryRes?.data?.data ?? retryRes?.data;
							return {
								currentUser: userData,
								permissionLoading: false,
							};
						}
					} catch {
						// Refresh also failed — clear and redirect to login
					}
				}
			}
			localStorage.clear();
		}
	}
	return {
		permissionLoading: true,
	};
}

// Tobe removed
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

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
		unAccessible: (
			<TechnicalSupportBounder>
				<NotAccessible />
			</TechnicalSupportBounder>
		),
		noFound: <NotFoundContent />,
		rightContentRender: () => <RightContent />,
		disableContentMargin: false,

		footerRender: () => <Footer />,

		onPageChange: () => {
			const { pathname } = window.location;
			// Public paths that don't require authentication
			const publicPaths = ['/user/login', '/user', '/', '/403', '/404', '/hold-on'];
			const isPublicPath = publicPaths.some((p) => pathname === p || pathname.startsWith('/user/'));

			// Redirect to login if not authenticated and accessing a protected route
			if (!initialState?.currentUser && !isPublicPath) {
				history.replace('/user/login');
				return;
			}

			if (initialState?.currentUser) {
				const isUncheckPath = ['/notification/subscribe'].some((path) => pathname.includes(path));
				if (
					!isUncheckPath &&
					currentRole &&
					initialState?.authorizedPermissions?.length &&
					!initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
				) {
					history.replace('/403');
				}
			}
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom) => (
			<ErrorBoundary>
				{/* <TechnicalSupportBounder> */}
				<OneSignalBounder>{dom}</OneSignalBounder>
				{/* </TechnicalSupportBounder> */}
			</ErrorBoundary>
		),
		menuHeaderRender: undefined,
		...initialState?.settings,
	};
};
