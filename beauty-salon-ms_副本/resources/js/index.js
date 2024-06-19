window.document.title = global.projectName;
$.auth.checkRole(["admin","merchant","user"]);

var app;

$(document).ready(function () {
	app = new Vue({
		el: '#app',
		data: {
			navId: "",
			iframeUrl: "",
			asideMenuId: "userMoments"
		},
		mounted: function () {
			let vm = this;
			vm.setIframe(["userMoments"]);
		},
		beforeDestroy() {
			let vm = this;
		},
		watch: {

		},
		computed: {

		},
		methods: {
			navClick(key, keyPath) {
				let vm = this;
				if ("logout" == key) {
					window.top.app.$confirm('是否确定退出登录？', '退出登录', {
						type: 'warning'
					}).then(() => {
						$.auth.logout();
					});
					return;
				}
				vm.setIframe(keyPath);
			},
			menuClick(key, keyPath) {
				let vm = this;
				vm.setIframe(keyPath);
			},
			setIframe(keyPath) {
				let vm = this;
				let url = keyPath.join("/") + (keyPath.length == 1 ? "/index" : "");
				vm.iframeUrl = $.http.getPageFullUrl(url);
			}
		}
	});
});