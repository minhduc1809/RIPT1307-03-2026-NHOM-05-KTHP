export interface IFormFieldRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	regex?: string;
	afterField?: string;
	maxSizeMb?: number;
	allowedTypes?: string[];
}

export interface IFormField {
	key: string;
	label: string;
	type: 'text' | 'number' | 'date' | 'select';
	rules?: IFormFieldRule;
}

export interface IFormSchema {
	formId: string;
	fields: IFormField[];
}

export interface IFormSettings {
	allowAnonymous?: boolean;
	[key: string]: any;
}

export interface IForm {
	id: string;
	name: string;
	description?: string;
	schema: IFormSchema;
	settings?: IFormSettings;
	isActive: boolean;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}

export interface IFormPageFilter {
	field: string;
	operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
	value: string;
}

export interface IFormPageRequest {
	page?: number;
	limit?: number;
	condition?: Record<string, any>;
	filters?: IFormPageFilter[];
	sort?: Record<string, 'asc' | 'desc'> | string;
}

export interface IFormPageResponse {
	result: IForm[];
	total: number;
}

export interface IFormCreateRequest {
	name: string;
	description?: string;
	schema: IFormSchema | Record<string, any>;
	settings?: IFormSettings;
}

export interface IFormUpdateRequest {
	name?: string;
	description?: string;
	schema?: IFormSchema | Record<string, any>;
	settings?: IFormSettings;
}
