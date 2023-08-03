import { currentRole } from '@/utils/ip';
import { useModel } from 'umi';

const useCheckAccess = (code: string): boolean => {
	const { initialState } = useModel('@@initialState');
	const scopes = initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)?.scopes;

	return scopes?.includes(code) || false;
};

export default useCheckAccess;
