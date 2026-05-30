

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// ADMIN + MANAGER ONLY
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './Dashboard',
		icon: 'HomeOutlined',
		access: 'canManage',
	},

	// Forms Management — ADMIN + MANAGER only
	{
		path: '/forms',
		name: 'Quản lý biểu mẫu',
		icon: 'FormOutlined',
		access: 'canManage',
		routes: [
			{
				path: '/forms',
				hideInMenu: true,
				component: './Forms',
			},
			{
				path: '/forms/builder',
				name: 'Form Builder',
				hideInMenu: true,
				layout: false,
				component: './Forms/Builder',
			},
			{
				path: '/forms/:formId/edit',
				name: 'Form Edit',
				hideInMenu: true,
				layout: false,
				component: './Forms/FormEdit',
			},
			{
				path: '/forms/:formId',
				name: 'Form View',
				hideInMenu: true,
				component: './Forms/FormView',
			},
		],
	},

	// Workflows Management — ADMIN + MANAGER only (CRUD)
	{
		path: '/workflows',
		name: 'Quy trình',
		icon: 'PartitionOutlined',
		access: 'canApprove',
		routes: [
			{
				path: '/workflows',
				hideInMenu: true,
				component: './Workflows',
			},
			{
				path: '/workflows/builder',
				name: 'Workflow Builder',
				hideInMenu: true,
				access: 'canManage',
				component: './Workflows/Builder',
			},
			{
				path: '/workflows/:id/edit',
				name: 'Workflow Edit',
				hideInMenu: true,
				access: 'canManage',
				component: './Workflows/WorkflowEdit',
			},
			{
				path: '/workflows/:id',
				name: 'Workflow Detail',
				hideInMenu: true,
				component: './Workflows/WorkflowDetail',
			},
		],
	},

	// Delegation — ADMIN + MANAGER + HR
	{
		path: '/delegations',
		name: 'Ủy quyền',
		icon: 'SwapOutlined',
		access: 'canApprove',
		component: './Delegations',
	},

	///////////////////////////////////
	// ALL ROLES
	// Active Forms — Browse & Fill (all roles)
	{
		path: '/active-forms',
		name: 'Biểu mẫu',
		icon: 'FileTextOutlined',
		component: './Forms/ActiveForms',
	},

	// Submissions
	{
		path: '/submissions',
		name: 'Yêu cầu',
		icon: 'FileDoneOutlined',
		routes: [
			{
				path: '/submissions',
				component: './Submissions/RedirectByRole',
				hideInMenu: true,
			},
			{
				path: '/submissions/pending',
				name: 'Chờ phê duyệt',
				access: 'canApprove',
				component: './Submissions/PendingApprovals',
			},
			{
				path: '/submissions/mine',
				name: 'Yêu cầu của tôi',
				component: './Submissions/MySubmissions',
			},
			{
				path: '/submissions/new/:formId',
				name: 'Điền biểu mẫu',
				hideInMenu: true,
				component: './Submissions/FillForm',
			},
			{
				path: '/submissions/new',
				name: 'Nộp biểu mẫu',
				component: './Submissions/FormSubmit',
			},
			{
				path: '/submissions/:id',
				name: 'Chi tiết',
				hideInMenu: true,
				component: './Submissions/Detail',
			},
		],
	},
	{
		path: '/notifications',
		name: 'Thông báo',
		icon: 'BellOutlined',
		component: './Notifications',
	},
	{
		path: '/profile',
		name: 'Profile',
		icon: 'UserOutlined',
		component: './Profile',
	},

	{
		path: '/',
		component: './Home',
		layout: false,
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];

