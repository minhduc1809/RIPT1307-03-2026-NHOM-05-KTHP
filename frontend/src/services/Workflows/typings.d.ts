export interface IWorkflowTransitionConditions {
	requireComment?: boolean;
	[key: string]: any;
}

export interface IVotingConfig {
	approveAction: string;
	rejectAction: string;
	approveThreshold: number;
	rejectThreshold?: number;
	approveTarget: string;
	rejectTarget: string;
}

export interface IWorkflowTransition {
	from: string | string[];
	to: string;
	action: string;
	roles?: string[];
	conditions?: IWorkflowTransitionConditions;
	type?: 'PARALLEL_JOIN' | 'VOTING';
	requireActions?: string[];
	votingConfig?: IVotingConfig;
	submissionStatus?: string;
}

export interface IStateDetail {
	slaHours?: number;
	timeoutAction?: string;
}

export interface IWorkflowConfig {
	states: string[];
	initialState: string;
	finalStates: string[];
	transitions: IWorkflowTransition[];
	statusMapping?: Record<string, string>;
	stateLabels?: Record<string, string>;
	resubmitTargetState?: string;
	resubmitFastTrack?: boolean;
	statesDetails?: Record<string, IStateDetail>;
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
