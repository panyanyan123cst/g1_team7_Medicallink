const pageConfig = {
	apiBaseUrl: "user",
	title: "个人信息",
	role: [],
	editFormConfig: {
		default: {
			props: [{
				label: "头像",
				type: "upload",
				prop: "avatar",
				params: {
					type: "pic",
					multiple: false,
					limit: 1,
					accept: "image/*"
				}
			}, {
				label: "账号",
				type: "input",
				prop: "account"
			},
			{
				label: "名称",
				type: "input",
				prop: "name"
			},
			{
				label: "门店地址",
				type: "input",
				prop: "address",
				show: (editForm) => {
					let userInfo = $.auth.getUserInfo(false);
					return ("merchant"==userInfo.role);
				}
			},
			{
				label: "联系人",
				type: "input",
				prop: "contact",
				show: (editForm) => {
					let userInfo = $.auth.getUserInfo(false);
					return ("merchant"==userInfo.role);
				}
			},
			{
				label: "手机号",
				type: "input",
				prop: "tel",
				show: (editForm) => {
					let userInfo = $.auth.getUserInfo(false);
					return ("admin"!=userInfo.role);
				}
			},
			{
				label: "余额",
				type: "input",
				prop: "balance",
				show: (editForm) => {
					let userInfo = $.auth.getUserInfo(false);
					return ("admin"!=userInfo.role);
				},
				readOnly:()=>{
					let userInfo = $.auth.getUserInfo(false);
					return ("admin"!=userInfo.role);
				}
			},
			{
				label: "新密码",
				type: "input",
				prop: "password"
			},
			{
				label: "确认密码",
				type: "input",
				prop: "checkPassword"
			}
			],
			rules: {
				name: [{
					required: true,
					message: '请输入用户名',
					trigger: 'blur'
				}],
				account: [{
					required: true,
					message: '请输入账号',
					trigger: 'blur'
				}],
				checkPassword: [
				{
					validator: (rule, value, callback) => {
						if($.obj.isEmpty(app.editForm.password)){
							callback();
							return;
						}
						if ($.obj.isEmpty(value)) {
							callback(new Error('请再次输入密码'));
						} else if (value !== app.editForm.password) {
							callback(new Error('两次输入密码不一致!'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}
				],
				balance: [{
					required: true,
					message: '请输入余额',
					trigger: 'blur'
				},
				{
					validator: (rule, value, callback) => {
						if ($.obj.isEmpty(value)) {
							callback(new Error('请输入余额'));
						} else if (!(/^-?\d+(\.\d{1,2})?$/.test(value))) {
							callback(new Error('金额有误（精确到小数点后六位）'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}
				],
				contact: [{
					required: true,
					message: '请输入联系人',
					trigger: 'blur'
				}],
				address: [{
					required: true,
					message: '请输入门店地址',
					trigger: 'blur'
				}],
				tel: [{
					required: true,
					message: '手机号不能为空',
					trigger: 'blur'
				},
				{
					pattern: /^[1][3-9]\d{9}$/,
					message: '请输入正确的手机号',
					trigger: 'blur'
				}
				]

			}
		}
	},
};
