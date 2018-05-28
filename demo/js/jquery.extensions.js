
//获取当月第一天的星期几
Date.prototype.getMonthFirstDay = function() {
		return (new Date(this.getFullYear(), this.getMonth(), 1)).getDay();
	}
	//获取当月一共多少天
Date.prototype.getMonthDateMax = function() {
		return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).getDate();
	}
	//获取当天零点时间戳
Date.prototype.getDatetime = function() {
		return (new Date(this.getFullYear(), this.getMonth(), this.getDate())).getTime();
	}
	//判断是否为同一天
Date.prototype.isSameDay = function(date2) {
	return this.getFullYear() == date2.getFullYear() && this.getMonth() == date2.getMonth() && this.getDate() == date2.getDate() ? true : false;
}
Date.prototype.changeMonth = function(n) {
	var newYear = this.getFullYear();
	var newMonth = this.getMonth() + n;
	var newDate = this.getDate()
	if (newMonth >= 0) {
		newYear = newYear + Math.floor(newMonth / 12);
		newMonth = newMonth % 12;
	} else {
		newYear = newYear + Math.floor(newMonth / 12);
		newMonth = 12 + newMonth % 12;
	}
	var DateNew = new Date(newYear, newMonth, 1);
	if (newDate > DateNew.getMonthDateMax()) {
		newDate = DateNew.getMonthDateMax()
	}
	return new Date(newYear, newMonth, newDate);
}
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"N+": this.getMonth(), //月份
		"D+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒 //季度
		"S": this.getMilliseconds(), //毫秒
		"q+": Math.floor((this.getMonth() + 3) / 3)
	};
	if (/(Y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
	};
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
		};
	}
	return fmt;
	/*
    var time1 = dateNow().Format("YYYY-MM-DD");
	var time2 = dateNow().Format("YYYY-MM-DD hh:mm:ss");
    */
}



Date.prototype.CountdownTime = function(endTime, fmt) {
	var myTime = this.getTime();
	var difTime = endTime - myTime;
	if (fmt) {
		var difDD = Math.floor(difTime / (24 * 60 * 60 * 1000));
		var difhh = Math.floor((difTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
		var difmm = Math.floor((difTime % (60 * 60 * 1000)) / (60 * 1000));
		var difss = Math.floor((difTime % (60 * 1000)) / 1000);
		var o = {
			"D+": difDD, //日
			"h+": difhh, //小时
			"m+": difmm, //分
			"s+": difss
		};
		if (/(Y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
		};
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
			};
		}
		return fmt;
	} else {
		return difTime;
	}
}

//解决ie8下 Array不支持indexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/ ) {
		var len = this.length >>> 0;

		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0)
			from += len;

		for (; from < len; from++) {
			if (from in this &&
				this[from] === elt)
				return from;
		}
		return -1;
	};
}
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

Array.prototype.mergeSort = function(callback) {
	var rootArr = this;

	function arrayMergeSort(arr, callback) {

		function merge(left, right, callback) {
			var result = [];
			while (left.length > 0 && right.length > 0) {
				if (callback(left[0], right[0]) <= 0) {
					result.push(left.shift());
				} else {
					result.push(right.shift());
				}
			}
			return result.concat(left).concat(right);
		}

		if (arr.length <= 1) return arr;
		var middle = Math.floor(arr.length / 2),
			left = arr.slice(0, middle),
			right = arr.slice(middle);

		return merge(arrayMergeSort(left, callback), arrayMergeSort(right, callback), callback);
	}
	if (callback == undefined) {
		this.sort();
	} else {
		rootArr = arrayMergeSort(rootArr, callback);
		this.length = 0;
		Array.prototype.push.apply(this, rootArr)
	}
	return rootArr;
}


//字符串参数替换
//'爱 %3 上了 %1 肯德 %2 基拉%3克丝%4建档立卡介%%绍的老%%%卡就死%123456665定了空间啊 %99 路上看到骄傲了可视对讲'.arg('aaa','bbb','ccc','ddd','eee')
String.prototype.arg = function() {
	var replaceStrArr = arguments;
	var resultArr = this.match(/\s%[0-9]+\s/g);
	resultArr.sort(function(a, b) {
		return a.substr(2) * 1 - b.substr(2) * 1
	})
	var resultObj = {
		len: 0
	}
	for (var i = 0, len = resultArr.length; i < len; i++) {
		var result = resultArr[i];
		if (resultObj[result] == undefined) {
			resultObj[result] = resultObj.len++;
		}
	}
	var argStr = this.replace(/\s%[0-9]+\s/g, function(e) {
		var replaceStr = replaceStrArr[resultObj[e]];
		if (replaceStr != undefined) {
			return replaceStr;
		} else {
			return e;
		}
	})
	return argStr;
};
String.prototype.htmlEntities=function(Decode){
	var returnStr,
		conElement=document.createElement('div');
	if(Decode!='Decode'){
		conElement.innerText=this;
		returnStr=conElement.innerHTML;
	}else{
		conElement.innerHTML=this;
		returnStr=conElement.innerText;
	}
	conElement=null;
	return returnStr;
};




/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function($) {
	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch (e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function(key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires,
					t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function(key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, {
			expires: -1
		}));
		return !$.cookie(key);
	};

})(jQuery);


(function($) {
	$.each(['show', 'hide'], function(i, ev) {
		var el = $.fn[ev];
		$.fn[ev] = function() {
			this.trigger(ev);
			return el.apply(this, arguments);
		};
	});
})(jQuery);


//$.urlGet()
(function($) {
	$.extend({
		/**
		 * url get parameters
		 * @public
		 * @return array()
		 */
		urlGet: function(urlStr) {
			if (urlStr == undefined) {
				urlStr = window.location.search
			}
			var aQuery = urlStr.split("?"); //取得Get参数
			var aGET = new Array();
			if (aQuery.length > 1) {
				var aBuf = aQuery[1].split("&");
				for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
					var aTmp = aBuf[i].split("="); //分离key与Value
					aGET[aTmp[0]] = aTmp[1];
				}
				aGET['length'] = i;
			}
			return aGET;
		},
		zeroDigit: function(n, l) {
			l = l || 2;
			var s = n + '';
			while (s.length < l) {
				s = '0' + s;
			}
			return s;
		},
		n2br: function(s) {
			s = s.replace(new RegExp("\n", "g"), "<br>");
			return s;
		},
		inBrowser: function(bsCallback, qtCallback) {
			if (window.widget && window.widget.serverDate && qtCallback) {
				qtCallback();
			} else if (bsCallback) {
				bsCallback();
			}
		},
		timeNow: function() {
			if (window.widget && window.widget.serverDate) {
				return window.widget.serverDate() * 1000;
			}else{
				return new Date().getTime()
			}
		},
		dateNow: function() {
			return new Date($.timeNow());
		},
		time2date: function(myTime) {
			if (typeof(myTime) != 'object') {
				if (typeof(myTime) != 'Number') {
					myTime = Number(myTime);
				}
				myTime = new Date(myTime);
			}
			return myTime;
		},
		date2time: function(myDate) {
			if (typeof(myDate) == 'object') {
				myDate = myDate.getTime();
			} else if (typeof(myDate) == 'string') {
				myDate = parseInt(myDate);
			}
			return myDate;
		},
		isArray: function(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		},
		parseInt: function(str) {
			if (str == undefined || isNaN(str)) {
				return 0;
			}
			var myIntValue = parseInt(str);
			if (isNaN(myIntValue)) {
				return 0;
			};
			return myIntValue
		},
		arrayDelete: function(arr, str) {
			if (typeof str != 'string') {
				console.error(str + ' can not remove, Array delete only by string');
				return false;
			}
			console.log("arr,str", arr, str);
			arr.splice(arr.indexOf(str), 1);
		},
		dateCreate: function(str) {
			str = str || '';
			var arr = str.split(',');
			return new Date(Date.UTC.apply(this, arr) + (new Date).getTimezoneOffset() * 60 * 1000);
		},
		timeHistoryText: function(historyDateTime, nowDateTime) {

			//timeDeviation
			nowDateTime = nowDateTime || $.timeNow();

			var historyDateStartTime = (new Date(historyDateTime)).getDatetime();
			var nowDateStartTime = (new Date(nowDateTime)).getDatetime();

			var dateMarkText = '';
			if (historyDateStartTime < nowDateStartTime) {
				var dayDeviation = Math.floor((nowDateStartTime - historyDateStartTime) / (24 * 60 * 601000));
				if (dayDeviation < 1) {
					dateMarkText = '昨天'
				} else if (dayDeviation < 2) {
					dateMarkText = '前天'
				} else {
					dateMarkText = (new Date(historyDateTime)).Format('MM-DD hh:mm');
				}
			} else {
				if (historyDateTime < nowDateTime) {
					dateMarkText = (new Date(historyDateTime)).Format('hh:mm');
				} else {
					dateMarkText = (new Date(historyDateTime)).Format('MM-DD hh:mm');
				}
			}
			return dateMarkText;
		},
		getArrByAttr: function(obj, attr) {
			var arr = [];
			$.each(obj, function(index, value) {
				if (value != undefined) {
					arr.push(value[attr]);
				}
			});
			return arr;
		},
		listenerFunction: function(obj, listenerProperty) {
			var fnList = [];
			obj[listenerProperty] = function() {
				var fnLen = arguments.length;
				if (fnLen > 0) {
					switch (arguments[fnLen - 1]) {
						case 'remove':
							for (var i = 0; i < fnLen - 1; i++) {
								fnList.remove(arguments[i]);
							}
							break;
						default:
							for (var i = 0; i < fnLen; i++) {
								fnList.push(arguments[i]);
							}
					}
				} else {
					for (var i = 0, len = fnList.length; i < len; i++) {
						fnList[i]();
					}
				}
			}
		},
		functionEvent: function(obj, eventRunName, eventAddName) {
			var fnList = [];
			obj[eventRunName] = function(callback) {
				for (var i = 0, len = fnList.length; i < len; i++) {
					fnList[i]();
				}
			}
			obj[eventAddName] = function() {
				var fnLen = arguments.length;
				if (fnLen > 0) {
					switch (arguments[fnLen - 1]) {
						case 'remove':
							for (var i = 0; i < fnLen - 1; i++) {
								fnList.remove(arguments[i]);
							}
							break;
						default:
							for (var i = 0; i < fnLen; i++) {
								fnList.push(arguments[i]);
							}
					}
				}
			}
		},
		dataDomSort: function(domDataList, dataDomName, $parentContainer, sortCallback, mergeSort) {
			var domListArr = [];
			for (var k in domDataList) {
				var domData = domDataList[k];
				domListArr.push(domData);
			}
			if (mergeSort) {
				domListArr.mergeSort(sortCallback);
			} else {
				domListArr.sort(sortCallback);
			}

			for (var i = 0, len = domListArr.length; i < len; i++) {
				var dataDom = domListArr[i][dataDomName];
				var domSn = $parentContainer.children().index(dataDom.$dom);
				if (domSn != i) {
					var $nextDataDom = $parentContainer.children().eq(i);
					$nextDataDom.before(dataDom.$dom);
				}
			}
		}
	});
	$.fn.extend({
		value: function() {
			var $this = $(this);
			var deVal = $this.attr('data-tips');
			if (deVal == undefined) {
				deVal = '';
			}
			var myDataValue = $this.attr('data-value');
			if (myDataValue != undefined) {
				if (myDataValue != deVal) {
					return myDataValue;
				} else {
					return '';
				}
			}
			var myVal = $this.val();
			if (myVal == deVal) {
				myVal = '';
			}
			return myVal;
		},
		valueReset: function() {
			var $input = $(this);
			var deVal = $input.attr('data-tips');
			if (deVal == undefined) {
				deVal = '';
			}
			$input.removeClass('focus').removeAttr('data-value').val(deVal);
		},
		parentIframeDom: function() {
			var parentIframeDom = undefined;
			$(window.parent.document).find('iframe').each(function() {
				var iframeDom = this;
				if (iframeDom.contentWindow == window) {
					parentIframeDom = iframeDom;
				}
			})
			return parentIframeDom;
		},
		inWindow: function() {
			var windowRect = {
					left: 0,
					top: 0,
					right: $(window).width(),
					bottom: $(window).height()
				},
				callback = function() {},
				edgeCheck = false;
			for (var i = 0, len = arguments.length; i < len; i++) {
				var argument = arguments[i];
				if (typeof argument == 'string') {
					var $argument = $(argument);
					if ($argument.length > 0) {
						windowRect = $argument[0].getBoundingClientRect();
					}
				}
				if (argument instanceof jQuery) {
					windowRect = argument[0].getBoundingClientRect();
				}
				if (typeof argument == 'function') {
					callback = argument;
				}
				if (typeof argument == 'boolean') {
					edgeCheck = argument;
				}
			}
			var domRect = this[0].getBoundingClientRect();
			if (edgeCheck) {
				if (
					domRect.left < windowRect.left ||
					domRect.top < windowRect.top ||
					domRect.right > windowRect.right ||
					domRect.bottom > windowRect.bottom
				) {
					return false;
				}
			} else {
				if (
					domRect.left >= windowRect.right ||
					domRect.top >= windowRect.bottom ||
					domRect.right <= windowRect.left ||
					domRect.bottom <= windowRect.top
				) {
					return false;
				}
			}
			callback();
			return true;
		}
	});
})(jQuery);




(function($) {
	$.extend({
		msgExample: function(sn) {
			var dataArr = [{
				"name": "萧楚女",
				"msg": "人生应该如蜡烛一样，从顶燃到底，一直都是光明的。"
			}, {
				"name": "徐玮",
				"msg": "人生的价值，即以其人对于当代所做的工作为尺度。"
			}, {
				"name": "吉鸿昌",
				"msg": "路是脚踏出来的，历史是人写出来的。人的每一步行动都在书写自己的历史。"
			}, {
				"name": "吴玉章",
				"msg": "春蚕到死丝方尽，人至期颐亦不休。一息尚存须努力，留作青年好范畴。"
			}, {
				"name": "郭小川",
				"msg": "但愿每次回忆，对生活都不感到负疚"
			}, {
				"name": "奥斯特洛夫斯基",
				"msg": "人的一生可能燃烧也可能腐朽，我不能腐朽，我愿意燃烧起来！"
			}, {
				"name": "歌德",
				"msg": "你若要喜爱你自己的价值，你就得给世界创造价值。"
			}, {
				"name": "易卜生",
				"msg": "社会犹如一条船，每个人都要有掌舵的准备。"
			}, {
				"name": "列夫·托尔斯泰",
				"msg": "人生不是一种享乐，而是一桩十分沉重的工作。"
			}, {
				"name": "列夫·托尔斯泰",
				"msg": "人生的价值，并不是用时间，而是用深度去衡量的。"
			}, {
				"name": "车尔尼雪夫斯基",
				"msg": "生活只有在平淡无味的人看来才是空虚而平淡无味的。"
			}, {
				"name": "爱因斯坦",
				"msg": "一个人的价值，应该看他贡献什么，而不应当看他取得什么。"
			}, {
				"name": "爱因斯坦",
				"msg": "人只有献身于社会，才能找出那短暂而有风险的生命的意义。"
			}, {
				"name": "秋瑾",
				"msg": "芸芸众生，孰不爱生？爱生之极，进而爱群。"
			}, {
				"name": "郭小川",
				"msg": "生活真象这杯浓酒，不经三番五次的提炼呵，就不会这样可口！"
			}, {
				"name": "赫胥黎",
				"msg": "充满着欢乐与斗争精神的人们，永远带着欢乐，欢迎雷霆与阳光。"
			}, {
				"name": "罗丹",
				"msg": "为了生活中努力发挥自己的作用，热爱人生吧。"
			}, {
				"name": "鲁迅",
				"msg": "希望是附丽于存在的，有存在，便有希望，有希望，便是光明。"
			}, {
				"name": "郭小川",
				"msg": "沉沉的黑夜都是白天的前奏。"
			}, {
				"name": "冯学峰",
				"msg": "当一个人用工作去迎接光明，光明很快就会来照耀着他。"
			}, {
				"name": "雪莱",
				"msg": "东天已经到来，春天还会远吗？"
			}, {
				"name": "雪莱",
				"msg": "过去属于死神，未来属于你自己。"
			}, {
				"name": "罗丹",
				"msg": "世间的活动，缺点虽多，但仍是美好的。"
			}, {
				"name": "布莱克",
				"msg": "辛勤的蜜蜂永没有时间悲哀。"
			}, {
				"name": "普希金",
				"msg": "希望是厄运的忠实的姐妹。"
			}, {
				"name": "朗费罗",
				"msg": "当你的希望一个个落空，你也要坚定，要沉着！"
			}, {
				"name": "屠格涅夫",
				"msg": "先相信你自己，然后别人才会相信你。"
			}, {
				"name": "高尔基",
				"msg": "不要慨叹生活底痛苦！---慨叹是弱者......"
			}, {
				"name": "罗曼·罗兰",
				"msg": "宿命论是那些缺乏意志力的弱者的借口。"
			}, {
				"name": "林逋",
				"msg": "私心胜者，可以灭公。"
			}, {
				"name": "刘鹗",
				"msg": "人人好公，则天下太平；人人营私，则天下大乱。"
			}, {
				"name": "吕坤",
				"msg": "自私自利之心，是立人达人之障。"
			}, {
				"name": "陶铸",
				"msg": "如烟往事俱忘却，心底无私天地宽。"
			}, {
				"name": "谢觉哉",
				"msg": "常求有利别人，不求有利自己。"
			}, {
				"name": "列夫·托尔斯泰",
				"msg": "一切利己的生活，都是非理性的，动物的生活。"
			}, {
				"name": "海涅",
				"msg": "人的理性粉碎了迷信，而人的感情也将摧毁利己主义。"
			}, {
				"name": "布莱希特",
				"msg": "无私是稀有的道德，因为从它身上是无利可图的。"
			}, {
				"name": "孔丘",
				"msg": "君子喻于义，小人喻于利。"
			}, {
				"name": "陶渊明",
				"msg": "不戚戚于贫贱，不汲汲于富贵。"
			}, {
				"name": "程颢",
				"msg": "富贵不淫贫贱乐，男儿到此是豪雄。"
			}, {
				"name": "方志敏",
				"msg": "清贫，洁白朴素的生活，正是我们革命者能够战胜许多困难的地方！"
			}, {
				"name": "孔丘",
				"msg": "三军可夺帅也,匹夫不可夺志也。"
			}, {
				"name": "墨翟",
				"msg": "志不强者智不达。"
			}, {
				"name": "陈涉",
				"msg": "燕雀安知鸿鹄之志哉！"
			}, {
				"name": "诸葛亮",
				"msg": "志当存高远。"
			}, {
				"name": "曹操",
				"msg": "老骥伏枥，志在千里；烈士暮年，壮心不已。"
			}, {
				"name": "曹植",
				"msg": "燕雀戏藩柴，安识鸿鹄游。"
			}, {
				"name": "王勃",
				"msg": "穷且益坚，不坠青云之志。"
			}, {
				"name": "李白",
				"msg": "大鹏一日同风起，扶摇直上九万里。"
			}, {
				"name": "苏轼",
				"msg": "古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。"
			}, {
				"name": "李清照",
				"msg": "生当作人杰，死亦为鬼雄，至今思项羽，不肯过江东。"
			}, {
				"name": "陆游",
				"msg": "壮心未与年俱老，死去犹能作鬼雄。"
			}, {
				"name": "王阳明",
				"msg": "故立志者，为学之心也；为学者，立志之事也。"
			}, {
				"name": "吕坤",
				"msg": "贫不足羞，可羞是贫而无志。"
			}, {
				"name": "契诃夫",
				"msg": "我们以人们的目的来判断人的活动。目的伟大，活动才可以说是伟大的。"
			}, {
				"name": "培根",
				"msg": "毫无理想而又优柔寡断是一种可悲的心理。"
			}, {
				"name": "张闻天",
				"msg": "生活的理想，就是为了理想的生活。"
			}, {
				"name": "丁玲",
				"msg": "人，只要有一种信念，有所追求，什么艰苦都能忍受，什么环境也都能适应。"
			}, {
				"name": "黑格尔",
				"msg": "理想的人物不仅要在物质需要的满足上，还要在精神旨趣的满足上得到表现。"
			}, {
				"name": "巴尔扎克",
				"msg": "一个能思想的人，才真是一个力量无边的人。"
			}, {
				"name": "车尔尼雪夫斯基",
				"msg": "一个没有受到献身的热情所鼓舞的人，永远不会做出什么伟大的事情来。"
			}, {
				"name": "奥斯特洛夫斯基",
				"msg": "共同的事业，共同的斗争，可以使人们产生忍受一切的力量。"
			}, {
				"name": "爱因斯坦",
				"msg": "我从来不把安逸和快乐看作是生活目的本身---这种伦理基础，我叫它猪栏的理想。"
			}, {
				"name": "孟德斯鸠",
				"msg": "在一个人民的国家中还要有一种推动的枢纽，这就是美德。"
			}, {
				"name": "但丁",
				"msg": "人不能象走兽那样活着，应该追求知识和美德。"
			}, {
				"name": "刘备",
				"msg": "勿以恶小而为之，勿以善小而不为。惟贤惟德，能服于人。"
			}, {
				"name": "张衡",
				"msg": "不患位之不尊，而患德之不崇；不耻禄之不伙，而耻智之不博。"
			}, {
				"name": "李白",
				"msg": "土扶可城墙，积德为厚地。"
			}, {
				"name": "神涵光",
				"msg": "行一件好事，心中泰然；行一件歹事，衾影抱愧。"
			}, {
				"name": "周恩来",
				"msg": "入于污泥而不染、不受资产阶级糖衣炮弹的侵蚀，是最难能可贵的革命品质。"
			}, {
				"name": "郭沫若",
				"msg": "一个人最伤心的事情无过于良心的死灭。"
			}, {
				"name": "斯宾诺莎",
				"msg": "害羞是畏惧或害怕羞辱的情绪，这种情绪可以阻止人不去犯某些卑鄙的行为。"
			}, {
				"name": "德谟克利特",
				"msg": "应该热心地致力于照道德行事，而不要空谈道德。"
			}, {
				"name": "凯洛夫",
				"msg": "感情有着极大的鼓舞力量，因此，它是一切道德行为的重要前提。"
			}, {
				"name": "罗曼·罗兰",
				"msg": "没有伟大的品格，就没有伟大的人，甚至也没有伟大的艺术家，伟大的行动者。"
			}, {
				"name": "高尔基",
				"msg": "理智要比心灵为高，思想要比感情可靠。"
			}, {
				"name": "列夫·托尔斯泰",
				"msg": "人类被赋予了一种工作，那就是精神的成长。"
			}, {
				"name": "契诃夫",
				"msg": "人在智慧上应当是明豁的，道德上应该是清白的，身体上应该是清洁的。"
			}, {
				"name": "马克思",
				"msg": "良心是由人的知识和全部生活方式来决定的。"
			}, {
				"name": "魏徵",
				"msg": "不念居安思危，戒奢以俭；斯以伐根而求木茂，塞源而欲流长也。"
			}, {
				"name": "李商隐",
				"msg": "历览前贤国与家，成由勤俭破由奢。"
			}, {
				"name": "贝多芬",
				"msg": "把“德性”教给你们的孩子：使人幸福的是德性而非金钱。这是我的经验之谈。在患难中支持我的是道德，使我不曾自杀的，除了艺术以外也是道德。"
			}, {
				"name": "狄德罗",
				"msg": "如果道德败坏了，趣味也必然会堕落。"
			}, {
				"name": "贝多芬",
				"msg": "我愿证明，凡是行为善良与高尚的人，定能因之而担当患难。"
			}, {
				"name": "卢梭",
				"msg": "装饰对于德行也同样是格格不入的，因为德行是灵魂的力量和生气。"
			}, {
				"name": "卢梭",
				"msg": "我深信只有有道德的公民才能向自己的祖国致以可被接受的敬礼。"
			}, {
				"name": "夸美纽斯",
				"msg": "对于事实问题的健全的判断是一切德行的真正基础。"
			}, {
				"name": "夸美纽斯",
				"msg": "德行的实现是由行为，不是由文字。"
			}, {
				"name": "王安石",
				"msg": "霸祖孤身取二江，子孙多以百城降。豪华尽出成功后，逸乐安知与祸双？"
			}, {
				"name": "伊索",
				"msg": "阴谋陷害别人的人，自己会首先遭到不幸。"
			}, {
				"name": "罗大经",
				"msg": "奢则妄取苟取，志气卑辱；一从俭约，则于人无求，于己无愧，是可以养气也。"
			}, {
				"name": "司马光",
				"msg": "侈则多欲。君子多欲则念慕富贵，枉道速祸。"
			}, {
				"name": "孔丘",
				"msg": "知耻近乎勇。"
			}, {
				"name": "王通",
				"msg": "辱，莫大于不知耻。"
			}, {
				"name": "孔丘",
				"msg": "君子忧道不忧贫。"
			}];
			if (sn == undefined) {
				sn = Math.floor(Math.random() * dataArr.length);
			}
			return dataArr[sn];
		}
	})
})(jQuery);