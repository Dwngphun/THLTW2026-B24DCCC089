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
	// {
	// 	path: '/gioi-thieu',
	// 	name: 'About',
	// 	component: './TienIch/GioiThieu',
	// 	hideInMenu: true,
	// },
	// {
	// 	path: '/random-user',
	// 	name: 'RandomUser',
	// 	component: './RandomUser',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/todo-list',
	// 	name: 'TodoList',
	// 	icon: 'OrderedListOutlined',
	// 	component: './TodoList',
	// },
    {
		path: '/Bai-tap-2', 
		name: 'Bài tập 2',   
		icon: 'shop',             
		component: './QuanLySanPham', 
	},
	{
        path: '/Doan-so-ngau-nhien',
        name: 'TH01BT1-Trò chơi đoán số',
	    icon: 'ControlOutlined',
        component: './DoanSo',
    },
	{
        path: '/quan-ly-hoc-tap',
        name: 'TH01BT2-Quản lý học tập',
        icon: 'BookOutlined',
        component: './QuanLyHocTap',
    },
	{
        path: '/oan-tu-ti',
        name: 'TH02BT1-Oẳn tù tì',
        icon: 'ControlOutlined',
        component: './OanTuTi',
    },
	{
        path: '/ngan-hang-tu-luan',
        name: 'TH02BT2-Ngân hàng tự luận',
        icon: 'BookOutlined',
        component: './NganHangTuLuan',
    },
	{
        path: '/quan-ly-spa',
        name: 'TH03-Quản lý Spa',
        icon: 'shop',
        component: './QuanLySpa',
    },
	{
        path: '/quan-ly-van-bang',
        name: 'TH04-Quản lý văn bằng',
        icon: 'BookOutlined',
        component: './QuanLyVanBang',
    },
	{
        path: '/quan-ly-clb',
        name: 'TH05-Quản lý CLB',
        icon: 'BookOutlined',
        component: './QuanLyCLB',
    },
	{
    path: '/du-lich',
    name: 'Quản lý Du lịch',     // Tên menu cha hiển thị ở thanh bên trái
    icon: 'GlobalOutlined',      // Icon của menu cha
    routes: [
      { 
        path: '/du-lich', 
        redirect: '/du-lich/trang-chu' 
      },
      { 
        path: '/du-lich/trang-chu', 
        name: 'Khám phá',        // Tên menu con
        icon: 'CompassOutlined',
        component: '@/pages/DuLich/TrangChu' 
      },
      { 
        path: '/du-lich/lap-ke-hoach', 
        name: 'Lịch trình', 
        icon: 'CalendarOutlined',
        component: '@/pages/DuLich/LapKeHoach' 
      },
      { 
        path: '/du-lich/ngan-sach', 
        name: 'Ngân sách', 
        icon: 'WalletOutlined',
        component: '@/pages/DuLich/NganSach' 
      },
      { 
        path: '/du-lich/quan-tri', 
        name: 'Quản trị (Admin)', 
        icon: 'SettingOutlined',
        component: '@/pages/DuLich/QuanTri' 
      },
      ],
    },
    {
        path: '/quan-ly-khoa-hoc',
        name: 'KTGK-Quản lý khóa học',
        icon: 'BookOutlined',
        component: './QuanLyKhoaHoc',
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
		component: './exception/404',
	},
];
