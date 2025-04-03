import path from "path";

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
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/study',
		name: 'Study Progress',
		icon: 'BookOutlined',
		routes: [
			{
				path: '/study/subjects',
				name: 'Subject Management',
				component: './Study/SubjectManagement',
				icon: 'UnorderedListOutlined'
			},
			{
				path: '/study/progress',
				name: 'Learning Progress',
				component: './Study/LearningProgress',
				icon: 'FieldTimeOutlined'
			},
			{
				path: '/study/goals',
				name: 'Monthly Goals',
				component: './Study/MonthlyGoals',
				icon: 'AimOutlined'
			}
		]
	},
	{
		path: '/',
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
		path: '/todo/list',
		name: 'Todo List',
		icon: 'CheckSquareOutlined',
		component: './Todo/TaskList',
	},
	{
		path: '/todo/create',
		component: './Todo/CreateTask',
		hideInMenu: true,
	},
	{
		path: '/quan-ly-khoa-hoc',
		name: 'Quản lý khóa học',
		component: './QuanLyKhoaHoc',
		icon: 'BookOutlined',
	  },
	{
		path: '/TH01/under-upper',
		name: 'UnderUpper',
		component: './TH01',
		icon: 'NumberOutlined',
	},
	{
		component: './exception/404',
	},
];
