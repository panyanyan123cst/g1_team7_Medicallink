const pageConfig = {
	apiBaseUrl: "project",
	title: "项目管理",
	role: [],
	searchForm: {

	},
	searchFormConfig: {
		labelWidth: "90px",
		props: [{
			label: "项目名称",
			type: "input",
			prop: "name"
		},
		{
			label: "项目描述",
			type: "input",
			prop: "desc"
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
			prop: "pic",
			label: "项目图片",
			width: "180",
			type: "img"
		}, {
			prop: "name",
			label: "项目名称",
			width: "180"
		},
		{
			prop: "desc",
			label: "项目描述",
			width: "180"
		},
		{
			prop: "price",
			label: "项目价格",
			width: "180"
		},
		{
			prop: "merchantName",
			label: "美容院名称",
			width: "180"
		}
		],
		operation: [{
			text: "详情",
			click: (row) => {
				app.edit("default", row, true)
			},
			role: ["user"],
			icon: "el-icon-search"
		},{
			text: "编辑",
			click: (row) => {
				app.edit("default", row)
			},
			role: ["admin","merchant"],
			icon: "el-icon-edit",
			// show: (row) => {
			// 	return row.id == '123';
			// }
		}, 
		{
			text: "删除",
			click: (row) => {
				app.delete(row)
			},
			role: ["admin","merchant"],
			type: "danger",
			icon: "el-icon-delete"
		},{
			text: "购买",
			click: (row) => {
				window.top.app.$confirm(`是否确定支付￥${row.price}用于购买“${row.name}”项目？`, '支付确定', {
					type: 'warning'
				}).then(() => {
					$.http.post(`${app.apiBaseUrl}/buy`, {
						id: row.id
					}, true, function (xhr, status,
						result) {
						$.msg.success(result.message);
					});
				});
			},
			role: ["user"],
			icon: "el-icon-bank-card"
		}, 
		],
	},
	editFormConfig: {
		default: {
			props: [
			{
				label: "美容院",
				type: "select",
				prop: "merchantId",
				params:{
					tableName:"sys_user",
					fieldName:"name",
					where:"role='merchant'"
				},
				default: ()=>{
					let userInfo = $.auth.getUserInfo(false);
					if("merchant"==userInfo.role){
						return userInfo.id;
					}
					return null;
				},
				readOnly:()=>{
					let userInfo = $.auth.getUserInfo(false);
					return ("admin"!=userInfo.role);
				}
			},{
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
