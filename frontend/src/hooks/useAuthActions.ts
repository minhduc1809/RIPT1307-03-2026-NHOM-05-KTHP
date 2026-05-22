import { deleteOneSignal, logoutApi } from '@/services/base/api';
import { currentRole, oneSignalRole } from '@/utils/ip';
import OneSignal from 'react-onesignal';
import { useModel, history } from 'umi';

export const useAuthActions = () => {
	const { initialState, setInitialState } = useModel('@@initialState');

	const handleLogout = async () => {
		if (oneSignalRole.valueOf() === currentRole.valueOf()) {
			OneSignal.getUserId((playerId) => deleteOneSignal({ playerId }));
			OneSignal.setSubscription(false);
		}

		// Call logout API to revoke refresh token
		try {
			const refreshToken = localStorage.getItem('refreshToken');
			if (refreshToken) {
				await logoutApi(refreshToken);
			}
		} catch (error) {
			console.error('Logout API error:', error);
		}

		sessionStorage.clear();
		localStorage.clear();
		setInitialState({ ...initialState, currentUser: undefined });
		history.replace('/user/login');
	};

	const handleLogin = () => {
		history.push('/user/login');
	};

	return {
		dangXuat: handleLogout,
		dangNhap: handleLogin,
		isLoading: false,
	};
};
