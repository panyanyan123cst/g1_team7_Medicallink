const asideMenuAuth = [{
					id: 'userMoments',
					title: '顾客圈',
					icon:'el-icon-chat-line-round',
					role:["merchant","user"]
				},{
					id: 'userMoments',
					title: '顾客圈管理',
					icon:'el-icon-chat-line-round',
					role:["admin"]
				},{
					id: 'merchant',
					title: '美容院管理',
					icon:'el-icon-office-building',
					role:["admin"]
				},{
					id: 'user',
					title: '顾客管理',
					icon:'el-icon-user',
					role:["admin"]
				},{
					id: 'project',
					title: '项目管理',
					icon:'el-icon-present',
					role:["admin","merchant"]
				},{
					id: 'project',
					title: '美容项目',
					icon:'el-icon-present',
					role:["user"]
				},{
					id: 'order',
					title: '订单管理',
					icon:'el-icon-shopping-bag-2',
					role:["admin","merchant","user"]
				}
			];
Vue.prototype.asideMenuAuth = asideMenuAuth;