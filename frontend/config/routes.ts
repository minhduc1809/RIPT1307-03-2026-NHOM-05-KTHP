

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
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './Dashboard',
		icon: 'HomeOutlined',
	},
	{
		path: '/forms',
		name: 'Forms',
		icon: 'FormOutlined',
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
	{
		path: '/workflows',
		name: 'Workflows',
		icon: 'PartitionOutlined',
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
				component: './Workflows/Builder',
			},
		],
	},
	{
		path: '/submissions',
		name: 'Submissions',
		icon: 'FileDoneOutlined',
		hideInMenu: true,
		routes: [
			{
				path: '/submissions/:id',
				name: 'Submission Detail',
				component: './Submissions/Detail',
			},
		],
	},
	{
		path: '/notifications',
		name: 'Notifications',
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
