export interface IWorkflowTransitionConditions {
	requireComment?: boolean;
	[key: string]: any;
}

export interface IWorkflowTransition {
	from: string | string[];
	to: string;
	action: string;
	roles?: string[];
	conditions?: IWorkflowTransitionConditions;
}

export interface IWorkflowConfig {
	states: string[];
	initialState: string;
	finalStates: string[];
	transitions: IWorkflowTransition[];
}

export interface IWorkflowDefinition {
	id: string;
	name: string;
	formId?: string;
	config: IWorkflowConfig;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	form?: {
		id: string;
		name: string;
	};
}

export interface IWorkflowDefinitionCreate {
	name: string;
	formId?: string;
	config: IWorkflowConfig;
}

export interface IWorkflowDefinitionUpdate {
	name?: string;
	formId?: string;
	config?: IWorkflowConfig;
}

export interface IWorkflowDefinitionListResponse {
	items: IWorkflowDefinition[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
