const pageConfig = {
	apiBaseUrl: "order",
	title: "订单管理",
	role: [],
	searchForm: {

	},
	searchFormConfig: {
		labelWidth: "80px",
		props: [{
			label: "订单号",
			type: "input",
			prop: "no"
		},
		{
			label: "订单状态",
			type: "select",
			prop: "status",
			params: {
				options: [
					{ label: "待消费", value: 0 },
					{ label: "已完成", value: 1 },
					{ label: "已取消", value: 2 }
				]
			}
		}
		]
	},
	toolBarConfig: [
		{
			text: "消费",
			click: batchUse,
			type: "success",
			icon: "el-icon-s-check"
		},
		{
			text: "取消",
			click: batchCancel,
			type: "warning",
			icon: "el-icon-refresh-left"
		}
	],
	searchResultTableConfig: {
		multipleSelect: true,
		cols: [{
			prop: "no",
			label: "订单号",
			width: "180"
		},
		{
			prop: "projectName",
			label: "项目名称",
			width: "180"
		}, {
			prop: "amount",
			label: "实付金额",
			width: "180"
		}, {
			prop: "createTime",
			label: "下单时间",
			width: "180"
		},
		{
			prop: "useTime",
			label: "消费时间",
			width: "180"
		},
		{
			prop: "status",
			label: "订单状态",
			width: "180",
			format: (value, row) => {
				return ["待消费", "已完成", "已取消"][value];
			}
		},
		{
			prop: "userName",
			label: "顾客名称",
			width: "180"
		}
		],
		operation: [{
			text: "详情",
			click: (row) => {
				app.edit("default", row, true)
			},
			icon: "el-icon-search"
		}, {
			text: "消费",
			click: (row) => {
				execUse([row.id])
			},
			icon: "el-icon-s-check",
			show: (row) => {
				return 0 == row.status;
			}
		}, {
			text: "取消",
			click: (row) => {
				execCancel([row.id])
			},
			icon: "el-icon-refresh-left",
			show: (row) => {
				return 0 == row.status;
			}
		},
		],
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
						fieldName: "name"
					}
				},
				{
					label: "项目",
					type: "select",
					prop: "projectId",
					params: {
						tableName: "project",
						fieldName: "name",
						where: "del_flag=0"
					}
				}, {
					label: "订单号",
					type: "input",
					prop: "no"
				},
				{
					label: "下单时间",
					type: "input",
					prop: "createTime",
					show:(editForm)=>{
						return !$.obj.isEmpty(editForm.id);
					},
					readOnly:()=>{
						return true;
					}
				},
				{
					label: "实付金额",
					type: "input",
					prop: "amount"
				},
				{
					label: "订单状态",
					type: "select",
					prop: "status",
					params: {
						options: [
							{ label: "待消费", value: 0 },
							{ label: "已完成", value: 1 },
							{ label: "已取消", value: 2 }
						]
					}
				},
				{
					label: "消费时间",
					type: "input",
					prop: "useTime",
					show:(editForm)=>{
						return !$.obj.isEmpty(editForm.id);
					},
					readOnly:()=>{
						return true;
					}
				}
			],
			rules: {
			}
		}
	}
};

function batchUse() {
	if ($.obj.isEmpty(app.multipleSelection)) {
		$.msg.warning("请选择需要消费的订单！");
		return;
	}
	if (app.multipleSelection.some(element => element.status !== 0)) {
		$.msg.warning("只能消费订单状态为“待消费”的订单");
		return;
	}
	execUse(app.multipleSelection.map(item => item.id));
}
function execUse(idArr) {
	let vm = app;
	window.top.app.$confirm('是否消费所选订单？', '消费确认', {
		type: 'warning'
	}).then(() => {
		$.http.post(`${vm.apiBaseUrl}/updateStatus/1`, idArr, true, function (xhr, status,
			result) {
			vm.search();
			$.msg.success(result.message);
		});
	});
}

function batchCancel() {
	if ($.obj.isEmpty(app.multipleSelection)) {
		$.msg.warning("请选择需要取消的订单！");
		return;
	}
	if (app.multipleSelection.some(element => element.status !== 0)) {
		$.msg.warning("只能取消订单状态为“待消费”的订单");
		return;
	}
	execCancel(app.multipleSelection.map(item => item.id));
}
function execCancel(idArr) {
	let vm = app;
	window.top.app.$confirm('是否取消所选订单？', '取消确认', {
		type: 'warning'
	}).then(() => {
		$.http.post(`${vm.apiBaseUrl}/updateStatus/2`, idArr, true, function (xhr, status,
			result) {
			vm.search();
			$.msg.success(result.message);
		});
	});
}