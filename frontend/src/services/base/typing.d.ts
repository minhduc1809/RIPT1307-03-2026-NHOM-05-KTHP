import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import type { EModuleKey, EScopeFile, ESettingKey, EStorageFile } from './constant';

declare module Login {
	export interface IUser {
		id: string;
		email: string;
		username: string;
		role: string;
		firstName: string | null;
		lastName: string | null;
		picture: string | null;
		isActive: boolean;
		keycloakId: string | null;
		createdAt: string;
		updatedAt: string;
		deletedAt: string | null;
	}

	export interface IPermission {
		scopes: string[]; //['cong-tac-sinh-vien:ho-so'];
		rsid: string; // '8f2c194a-fdfc-49e2-a3ba-a0af0325ecd4';
		rsname: EModuleKey; // 'cong-tac-sinh-vien';
	}

	export type TModule = {
		title: string;
		url?: string;
		icon?: string;
	};
}

export interface IInitialState {
	settings?: Partial<LayoutSettings>;
	currentUser?: Login.IUser;
	authorizedPermissions?: Login.IPermission[];
	permissionLoading?: boolean;
}

export interface ISetting {
	key: ESettingKey;
	value: any;
}

export interface IFile {
	file: {
		_id: string;
		author: string;
		authorName: string;
		mimetype: string;
		name: string;
		scope: EScopeFile;
		size: number;
		storageType: EStorageFile;

		updatedAt: Date;
		createdAt: Date;
	};
	url: string;
}
