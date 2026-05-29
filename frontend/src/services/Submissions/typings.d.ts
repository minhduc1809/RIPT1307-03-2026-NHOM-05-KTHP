export interface ISubmission {
	id: string;
	formId: string;
	data: Record<string, any>;
	status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'RETURNED';
	submittedBy: string;
	parentSubmissionId?: string | null;
	revisionNumber: number;
	createdAt: string;
	updatedAt: string;
	form?: {
		name: string;
		schema?: any;
	};
	user?: {
		email: string;
		username: string;
	};
	workflows?: IWorkflowInstance[];
}

export interface IWorkflowInstance {
	id: string;
	definitionId: string;
	submissionId: string;
	currentStep: string;
	status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
	createdAt: string;
	updatedAt: string;
	submission?: ISubmission;
	histories?: IWorkflowHistory[];
}

export interface IWorkflowHistory {
	id: string;
	instanceId: string;
	fromStep: string | null;
	toStep: string;
	action: string;
	actorId: string;
	actor?: { id: string; email: string; name: string } | null;
	comment?: string | null;
	createdAt: string;
}

export interface ISubmissionListResponse {
	items: ISubmission[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface IPendingListResponse {
	items: IWorkflowInstance[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface IAvailableAction {
	action: string;
	targetState: string;
	requiresComment: boolean;
}

export interface IAvailableActionsResponse {
	currentState: string;
	actions: IAvailableAction[];
}

export interface IWorkflowActionRequest {
	submissionId: string;
	action: string;
	comment?: string;
	data?: Record<string, any>;
}

export interface IWorkflowActionResponse {
	instanceId: string;
	previousState: string;
	currentState: string;
	action: string;
	isCompleted: boolean;
	submissionId: string;
}

export interface IWorkflowHistoryResponse {
	instanceId: string;
	currentStep: string;
	status: string;
	workflowName: string;
	history: IWorkflowHistory[];
}
