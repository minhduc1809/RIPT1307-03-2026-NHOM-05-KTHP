export interface IUser {
	id: string;
	email: string;
	username: string;
	role: 'ADMIN' | 'MANAGER' | 'USER';
	firstName?: string | null;
	lastName?: string | null;
	picture?: string | null;
	isActive: boolean;
	keycloakId?: string | null;
	createdAt: string;
	updatedAt?: string;
	deletedAt?: string | null;
}

export interface IUpdateProfileRequest {
	firstName?: string;
	lastName?: string;
	picture?: string;
}

export interface ICreateUserRequest {
	email: string;
	username: string;
	password: string;
	firstName?: string;
	lastName?: string;
	role?: 'ADMIN' | 'MANAGER' | 'USER';
}

export interface IUpdateUserRequest {
	email?: string;
	firstName?: string;
	lastName?: string;
	role?: 'ADMIN' | 'MANAGER' | 'USER';
	picture?: string;
}

export interface IAssignRoleRequest {
	role: 'ADMIN' | 'MANAGER' | 'USER';
}

export interface IUserPageRequest {
	page?: number;
	limit?: number;
	condition?: Record<string, any>;
	filters?: Array<{ field: string; operator: string; value: string }>;
	sort?: Record<string, 'asc' | 'desc'> | string;
}

export interface IUserPageResponse {
	result: IUser[];
	total: number;
}

export interface IUserListResponse {
	items: IUser[];
	meta: {
		total: number;
		page: number;
		lastPage: number;
	};
}
