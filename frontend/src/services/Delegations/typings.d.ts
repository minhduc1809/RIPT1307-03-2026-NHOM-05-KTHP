export interface IDelegation {
	id: string;
	tenantId: string;
	fromUserId: string;
	toUserId: string;
	fromUser?: { id: string; email: string; username: string };
	toUser?: { id: string; email: string; username: string };
	startDate: string;
	endDate: string;
	isActive: boolean;
	formIds: string[];
	workflowDefinitionIds: string[];
	createdAt?: string;
	updatedAt?: string;
}

export interface IDelegationCreateRequest {
	fromUserId: string;
	toUserId: string;
	startDate: string;
	endDate: string;
	isActive?: boolean;
	formIds?: string[];
	workflowDefinitionIds?: string[];
}

export interface IDelegationUpdateRequest {
	toUserId?: string;
	startDate?: string;
	endDate?: string;
	isActive?: boolean;
	formIds?: string[];
	workflowDefinitionIds?: string[];
}

export interface IDelegationListResponse {
	items: IDelegation[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
