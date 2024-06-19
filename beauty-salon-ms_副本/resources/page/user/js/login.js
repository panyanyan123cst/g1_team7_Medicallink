window.document.title = "用户登录";

var app;

$(document).ready(function () {
	app = new Vue({
		el: '#app',
		data: {
			form: {},
			rules: {
				account: [{
					required: true,
					message: '请输入账号',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '请输入密码',
					trigger: 'blur'
				}]

			}
		},
		mounted: function () {
			let vm = this;

		},
		beforeDestroy() {
			let vm = this;
		},
		watch: {

		},
		computed: {

		},
		methods: {
			submitForm() {
				let vm = this;
				vm.$refs["form"].validate((valid) => {
					if (valid) {
						//校验通过
						$.http.post("user/login", vm.form, true, function (xhr, status, result) {
							//存储登录信息
							$.auth.setUserInfo(result.data);
							$.msg.success(result.message);
							$.browser.goToUrl($.http.getFrontEndBaseUrl() + "index.html");
						});
					} else {
						$.msg.warning("请修正后重试！");
						return false;
					}
				});
			},
			register() {
				window.top.$.browser.goToUrl($.http.getPageFullUrl("user/register"));
			}
		}
	});
});