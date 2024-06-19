(function($) {
	/**对象工具 */
	$.obj = {
		//判断字符串是否为空（null、undefined、空字符串、全空格、长度为0）
		isEmpty: function(obj) {
			if (typeof obj === 'string') {
				return obj.trim().length === 0;
			} else if (obj === null || obj === undefined) {
				return true;
			} else if (Array.isArray(obj)) {
				return obj.length === 0;
			} else if (typeof obj === 'object') {
				if (obj instanceof File) {
					return obj.size === 0;
				}
				return Object.keys(obj).length === 0;
			}
			return false;
		},
		//深拷贝 只能拷贝属性
		deepCopy: function(obj) {
			// return Vue.util.extend({},obj);
			return JSON.parse(JSON.stringify(obj));
		}
	};
	/**浏览器工具类*/
	$.browser = {
		//跳转页面
		goToUrl: function(url, isNewTab = false) {
			if ($.obj.isEmpty(url)) {
				return;
			}
			if (isNewTab) {
				window.open(url, '_blank');
				return;
			}
			window.location.href = url;
		}
	};
	/**Http工具*/
	$.http = {
		//获取页面完整Url
		getPageFullUrl: function(pageUrl) {
			return $.http.getFrontEndBaseUrl() + global.pageBasePath + pageUrl + ".html";
		},
		//获取前端基础Url
		getFrontEndBaseUrl: function() {
			return window.location.origin + global.frontEndBasePath;
		},
		//发送post请求 Json
		post: function(url, data, async = true, successFn, errorFn, completeFn, beforeSendFn) {
			let execErrorFn = function(xhr, status, error) {
				let isSuccess = (status == "success");
				$.msg.error(isSuccess ? error : "网络异常，请检查网络！");
				if (isSuccess) {
					if (!$.obj.isEmpty(errorFn)) {
						errorFn(xhr, status, error);
					}
					return;
				}
			};

			let execSuccessFn = function(xhr, status, result) {
				if (!result.success) {
					if(800==result.code){
						$.auth.logout();
						return;
					}
					execErrorFn(xhr, status, result.message);
					return;
				}
				if (!$.obj.isEmpty(successFn)) {
					successFn(xhr, status, result);
				}
			};

			$.ajax({
				type: "POST",
				contentType: 'application/json',
				url: `${global.backendBaseUrl}api/${url}`,
				data: JSON.stringify(data),
				async: async,
				beforeSend: function(xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer ' + $.auth.getToken());
					if (!$.obj.isEmpty(beforeSendFn)) {
						beforeSendFn(xhr);
					}
				},
				complete: function(xhr, status) {
					if (!$.obj.isEmpty(completeFn)) {
						completeFn(xhr, status);
					}
				},
				error: function(xhr, status, error) {
					execErrorFn(xhr, status, error);
				},
				success: function(result, status, xhr) {
					execSuccessFn(xhr, status, result);
				}
			});
		},
		//下载文件
		download: function(url, fileName) {
			var link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		//获取文件URL
		getFileUrl: function(path) {
			return `${global.backendBaseUrl}upload/${path}`;
		}
	};
	/**提示工具类*/
	$.msg = {
		//显示提示
		show: function(msg, type, func) {
			window.top.app.$message({
				message: msg,
				type: type,
				offset: 55,
				center: true,
				onClose: func
			});
		},
		//普通提示
		normal: function(msg, func) {
			$.msg.show(msg, null, func);
		},
		//成功提示
		success: function(msg, func) {
			$.msg.show(msg, "success", func);
		},
		//警告提示
		warning: function(msg, func) {
			$.msg.show(msg, "warning", func);
		},
		//错误提示
		error: function(msg, func) {
			$.msg.show(msg, "error", func);
		}
	};
	/**存储工具类*/
	$.store = {
		get: function(key, isJson = true) {
			let value = localStorage.getItem(key);
			return isJson ? JSON.parse(value) : value;
		},
		set: function(key, value, isJson = true) {
			localStorage.setItem(key, isJson ? JSON.stringify(value) : value);
		},
		delete: function(key) {
			localStorage.removeItem(key);
		}
	};
	/**鉴权工具类*/
	$.auth = {
		getUserInfo: function(isCheckLogin = true) {
			let userInfo = $.store.get("userInfo");
			if (isCheckLogin && ($.obj.isEmpty(userInfo) || userInfo.expTime <= new Date())) {
				$.auth.logout();
				return null;
			}
			return userInfo;
		},
		getToken: function() {
			let userInfo = $.auth.getUserInfo(false);
			if ($.obj.isEmpty(userInfo)) {
				return null;
			}
			return userInfo.token;
		},
		setUserInfo: function(userInfo) {
			$.store.set("userInfo", userInfo);
		},
		logout: function() {
			$.store.delete("userInfo");
			window.top.$.browser.goToUrl($.http.getPageFullUrl("user/login"));
		},
		checkRole: function(authRoleList, isRedirect = true) {
			let userInfo = $.auth.getUserInfo(false);
			if (isRedirect && $.obj.isEmpty(userInfo)) {
				$.auth.logout();
				return false;
			}
			let result = (!$.obj.isEmpty(userInfo) && (authRoleList.includes(userInfo.role) || $.obj.isEmpty(authRoleList)));
			if (isRedirect && !result) {
				$.browser.goToUrl($.http.getPageFullUrl("common/noAccess"));
			}
			return result;
		}
	};
	/**随机工具类*/
	$.random = {
		getUUID: function() {
			var d = new Date().getTime();
			if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
			  d += performance.now(); // 使用高性能时间戳，如果可用
			}
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			  var r = (d + Math.random()*16)%16 | 0;
			  d = Math.floor(d/16);
			  return (c=='x' ? r : (r&0x3|0x8)).toString(16);
			});
		}
	};
	/**文件工具类*/
	$.file = {
		filesStr2List: function(filesStr) {
			let list = [];
			if($.obj.isEmpty(filesStr)){
				return list;
			}
			for (let file of filesStr.split(",")) {
				list.push($.http.getFileUrl(file));
			}
			return list;
		}
	};

    /**元素工具类*/
    $.ele = {
        //禁止滚动
        disableScrolling: function () {
            $('body').addClass('lb-overflow-hidden');
        },
        //恢复滚动
        restoreScrolling: function () {
            $('body').removeClass('lb-overflow-hidden');
        }
    };
})(jQuery);

Vue.prototype.$ = jQuery;