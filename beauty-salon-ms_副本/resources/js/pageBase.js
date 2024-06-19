window.document.title = pageConfig.title;
$.auth.checkRole(pageConfig.role);

var app;
$(document).ready(function () {
	app = new Vue({
		el: '#app',
		data: {
			customData: {},
			searchResultTableLoading: false,
			editForm: {},
			editFromSelectList: {},
			editFromFileList: [],
			editFromUploadFnList: {},
			editFormParams: {
				formName: "",
				formId: 0,
				loading: false,
				show: false,
				readOnly: false,
				title: ""
			},
			multipleSelection: [],
			searchResult: [],
			searchForm: {
				id: null,
				...pageConfig.searchForm
			},
			searchFromSelectList: {},
			pagination: {
				curPage: 1,
				total: 0,
				pageSize: 10,
				pageSizes: [10, 20, 30, 50],
				layout: "total, sizes, prev, pager, next, jumper",
				pagerCount: document.body.clientWidth < 992 ? 5 : 7
			},
			apiBaseUrl: pageConfig.apiBaseUrl,
			searchFormConfig: pageConfig.searchFormConfig,
			toolBarConfig: pageConfig.toolBarConfig,
			searchResultTableConfig: pageConfig.searchResultTableConfig,
			editFormConfig: pageConfig.editFormConfig
		},
		mounted: function () {
			let vm = this;
			vm.initCustomData();
			vm.initSearchFrom();
			vm.search();
		},
		beforeDestroy() {
			let vm = this;
		},
		watch: {

		},
		computed: {
		},
		methods: {
			initCustomData() {
				let vm = this;
				if (!$.obj.isEmpty(pageConfig.customData)) {
					vm.customData = pageConfig.customData;
				}
			},
			searchResultTableSelectable(row) {
				let vm = this;
				if ($.obj.isEmpty(vm.searchResultTableConfig.multipleSelectable)) {
					return true;
				}
				return vm.searchResultTableConfig.multipleSelectable(row);
			},
			initSearchFrom() {
				let vm = this;
				vm.searchFromSelectList = {};

				for (let item of vm.searchFormConfig.props) {
					switch (item.type) {
						case "select":
							if (!$.obj.isEmpty(item.params.options)) {
								vm.searchFromSelectList[item.prop] = item.params.options;
								break;
							}
							vm.searchFromSelectList[item.prop] = [];
							$.http.post(`common/getOptions`, item.params, true, function (xhr,
								status, result) {

								let newSelectList = Object.assign({}, vm.searchFromSelectList);
								newSelectList[item.prop] = result.data.options;
								vm.searchFromSelectList = newSelectList;
							},
								function (xhr, status, error) {
									$.msg.error(`${item.label}选项获取失败！`);
								},
								function (xhr, status) {
								});
							break;
						default:
							break;
					}
				}

			},
			updateFormFileList(prop, fileList) {
				let vm = this;
				let fileListAsValueArr = $.obj.isEmpty(fileList) ? [] : fileList.reduce((acc, file) => {
					if (file.status === 'success' && file.response && file.response.data && file.response.data.path) {
						acc.push(file.response.data.path);
					}
					return acc;
				}, []);
				vm.editForm[prop] = fileListAsValueArr.join(",");
				vm.editFromFileList[prop] = fileList;
			},
			formUploadChange(prop, file, fileList) {
				//添加、成功、失败
				let vm = this;
				vm.updateFormFileList(prop, fileList);
			},
			formUploadChangeFn(prop) {
				let vm = this;
				return function (file, fileList) {
					return vm.formUploadChange(prop, file, fileList);
				}
			},
			formUploadProgress(prop, event, file, fileList) {
				//上传进度
				let vm = this;
				vm.updateFormFileList(prop, fileList);
			},
			formUploadProgressFn(prop) {
				let vm = this;
				return function (event, file, fileList) {
					return vm.formUploadProgress(prop, event, file, fileList);
				}
			},
			formUploadRemove(prop, file, fileList) {
				//移除文件
				let vm = this;
				vm.updateFormFileList(prop, fileList);
			},
			formUploadRemoveFn(prop) {
				let vm = this;
				return function (file, fileList) {
					return vm.formUploadRemove(prop, file, fileList);
				}
			},
			formUploadExceed(prop, files, fileList) {
				//超选
				let vm = this;
				$.msg.warning(`当前限制选择 ${vm.editFormConfig[vm.editFormParams.formName].props.find(item => item.prop === prop).params.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			formUploadExceedFn(prop) {
				let vm = this;
				return function (file, fileList) {
					return vm.formUploadExceed(prop, file, fileList);
				}
			},

			getFormDefault(formName) {
				let vm = this;
				let form = {};
				for (let item of vm.editFormConfig[formName].props) {
					if (!$.obj.isEmpty(item.default)) {
						form[item.prop] = (typeof item.default === 'function') ? item.default() : item.default;
					}
				}
				return form;
			},
			showEditDialog(formName, data, readOnly = false) {
				let vm = this;
				vm.editFormParams.formId = $.random.getUUID();
				vm.editForm = data;
				let fileList = {};
				let uploadFnList = {};
				vm.editFromSelectList = {};
				for (let item of vm.editFormConfig[formName].props) {
					switch (item.type) {
						case "select":
							if (!$.obj.isEmpty(item.params.options)) {
								vm.editFromSelectList[item.prop] = item.params.options;
								break;
							}
							vm.editFromSelectList[item.prop] = [];
							let curFormId = vm.editFormParams.formId;

							$.http.post(`common/getOptions`, item.params, true, function (xhr,
								status, result) {
								if (curFormId == vm.editFormParams.formId) {
									let newSelectList = Object.assign({}, vm.editFromSelectList);
									newSelectList[item.prop] = result.data.options;
									vm.editFromSelectList = newSelectList;
								}
							},
								function (xhr, status, error) {
									if (curFormId == vm.editFormParams.formId) {
										$.msg.error(`${item.label}选项获取失败！`);
									}
								},
								function (xhr, status) {
								});
							break;
						case "upload":
							let fileListAsStr = data[item.prop];
							let fileListAsArr = $.obj.isEmpty(fileListAsStr) ? [] : fileListAsStr.split(",");
							let fileListItem = [];
							for (let fileListAsArrItem of fileListAsArr) {
								fileListItem.push({
									name: fileListAsArrItem,
									url: $.http.getFileUrl(fileListAsArrItem)
								});
							}
							fileList[item.prop] = fileListItem;
							uploadFnList[item.prop] = {
								formUploadChange: vm.formUploadChangeFn(item.prop),
								formUploadProgress: vm.formUploadProgressFn(item.prop),
								formUploadRemove: vm.formUploadRemoveFn(item.prop),
								formUploadExceed: vm.formUploadExceedFn(item.prop)
							};
							break;
						default:
							break;
					}
				}
				vm.editFromFileList = fileList;
				vm.editFromUploadFnList = uploadFnList;
				let title = (!$.obj.isEmpty(data) && !$.obj.isEmpty(data.id)) ? "修改" : "新增";
				title = readOnly ? "查看详情" : title;
				vm.editFormParams.title = title;
				vm.editFormParams.readOnly = readOnly;
				vm.editFormParams.loading = false;
				vm.editFormParams.formName = formName;
				vm.editFormParams.show = true;
			},
			edit(formName, row, readOnly = false) {
				let vm = this;
				if (!$.obj.isEmpty(row)) {
					//修改、查看详情
					$.http.post(`${!$.obj.isEmpty(vm.editFormConfig[formName].apiBaseUrl) ? vm.editFormConfig[formName].apiBaseUrl : vm.apiBaseUrl}/getById`, {
						id: row.id
					}, true, function (xhr,
						status, result) {
						vm.showEditDialog(formName, result.data.data, readOnly);
					});
					return;
				}
				vm.showEditDialog(formName, vm.getFormDefault(formName), readOnly);
			},
			save() {
				let vm = this;
				if (vm.editFormParams.readOnly) {
					return;
				}
				if (vm.editFormParams.loading) {
					$.msg.warning("正在保存，请稍后~");
					return;
				}

				for (let prop in vm.editFromFileList) {
					let fileList = vm.editFromFileList[prop];
					for (let fileInfo of fileList) {
						if ("uploading" == fileInfo.status) {
							$.msg.warning("文件正在上传，请稍后~");
							return;
						}
					}
				}


				vm.$refs["editForm"].validate((valid) => {
					if (valid) {
						//校验通过
						vm.editFormParams.loading = true;
						let curFormId = vm.editFormParams.formId;
						$.http.post(`${!$.obj.isEmpty(vm.editFormConfig[vm.editFormParams.formName].apiBaseUrl) ? vm.editFormConfig[vm.editFormParams.formName].apiBaseUrl : vm.apiBaseUrl}/save`, vm.editForm, true, function (xhr,
							status, result) {
							vm.editFormParams.show = false;
							vm.search();
							$.msg.success(result.message);
						},
							function (xhr, status, error) { },
							function (xhr, status) {
								if (curFormId == vm.editFormParams.formId) {
									vm.editFormParams.loading = false;
								}
							});
					} else {
						$.msg.warning("请修正后重试！");
						return false;
					}
				});
			},
			searchResultSelectionChange(val) {
				let vm = this;
				vm.multipleSelection = val;
			},
			paginationSizeChange(val) {
				let vm = this;
				vm.search(null,val);
			},
			paginationCurrentChange(val) {
				let vm = this;
				vm.search(val);
			},
			delete(row) {
				let vm = this;
				vm.execDelete([row.id]);
			},
			batchDelete() {
				let vm = this;
				if ($.obj.isEmpty(vm.multipleSelection)) {
					$.msg.warning("请选择需要删除的数据！");
					return;
				}
				vm.execDelete(vm.multipleSelection.map(item => item.id));
			},
			execDelete(idArr) {
				let vm = this;
				window.top.app.$confirm('是否删除所选数据？', '删除确认', {
					type: 'warning'
				}).then(() => {
					$.http.post(`${vm.apiBaseUrl}/delete`, idArr, true, function (xhr, status,
						result) {
						vm.search();
						$.msg.success(result.message);
					});
				});
			},
			search(page,pageSize) {
				let vm = this;
				vm.multipleSelection = [];
				if (!$.obj.isEmpty(page)) {
					vm.pagination.curPage = page;
				}
				if (!$.obj.isEmpty(pageSize)) {
					vm.pagination.pageSize = pageSize;
				}
				vm.searchResultTableLoading = true;
				$.http.post(`${vm.apiBaseUrl}/page/${vm.pagination.curPage}/${vm.pagination.pageSize}`,
					vm.searchForm, true,
					function (xhr, status, result) {
						vm.pagination.total = result.data.total;
						vm.searchResult = result.data.records;
					},
					function (xhr, status, error) { },
					function (xhr, status) {
						vm.searchResultTableLoading = false;
					});
			}
		}
	});
});