//ViewModel层
//用于各类数据模型的双向绑定和控制区域

(function () {

	var DEBUG = false;

	//ws 链接事件
	MI.listener('ws/open', function (ws) {
		VIEW_MODEL['websocketStatus'] = {};
		var webscoketStatus = VIEW_MODEL['websocketStatus'];
		webscoketStatus['status'] = 'WebSocket 连接正常';
		webscoketStatus['is'] = true;
		webscoketStatus['color'] = '#ffffff';
		VIEW_MODEL.newVue('websocketStatus', {
			el: '#websocket'
		});
		VIEW_MODEL.newVue('websocketStatus', {
			el: '#websocket2'
		});
	});

	MI.listener('ws/close', function (ws) {
		var webscoketStatus = VIEW_MODEL['websocketStatus'];
		webscoketStatus['status'] = 'WebSocket 连接断开,请刷新网页重连';
		webscoketStatus['is'] = false;
		webscoketStatus['color'] = '#f5ea6c';
	});

	MI.listener('ws/error', function (ws) {
		var webscoketStatus = VIEW_MODEL['websocketStatus'];
		webscoketStatus['status'] = 'WebSocket 连接错误,请刷新网页重连';
		webscoketStatus['is'] = false;
		webscoketStatus['color'] = '#f5ea6c';
	});

	//单页生命周期替换事件
	MI.listener('page/live', function (ws) {
		for (var tmp in PAGE) delete PAGE[tmp];
		delete PAGE;
		PAGE = new Object();
	});

	//菜单获取
	MI.routeListener('ws/muem', function (data) {
		DEBUG && console.log('--- 系统菜单获取成功 ---')
		MCSERVER.username = data.obj.username;
		//虚拟的数据接受，让前端数据得到，菜单在前端建筑
		if (TOOLS.isMaster(MCSERVER.username)) {
			data.obj.items = MCSERVER.meumObject.masterMeum;
		} else {
			data.obj.items = MCSERVER.meumObject.notMasterMeum;
		}
		//copy
		MI.routeCopy('col-muem', data.obj);
		VIEW_MODEL.newVueOnce('col-muem', {
			el: '#SideColFor',
			data: {
				isOnMouse: false
			},
			methods: {
				onRedirect: function (link, api) {
					DEBUG && console.log('菜单处网页开始跳转:' + link);
					RES.redirectPage(link, api, 'update_page');
				},
				onMouse: function ($event, flag) {
					var $elem = $event.target;
					if (flag) {
						//进入
						$($elem).stop(true, true).animate({
							'padding-left': '24px'
						}, 200);
					} else {
						//移出
						$($elem).stop(true, true).animate({
							'padding-left': '20px'
						}, 200);
					}
				}
			}
		});

	});

	MI.routeListener('index/update', function (data) {
		MI.routeCopy('SystemUp', data.obj);
	});

	MI.routeListener('center/show', function (data) {
		MI.routeCopy('centerShow', data.obj);
	});

	MI.routeListener('server/view', function (data) {
		MI.routeCopy('ServerList', data.obj);
	});

	//UsersetList
	MI.routeListener('userset/update', function (data) {
		MI.routeCopy('UsersetList', data.obj);
	});

	//单个服务器的资料显示
	MI.routeListener('server/get', function (data) {
		MI.routeCopy('ServerPanel', data.obj);
	});

	//服务器控制台
	MI.routeListener('server/console', function (data) {
		if (data.obj == null) {
			TOOLS.pushMsgWindow('您并不拥有这个服务器的所有权，需要管理员设定');
			VIEW_MODEL['ConsolePanel'].serverData.name = null;
		}
		MI.routeCopy('ConsolePanel', data.obj);
	});

	MI.routeListener('userset/view', function (data) {
		MI.routeCopy('OneUserView', data.obj);
	});

	//Minecraft 服务器终端插入
	var terminalEncode = function (text) {
		var ify = '[_b_r_]';
		var txt = text;
		txt = txt.replace(/<br \/>/igm, '[_b_r_]');
		var consoleSafe = TOOLS.encode(txt);
		consoleSafe = consoleSafe.replace(/\[_b_r_\]/igm, '<br>');
		return consoleSafe;
	}

	MI.routeListener('server/console/ws', function (data) {
		var consoleSafe = terminalEncode(data.body);
		var MinecraftConsole = document.getElementById('TerminalMinecraft');
		if (MinecraftConsole == undefined) {
			console.log('NULL')
		}
		MinecraftConsole.innerHTML += consoleSafe;
		var BUFF_FONTIER_SIZE_DOWN = MinecraftConsole.scrollHeight - MinecraftConsole.clientHeight;
		if (MinecraftConsole.scrollTop + 354 >= BUFF_FONTIER_SIZE_DOWN) {
			MinecraftConsole.scrollTop = MinecraftConsole.scrollHeight;
		}
	});

	//获取控制台历史记录
	MI.routeListener('server/console/history', function (data) {
		var consoleSafe = terminalEncode(data.body);

		var MinecraftConsole = document.getElementById('TerminalMinecraft');
		var ifyLoad =
			'<span style="color:#3af138;">[历史日志] </span>' +
			'<span style="color:rgb(212, 136, 30);">================<br></span>';

		var oldTopV = 0;
		var oldHeightV = MinecraftConsole.scrollHeight;
		//incude
		MinecraftConsole.innerHTML = consoleSafe + ifyLoad + MinecraftConsole.innerHTML;
		var newTopV = MinecraftConsole.scrollTop;
		var newHeightV = MinecraftConsole.scrollHeight;

		var resVTopLac = newHeightV - oldHeightV;
		MinecraftConsole.scrollTop = resVTopLac - 60;
	});

	//普通用户主页
	MI.routeListener('genuser/home', function (data) {
		MI.routeCopy('GenHome', data.obj);
	});

	//配置项试图
	MI.routeListener('server/properties', function (data) {
		MI.routeCopy('ServerProperties', data.obj);
	});

	//配置项试图
	MI.routeListener('soft/view', function (data) {
		MI.routeCopy('SoftProperties', data.obj);
	});

})();