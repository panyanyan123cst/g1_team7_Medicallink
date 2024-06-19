const pageConfig = {
	apiBaseUrl: "user",
	title: "用户管理",
	role: ["admin"],
	searchForm: {
		role: "user"
	},
	searchFormConfig: {
		labelWidth:"68px",
		props:[{
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
			label: "手机号",
			type: "input",
			prop: "tel"
		}
		]
	},
	toolBarConfig: [{
		text: "新增",
		click: () => {
			app.edit("default")
		},
		type: "",
		icon: "el-icon-edit"
	},
	{
		text: "删除",
		click: () => {
			app.batchDelete()
		},
		type: "danger",
		icon: "el-icon-delete"
	}
	],
	searchResultTableConfig: {
		multipleSelect: true,
		cols: [{
			prop: "avatar",
			label: "头像",
			type: "img"
		}, {
			prop: "name",
			label: "名称"
		},
		{
			prop: "account",
			label: "账号"
		},
		{
			prop: "tel",
			label: "手机号"
		},
		{
			prop: "balance",
			label: "余额"
		}
		],
		operation: [{
			text: "编辑",
			click: (row) => {
				app.edit("default", row)
			},
			// role: ["user"],
			icon: "el-icon-edit",
			// show: (row) => {
			// 	return row.id == '123';
			// }
		}, {
			text: "重置密码",
			click: (row) => {
				let vm = window.top.app;
				let password = "123456";
				vm.$confirm(`是否将账号“${row.account}”的密码重置为${password}？`, '重置密码', {
					type: 'warning'
				}).then(() => {
					$.http.post(`${vm.apiBaseUrl}/resetPassword`, {
						id: row.id,
						password: password
					}, true, function (xhr, status,
						result) {
						$.msg.success(result.message);
					});
				});
			},
			// role: ["user"],
			icon: "el-icon-key",
			// show: (row) => {
			// 	return row.id == '123';
			// }
		},
		{
			text: "删除",
			click: (row) => {
				app.delete(row)
			},
			type: "danger",
			icon: "el-icon-delete"
		}
		],
	},
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
				label: "密码",
				type: "input",
				prop: "password",
				show: (editForm) => {
					return $.obj.isEmpty(editForm.id);
				}
			},
			{
				label: "手机号",
				type: "input",
				prop: "tel"
			},
			{
				label: "余额",
				type: "input",
				prop: "balance",
				default: 0
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
				password: [{
					required: true,
					message: '请输入密码',
					trigger: 'blur'
				}],
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
