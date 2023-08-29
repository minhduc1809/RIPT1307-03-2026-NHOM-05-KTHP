import { useAuth } from 'react-oidc-context';
import { useModel } from 'umi';

export const useAuthActions = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const auth = useAuth();

	const handleLogout = () => {
		auth
			.signoutRedirect({
				post_logout_redirect_uri: window.location.origin + '/user/login',
				id_token_hint: auth.user?.id_token,
			})
			.then(() => {
				sessionStorage.clear();
				localStorage.clear();
				setInitialState({ ...initialState, currentUser: undefined });
			});
	};

	const handleLogin = () => {
		auth.signinRedirect();
	};

	return {
		dangXuat: handleLogout,
		dangNhap: handleLogin,
		isLoading: auth.isLoading,
	};
};
