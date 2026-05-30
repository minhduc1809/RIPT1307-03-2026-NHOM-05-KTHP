import type { IInitialState } from './services/base/typing';

/**
 * Role-based access control
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 *
 * Roles: ADMIN, MANAGER, HR, USER
 * - canAdmin: ADMIN only (user management, system settings)
 * - canManage: ADMIN + MANAGER (forms CRUD, workflows CRUD, dashboard)
 * - canApprove: ADMIN + MANAGER + HR (workflow approval actions)
 */
export default function access(initialState: IInitialState) {
	const scopes = initialState.authorizedPermissions?.map((item) => item.scopes).flat();
	const role = (initialState as any)?.currentUser?.role;

	return {
		canAdmin: role === 'ADMIN',
		canManage: role === 'ADMIN' || role === 'MANAGER',
		canApprove: role === 'ADMIN' || role === 'MANAGER' || role === 'HR',
		accessFilter: (route: any) => scopes?.includes(route?.maChucNang) || false,
		manyAccessFilter: (route: any) => route?.listChucNang?.some((r: string) => scopes?.includes(r)) || false,
	};
}
