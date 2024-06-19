const pageConfig = {
	apiBaseUrl: "userMoments",
	title: "顾客圈管理",
	role: [],
	customData: { showDetail: false, detail: {} },
	searchForm: {

	},
	searchFormConfig: {
		labelWidth: "80px",
		props: [{
			label: "标题",
			type: "input",
			prop: "title"
		},
		{
			label: "文案",
			type: "input",
			prop: "desc"
		},
		{
			label: "类型",
			type: "select",
			prop: "type",
			params: {
				options: [
					{ label: "所有", value: 0 },
					{ label: "我的", value: 1 }
				]
			},
			role: ["user", "merchant"]
		}
		]
	},
	toolBarConfig: [{
		text: "新增",
		click: () => {
			app.edit("default")
		},
		role: ["user"],
		type: "",
		icon: "el-icon-edit"
	},
	{
		text: "删除",
		click: () => {
			app.batchDelete()
		},
		role: ["admin", "user"],
		type: "danger",
		icon: "el-icon-delete"
	}
	],
	searchResultTableConfig: {
		type: 'card',
		multipleSelect: true,
		multipleSelectable: (row) => {
			let userInfo = $.auth.getUserInfo(false);
			return (row.userId == userInfo.id || "admin" == userInfo.role);
		},
		cols: [{
			prop: "projectName",
			label: "项目名称",
			width: "180"
		}, {
			prop: "pic",
			label: "图片",
			width: "180",
			type: "img"
		}, {
			prop: "title",
			label: "标题",
			width: "180"
		},
		{
			prop: "desc",
			label: "文案",
			width: "180"
		},
		{
			prop: "score",
			label: "满意程度",
			width: "180",
			type: "rate"
		},
		{
			prop: "userName",
			label: "顾客名称",
			width: "180"
		},
		{
			prop: "createTime",
			label: "发布时间",
			width: "180"
		}
		],
		operation: [
				{
				text: "详情",
				click: (row) => {
					app.edit("default", row, true)
				},
				icon: "el-icon-search",
				show: (row) => {
					return false;
					// let userInfo = $.auth.getUserInfo(false);
					// return row.userId != userInfo.id;
				}
			}, 
			{
				text: "编辑",
				click: (row) => {
					app.edit("default", row)
				},
				role: ["user"],
				icon: "el-icon-edit",
				show: (row) => {
					let userInfo = $.auth.getUserInfo(false);
					return row.userId == userInfo.id;
				}
			}, {
				text: "项目详情",
				click: (row) => {
					let newRow = {...row};
					newRow.id = row.projectId;
					app.edit("project", newRow, true)
				},
				icon: "el-icon-present"
			},
			{
				text: "删除",
				click: (row) => {
					app.delete(row)
				},
				role: ["admin", "user"],
				type: "danger",
				icon: "el-icon-delete",
				show: (row) => {
					let userInfo = $.auth.getUserInfo(false);
					return row.userId == userInfo.id || "admin" == userInfo.role;
				}
			}
		],
		rowClick(row) {
			$.http.post(`userMoments/getById`, {
				id: row.id
			}, true, function (xhr,
				status, result) {
				app.customData.detail = result.data.data;
				app.customData.showDetail = true;
			});
		}
	},
	editFormConfig: {
		default: {
			props: [
				{
					label: "顾客",
					type: "select",
					prop: "userId",
					params: {
						tableName: "sys_user",
						fieldName: "name",
						where: "role='user'"
					},
					default: () => {
						let userInfo = $.auth.getUserInfo(false);
						if ("user" == userInfo.role) {
							return userInfo.id;
						}
						return null;
					},
					show: (editForm) => {
						let userInfo = $.auth.getUserInfo(false);
						return ($.obj.isEmpty(editForm.id) || editForm.userId == userInfo.id);
					},
					readOnly: () => {
						return true;
					}
				},
				{
					label: "顾客",
					type: "input",
					prop: "userName",
					show: (editForm) => {
						let userInfo = $.auth.getUserInfo(false);
						return !($.obj.isEmpty(editForm.id) || editForm.userId == userInfo.id);
					},
					readOnly: () => {
						return true;
					}
				}, {
					label: "项目",
					type: "select",
					prop: "projectId",
					params: {
						tableName: "project",
						fieldName: "name",
						where: ""
					}
				}, {
					label: "图片",
					type: "upload",
					prop: "pic",
					params: {
						type: "pic",
						multiple: true,
						limit: 5,
						accept: "image/*"
					}
				}, {
					label: "标题",
					type: "input",
					prop: "title"
				},
				{
					label: "文案",
					type: "textarea",
					prop: "desc"
				},
				{
					label: "满意程度",
					type: "rate",
					prop: "score",
					readOnly: (editForm) => {
						let userInfo = $.auth.getUserInfo(false);
						return !($.obj.isEmpty(editForm.id) || editForm.userId == userInfo.id);
					}
				},
				{
					label: "匿名",
					type: "switch",
					prop: "anon",
					readOnly: (editForm) => {
						let userInfo = $.auth.getUserInfo(false);
						return !($.obj.isEmpty(editForm.id) || editForm.userId == userInfo.id);
					}
				},
				{
					label: "发布时间",
					type: "input",
					prop: "createTime",
					show: (editForm) => {
						return !$.obj.isEmpty(editForm.id);
					},
					readOnly: () => {
						return true;
					}
				}
			],
			rules: {
				userId: [{
					required: true,
					message: '请选择顾客',
					trigger: 'blur'
				}],
				projectId: [{
					required: true,
					message: '请选择项目',
					trigger: 'blur'
				}],
				pic: [{
					required: true,
					message: '请上传图片',
					trigger: 'blur'
				}],
				title: [{
					required: true,
					message: '请输入标题',
					trigger: 'blur'
				}],
				desc: [{
					required: true,
					message: '请输入文案',
					trigger: 'blur'
				}],
				score: [{
					required: true,
					message: '请选择满意程度',
					trigger: 'blur'
				}
				],
				anon: [{
					required: true,
					message: '请选择是否匿名',
					trigger: 'blur'
				}]
			}
		},
		project: {
			apiBaseUrl: "project",
			props: [
				{
					label: "美容院",
					type: "select",
					prop: "merchantId",
					params: {
						tableName: "sys_user",
						fieldName: "name",
						where: "role='merchant'"
					},
					default: () => {
						let userInfo = $.auth.getUserInfo(false);
						if ("merchant" == userInfo.role) {
							return userInfo.id;
						}
						return null;
					},
					readOnly: () => {
						let userInfo = $.auth.getUserInfo(false);
						return ("admin" != userInfo.role);
					}
				}, {
					label: "项目图片",
					type: "upload",
					prop: "pic",
					params: {
						type: "pic",
						multiple: true,
						limit: 5,
						accept: "image/*"
					}
				}, {
					label: "项目名称",
					type: "input",
					prop: "name"
				},
				{
					label: "项目描述",
					type: "textarea",
					prop: "desc"
				},
				{
					label: "项目价格",
					type: "input",
					prop: "price"
				}
			],
			rules: {
				merchantId: [{
					required: true,
					message: '请选择美容院',
					trigger: 'blur'
				}],
				pic: [{
					required: true,
					message: '请上传项目图片',
					trigger: 'blur'
				}],
				name: [{
					required: true,
					message: '请输入项目名称',
					trigger: 'blur'
				}],
				desc: [{
					required: true,
					message: '请输入项目描述',
					trigger: 'blur'
				}],
				price: [{
					required: true,
					message: '请输入项目价格',
					trigger: 'blur'
				},
				{
					validator: (rule, value, callback) => {
						if ($.obj.isEmpty(value)) {
							callback(new Error('请输入项目价格'));
						} else if (!(/^-?\d+(\.\d{1,2})?$/.test(value))) {
							callback(new Error('金额有误（精确到小数点后六位）'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}
				]
			}
		}
	}
};

function hiddenDialog() {
	app.customData.showDetail = false;
}

Vue.prototype.hiddenDialog = hiddenDialog;