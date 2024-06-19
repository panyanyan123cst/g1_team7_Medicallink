window.document.title = "用户注册";

var app;

$(document).ready(function () {
	app = new Vue({
		el: '#app',
		data: {
			form: {},
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
				checkPassword: [{
					required: true,
					message: '请再次输入密码',
					trigger: 'blur'
				},
				{
					validator: (rule, value, callback) => {
						if ($.obj.isEmpty(value)) {
							callback(new Error('请再次输入密码'));
						} else if (value !== app.form.password) {
							callback(new Error('两次输入密码不一致!'));
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
						$.http.post("user/register", vm.form, true, function (xhr, status, result) {
							$.msg.success(result.message);
							$.browser.goToUrl("login.html");
						});
					} else {
						$.msg.warning("请修正后重试！");
						return false;
					}
				});
			},
			login() {
				window.top.$.browser.goToUrl($.http.getPageFullUrl("user/login"));
			}
		}
	});
});