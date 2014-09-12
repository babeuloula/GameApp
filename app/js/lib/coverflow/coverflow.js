/** @license
 * Cover Flow
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/06/20)
 * Version: 1.2 - (2013/11/09)
 * https://github.com/luwes/js-cover-flow
 */

var players = {};

var coverflow = window.coverflow = function(id) {
	if (!id) {
		for (var key in players) {
			id = players[key].id;
		}
	}
	if (id) {
		var foundPlayer = players[id];
		if (foundPlayer) {
			return foundPlayer;
		} else {
			return players[id] = new Api(id);
		}
	}
	return null;
};

if (typeof jQuery !== 'undefined') {
	jQuery.fn.coverflow = function(method) {
		var player = coverflow(this[0].id);
		if (player[method]) {
			return player[method].apply(player, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object') {
			return player.setup.apply(player, arguments);
		} else if (!method) {
			return player;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.coverflow');
		}
	};
}
;
var idCounter = 0;

var _ = {

	hasFlash: ((typeof navigator.plugins != 'undefined' &&
		typeof navigator.plugins['Shockwave Flash'] == 'object') ||
		(window.ActiveXObject && (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) !== false)),

	isIE: !!navigator.userAgent.match(/msie/i) ||
		!!navigator.userAgent.match(/Trident\/7\./),

	uniqueId: function(prefix) {
		var id = idCounter++;
		return prefix ? prefix + id : id;
	},

	bind: function(fn, context) {
		return function() { fn.apply(context); };
	},

	on: function(el, type, fn) {
		if (!el) return;
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.attachEvent) {
				el.attachEvent('on' + arr[i], fn);
			} else {
				el.addEventListener(arr[i], fn, false);
			}
		}
	},

	off: function(el, type, fn) {
		if (!el) return;
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.detachEvent) {
				el.detachEvent('on' + arr[i], fn);
			} else {
				el.removeEventListener(arr[i], fn, false);
			}
		}
	},

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	addClass: function(el, classname) {
		if (el.className.indexOf(classname) === -1) {
			el.className += ' ' + classname;
		}
	},

	css: function(el, props) {
		if (el) {
			for (var key in props) {
				if (typeof props[key] === 'undefined') {
					continue;
				} else if (typeof props[key] == 'number' && !(key == 'zIndex' || key == 'opacity')) {
					if (isNaN(props[key])) {
						continue;
					}
					props[key] = Math.ceil(props[key]) + 'px';
				}
				try {
					el.style[key] = props[key];
				} catch (e) {}
			}
		}
	},

	hexToRgb: function(hex) {
		// Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	},

	ajax: function(xmldocpath, completecallback, errorcallback) {
		var xmlhttp;
		if (window.XMLHttpRequest) {
			// IE>7, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		} else {
			// IE6
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		}
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					if (completecallback) {
						completecallback(xmlhttp);
					}
				} else {
					if (errorcallback) {
						errorcallback(xmldocpath);
					}
				}
			}
		};
		try {
			xmlhttp.open('GET', xmldocpath, true);
			xmlhttp.send(null);
		} catch (error) {
			if (errorcallback) {
				errorcallback(xmldocpath);
			}
		}
		return xmlhttp;
	},

	jsonp: function(url, callback, params) {
		
		var query = url.indexOf('?') === -1 ? '?' : '&';
		params = params || {};
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				query += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
			}
		}
		
		var jsonp = _.uniqueId('json_call');
		window[jsonp] = function(data) {
			callback(data);
			window[jsonp] = null;
		};
 
		var script = document.createElement('script');
		if (url.indexOf('callback=?') !== -1) {
			script.src = url.replace('callback=?', 'callback='+jsonp) + query.slice(0, -1);
		} else {
			script.src = url + query + 'callback=' + jsonp;
		}
		script.async = true;
		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				script.onload = script.onreadystatechange = null;
				if (script && script.parentNode) {
					script.parentNode.removeChild(script);
				}
			}
		};
		
		var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
		// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
		// This arises when a base node is used (#2709 and #4378).
		head.insertBefore(script, head.firstChild);
	},

	getResizeDimensions: function(wid, hei, maxWid, maxHei) {

		var ratio = Math.min(maxWid / wid, maxHei / hei);
		return { width: wid*ratio, height: hei*ratio, ratio: ratio };
	},

	getCropOffsets: function(wid, hei, newWid, newHei) {

		var ratio = [newWid / wid, newHei / hei];
		return ratio[0] < ratio[1] ?
			{ left: (wid - newWid / ratio[1]) * 0.5, top: 0, ratio: ratio[1] } :
			{ top: (hei - newHei / ratio[0]) * 0.5, left: 0, ratio: ratio[0] } ;
	},

	getChildIndex: function(node) {
		var i = 0;
		while ((node = node.previousSibling) !== null) {
			if (node.nodeType === 1) ++i;
		}
		return i;
	}
};
;
var Api = function(id) {

	var _this = this;
	var player;
	var readyFlag;

	this.id = id;
	this.el = document.getElementById(id);
	this.config = null;

	this.setup = function(options) {

		player = null;
		readyFlag = false;
	
		var defaultConfig = {
			mode:					'html5',
			flash:					'coverflow.swf',
			width:					480,
			height:					270,
			item:					0,
			backgroundcolor:		'000000',
			backgroundopacity:		1,
			wmode:					'window',
			gradientcolor:			undefined,
			coverwidth:				150,
			coverheight:			'auto',
			covergap:				40,
			coverangle:				70,
			coverdepth:				170,
			coveroffset:			130,
			fixedsize:				false,
			opacitydecrease:		0.1,	//is not enabled in HTML5, too slow on iOS
			reflectionopacity:		0.3,
			reflectionratio:		155,
			reflectionoffset:		0,
			showtext:				true,
			textstyle:				'.coverflow-text{color:#f1f1f1;text-align:center;font-family:Arial Rounded MT Bold,Arial;} .coverflow-text h1{font-size:14px;font-weight:normal;line-height:21px;} .coverflow-text h2{font-size:11px;font-weight:normal;} .coverflow-text a{color:#0000EE;}',
			textoffset:				75,
			tweentime:				0.8,
			rotatedelay:			0,
			focallength:			250,
			framerate:				60,
			mousewheel:				true,
			x:						0,
			y:						0
		};

		this.events = {
			ready: new Signal(),
			playlist: new Signal(),
			focus: new Signal(),
			click: new Signal()
		};

		this.config = _.extend(defaultConfig, options);
		this.config.id = this.id;

		this.el = document.getElementById(id);
		this.el.innerHTML = '';
		this.el.tabIndex = 0;
		_.addClass(this.el, 'coverflow');

		if (String(this.config.width).indexOf('%') !== -1) {
			_.off(window, 'resize', resizeHandler);
			_.on(window, 'resize', resizeHandler);
		}

		this.resize(this.config.width, this.config.height);

		if (this.getMode() === 'html5') {
			player = new Html5(this);
		} else if (this.getMode() === 'flash') {
			player = new Flash(this);
		}

		this.left = player.left;
		this.right = player.right;
		this.prev = player.prev;
		this.next = player.next;
		this.to = player.to;

		return this;
	};

	this.remove = function() {
		var replacement = document.createElement('div');
		replacement.id = this.id;
		this.el.parentNode.replaceChild(replacement, this.el);
		this.el = replacement;

		_.off(window, 'resize', resizeHandler);
		if (player) player.destroy();

		delete players[this.id];
	};

	function resizeHandler() {
		_this.resize();
	}

	this.resize = function(wid, hei) {

		_.css(this.el, {
			width: wid,
			height: hei
		});

		this.config.width = this.el.clientWidth;
		this.config.height = this.el.clientHeight;

		if (player) {
			player.resize(this.config.width, this.config.height);
		}
	};

	this.getMode = function() {
		if (_.hasFlash && this.config.mode === 'flash') {
			return 'flash';
		}
		if (!_.isIE && Modernizr.csstransforms3d && Modernizr.csstransitions && Modernizr.canvas) {
			return 'html5';
		}
		return 'flash';
	};

	this.on = function(event, func) {
		this.events[event].on(func);
		if (readyFlag && event === 'ready') {
			this.events.ready.trigger.apply(this);
		}
		return this;
	};

	this.off = function(event, func) {
		this.events[event].off(func);
		return this;
	};

	this.trigger = function(event) {
		readyFlag = true;
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		this.events[event].trigger.apply(this, args);
	};
};
;
var Controller = function(flow, elem, config) {
	this.flow = flow;
	this.elem = elem;
	this.config = config;
	
	this.currentX = 0;
	this.currentY = 0;
	this.transformProp = Modernizr.prefixed('transitionDuration');
};

Controller.prototype.handleEvent = function(e) {
	this[e.type](e);
};

Controller.prototype.touchstart = function(e) {
	e.stopImmediatePropagation();
	this.startX = e.touches[0].pageX - this.currentX;
	this.startY = e.touches[0].pageY - this.currentY;
	this.pageY = e.touches[0].pageY;
	this.moved = false;
	window.addEventListener('touchmove', this, true);
	window.addEventListener('touchend', this, true);
	this.elem.style[this.transformProp] = '0s';
};

Controller.prototype.touchmove = function(e) {
	e.stopImmediatePropagation();

	this.lastX = this.currentX;
	this.lastY = this.currentY;
	this.currentX = e.touches[0].pageX - this.startX;
	this.currentY = e.touches[0].pageY - this.startY;

	if (Math.abs(this.currentX - this.lastX) > Math.abs(this.currentY - this.lastY)) {
		e.preventDefault();
		this.moved = true;

		this.lastMoveTime = new Date().getTime();
		this.flow.update(this.currentX);
	} else {
		window.removeEventListener('touchmove', this, true);
		window.removeEventListener('touchend', this, true);	
	}
};

Controller.prototype.touchend = function(e) {
	e.stopImmediatePropagation();
	e.preventDefault();

	window.removeEventListener('touchmove', this, true);
	window.removeEventListener('touchend', this, true);

	this.elem.style[this.transformProp] = this.config.tweentime + 's';

	if (this.moved) {
		var delta = this.currentX - this.lastX;
		var dt = new Date().getTime() - this.lastMoveTime + 1;
		
		this.currentX = this.currentX + delta * 50 / dt;
		this.flow.updateTouchEnd(this);
	} else {
		this.flow.tap(e, this.currentX);
	}
};

Controller.prototype.to = function(index) {
	this.currentX = -index * this.config.covergap;
	this.flow.update(this.currentX);
};
;
var Cover = function(flow, index, url, config) {

	var _this = this;

	var newWidth;
	var newHeight;
	
	this.index = index;
	this.halfHeight = 0;
	
	this.el = document.createElement('div');
	this.el.className = Cover.getClassName();
	var cellStyle = this.el.style;
	if (config.backgroundopacity === 1) {
		cellStyle.backgroundColor = config.backgroundcolor;
	}
	
	var bitmap = document.createElement('canvas');
	this.el.appendChild(bitmap);

	var image = new Image();
	image.onload = onComplete;
	image.src = url;
	
	function onComplete() {

		var wid = image.width;
		var hei = image.height;
			
		var cropTop = 0;
		var cropLeft = 0;
		
		// calculate the image size, ratio values
		if (config.fixedsize) {
			newWidth = Math.round(config.coverwidth);
			newHeight = Math.round(config.coverheight);
			var off = _.getCropOffsets(wid, hei, newWidth, newHeight);
			cropLeft = Math.round(off.left);
			cropTop = Math.round(off.top);
		} else {
			var fit = _.getResizeDimensions(wid, hei, config.coverwidth, config.coverheight);
			newWidth = Math.round(fit.width);
			newHeight = Math.round(fit.height);
		}
		
		_this.width = newWidth;
		_this.height = newHeight;
		_this.halfHeight = newHeight;
		
		cellStyle.top = -(newHeight * 0.5) + 'px';
		cellStyle.left = -(newWidth * 0.5) + 'px';
		cellStyle.width = newWidth + 'px';
		cellStyle.height = newHeight + 'px';

		bitmap.width = newWidth;
		bitmap.height = newHeight * 2;
		var ctx = bitmap.getContext('2d');
		ctx.drawImage(image, cropLeft, cropTop, wid-2*cropLeft, hei-2*cropTop, 0, 0, newWidth, newHeight);

		if (config.reflectionopacity > 0) {
			cellStyle.height = (newHeight * 2) + 'px';
			Cover.reflect(bitmap, newWidth, newHeight, config.reflectionopacity, config.reflectionratio, config.reflectionoffset);
		}
	
		flow.itemComplete(newHeight);
	}
	
	this.setY = function(maxCoverHeight) {
		var offsetY = maxCoverHeight * 0.5 - (maxCoverHeight - newHeight);
		this.el.style.top = -offsetY + 'px';
	};
};

Cover.getClassName = function() {
	return 'coverflow-cell';
};

Cover.reflect = function(bitmap, wid, hei, reflectOpacity, reflectRatio, reflectOffset) {

	var ctx = bitmap.getContext('2d');
	ctx.save();
	ctx.scale(1, -1);
	ctx.drawImage(bitmap, 0, -hei*2 - reflectOffset);
	ctx.restore();
	ctx.globalCompositeOperation = 'destination-out';

	var gradient = ctx.createLinearGradient(0, 0, 0, hei);
	gradient.addColorStop(reflectRatio/255, 'rgba(255, 255, 255, 1.0)');
	gradient.addColorStop(0, 'rgba(255, 255, 255, ' + (1 - reflectOpacity) + ')');
	ctx.translate(0, hei + reflectOffset);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, wid, hei);
};
;
var CoverFlow = function(div, playlist, config) {
	var _this = this;

	this.config = config;
	
	var coversLength = playlist.length;
	var completeLength = 0;
	var maxCoverHeight = 0;
	var current = 0;

	this.events = {
		focus: new Signal(),
		click: new Signal()
	};

	this.covers = [];
	this.transforms = [];
	this.hits = [];
	this.transforms2 = [];
	this.prevF = -1;
	this.transformProp = Modernizr.prefixed('transform');
	this.space = config.coveroffset + config.covergap;
	this._angle = 'rotateY(' + (-config.coverangle) + 'deg)';
	this.angle = 'rotateY(' + config.coverangle + 'deg)';

	this.offsetX = 0;
	this.offsetY = 0;
	
	this.el = document.createElement('div');
	this.el.className = 'coverflow-wrap';
	this.tray = document.createElement('div');
	this.tray.className = 'coverflow-tray';
	this.el.appendChild(this.tray);
	this.rect = document.createElement('div');
	this.rect.className = 'coverflow-rect';
	this.el.appendChild(this.rect);
	
	this.el.style[Modernizr.prefixed('perspective')] = config.focallength+'px';
	this.tray.style[Modernizr.prefixed('transitionDuration')] = this.config.tweentime + 's';
	
	var controller = new Controller(this, this.tray, this.config);

	var cover = null;
	var hit = null;
	for (var i = 0; i < coversLength; i++) {
		
		cover = new Cover(_this, i, playlist[i].image, config);
		this.tray.appendChild(cover.el);
		cover.el.style[Modernizr.prefixed('transitionDuration')] = this.config.tweentime + 's';
		this.covers[i] = cover;

		hit = new Hit(_this, i, config);
		this.rect.appendChild(hit.el);
		this.hits[i] = hit;
	}

	div.addEventListener('touchstart', controller, true);
	div.addEventListener('keydown', keyboard, false);
	this.rect.addEventListener('mousedown', clickHandler, false);


	this.itemComplete = function(h) {
		maxCoverHeight = maxCoverHeight < h ? h : maxCoverHeight;
		completeLength += 1;
		if (completeLength == coversLength) {
			for (var i = 0; i < coversLength; i++) {
				var cover = this.covers[i];
				cover.setY(maxCoverHeight);
				this.hits[i].resize(cover.width, cover.height);
				this.hits[i].setY(maxCoverHeight);
			}
		}
	};

	this.left = function() {
		if (current > 0) _this.to(current - 1);
	};
		
	this.right = function() {
		if (current < coversLength - 1) _this.to(current + 1);
	};
	
	this.prev = function() {
		if (current > 0) _this.to(current - 1);
		else _this.to(coversLength - 1);
	};
	
	this.next = function() {
		if (current < coversLength - 1) _this.to(current + 1);
		else _this.to(0);
	};
	
	this.to = function(index) {

		var match;
		if (typeof index === 'string' && (match = /^([+-])=(\d)/.exec(index))) {
			index = (match[1] + 1) * match[2] + current;
		}

		if (index > coversLength - 1) index = coversLength - 1;
		else if (index < 0) index = 0;
					
		current = index;
		controller.to(index);
	};

	this.on = function(e, fn) {
		this.events[e].on(fn);
	};
	
	this.destroy = function() {
		div.removeChild(_this.el);

		div.removeEventListener('touchstart', controller, true);
		div.removeEventListener('keydown', keyboard, false);
	};

	this.resize = function() {
		this.offsetX = config.width * 0.5 + config.x;
		this.offsetY = config.height * 0.5 + config.y;
		this.setTrayStyle((controller.currentX + this.offsetX), this.offsetY);
		this.setRectStyle((controller.currentX + this.offsetX), this.offsetY);
	};
	
	function clickHandler(e) {
		if (e.button === 0) {
			e.stopImmediatePropagation();
			e.preventDefault();

			var hit = _this.hits[_.getChildIndex(e.target)];
			if (hit.index == current) {
				_this.events.click.trigger(hit.index);
			} else {
				_this.to(hit.index);
			}
		}
	}

	function keyboard(e) {
		var element = e.target;
		if (element.tagName == 'INPUT' ||
			element.tagName == 'SELECT' ||
			element.tagName == 'TEXTAREA') return;

		if ([37, 39, 38, 40, 32].indexOf(e.keyCode) !== -1) {
			e.preventDefault();
			switch (e.keyCode) {
			case 37:
				_this.left();
				break;
			case 39:
				_this.right();
				break;
			case 38:
				_this.to(0);
				break;
			case 40:
				_this.to(coversLength - 1);
				break;
			case 32:
				_this.events.click.trigger(current);
				break;
			}
		}
	}
};

CoverFlow.prototype.updateTouchEnd = function(controller) {
	var i = this.getFocusedCover(controller.currentX);
	controller.currentX = -i * this.config.covergap;
	this.update(controller.currentX);
};

CoverFlow.prototype.getFocusedCover = function(currentX) {
	var i = -Math.round(currentX / this.config.covergap);
	return Math.min(Math.max(i, 0), this.covers.length - 1);
};

CoverFlow.prototype.getFocusedCoverOne = function(currentX) {
	var i = -Math.round(currentX / this.config.covergap);
	return Math.min(Math.max(i, -1), this.covers.length);
};

CoverFlow.prototype.tap = function(e, currentX) {
	if (e.target.className == 'coverflow-hit') {
		var current = this.getFocusedCover(currentX);
		var hit = this.hits[_.getChildIndex(e.target)];
		if (hit.index == current) {
			this.events.click.trigger(hit.index);
		} else {
			this.to(hit.index);
		}
	}
};

CoverFlow.prototype.setTrayStyle = function(x, y) {
	this.tray.style[this.transformProp] = 'translate3d(' + x + 'px, ' + y + 'px, -' + this.config.coverdepth + 'px)';
};

CoverFlow.prototype.setRectStyle = function(x, y) {
	this.rect.style[this.transformProp] = 'translate3d(' + x + 'px, ' + y + 'px, -' + this.config.coverdepth + 'px)';
};

CoverFlow.prototype.setHitStyle = function(hit, i, transform) {
	if (this.transforms2[i] != transform) {
		hit.el.style[this.transformProp] = transform;
		this.transforms2[i] = transform;
	}
};

CoverFlow.prototype.setCoverStyle = function(cover, i, transform) {
	if (this.transforms[i] != transform) {
		cover.el.style[this.transformProp] = transform;
		this.transforms[i] = transform;
	}
};

CoverFlow.prototype.getCoverTransform = function(f, i) {
	var x = i * this.config.covergap;
	if (f == i) {
		return 'translate3d(' + x + 'px, 0, ' + this.config.coverdepth + 'px)';
	} else if (i > f) {
		return 'translate3d(' + (x + this.space) + 'px, 0, 0) ' + this._angle;
	} else {
		return 'translate3d(' + (x - this.space) + 'px, 0, 0) ' + this.angle;
	}
};

CoverFlow.prototype.update = function(currentX) {

	var f = this.getFocusedCoverOne(currentX);
	if (f != this.prevF) {
		this.events.focus.trigger(f);
		this.prevF = f;
	}

	this.setRectStyle((currentX + this.offsetX), this.offsetY);
	this.setTrayStyle((currentX + this.offsetX), this.offsetY);
	for (var i = 0; i < this.covers.length; i++) {
		this.setHitStyle(this.hits[i], i, this.getCoverTransform(f, i));
		this.setCoverStyle(this.covers[i], i, this.getCoverTransform(f, i));
	}
};
;
var Flash = function(api) {

	var swf;

	function setup() {

		var html = '<object id="' + api.id + '-coverflow-flash" data="' + api.config.flash + '" width="100%" height="100%" type="application/x-shockwave-flash">' +
			'<param name="movie" value="' + api.config.flash + '" />' +
			'<param name="wmode" value="' + api.config.wmode + '" />' +
			'<param name="allowscriptaccess" value="always" />' +
			'<param name="flashvars" value="' + jsonToFlashvars(api.config) + '" />' +
			'<a href="http://get.adobe.com/flashplayer/">Get Adobe Flash player</a>' +
		'</object>';
		api.el.innerHTML = html;
		
		swf = document.getElementById(api.id + '-coverflow-flash');
	}

	function jsonToFlashvars(json) {
		var flashvars = '';
		for (var key in json) {
			if (typeof(json[key]) === 'object') {
				flashvars += key + '=' + encodeURIComponent('[[JSON]]' + JSON.stringify(json[key])) + '&';
			} else {
				flashvars += key + '=' + encodeURIComponent(json[key]) + '&';
			}
		}
		return flashvars.slice(0, -1);
	}

	this.resize = function(wid, hei) {
		swf.apiResize(wid, hei);
	};

	this.left = function() {
		swf.apiLeft();
	};
	this.right = function() {
		swf.apiRight();
	};
	this.prev = function() {
		swf.apiPrev();
	};
	this.next = function() {
		swf.apiNext();
	};
	this.to = function(index) {
		swf.apiTo(index);
	};
	this.destroy = function() {
	};

	setup();
};
;
var Hit = function(flow, index, config) {
	
	this.index = index;
	
	this.el = document.createElement('div');
	this.el.className = Hit.getClassName();

	this.resize(config.coverwidth, config.coverheight);

	this.setY = function(maxCoverHeight) {
		var offsetY = maxCoverHeight * 0.5 - (maxCoverHeight - this.height);
		this.el.style.top = -offsetY + 'px';
	};
};

Hit.prototype.resize = function(wid, hei) {

	this.height = hei;

	_.css(this.el, {
		backgroundColor: '#00ff00',
		width: wid,
		height: hei,
		top: -hei * 0.5,
		left: -wid * 0.5
	});
};

Hit.getClassName = function() {
	return 'coverflow-hit';
};
;
var Html5 = function(api) {

	var _this = this;

	var div = api.el;
	var config = api.config;
	var playlist;
	var coverFlow;
	var textField;

	var rotateInterval;

	function setup() {
		
		var styleElement = document.createElement('style');
		styleElement.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(styleElement);
		styleElement.appendChild(document.createTextNode(config.textstyle));

		var rgb = _.hexToRgb(config.backgroundcolor);
		config.backgroundcolor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + config.backgroundopacity + ')';
		div.style.backgroundColor = config.backgroundcolor;

		if (config.gradientcolor !== undefined) {
			rgb = _.hexToRgb(config.gradientcolor);
			config.gradientcolor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + config.backgroundopacity + ')';
			div.style.background = '-webkit-gradient(linear, left top, left bottom, from(' + config.gradientcolor + '), to(' + config.backgroundcolor + '))';
		}

		api.trigger('ready');
		
		api.events.playlist.on(playlistLoaded);
		var loader = new PlaylistLoader(api);
		loader.load(api.config.playlist);
	}

	function playlistLoaded(p) {
		playlist = p;
		
		config.coverheight = config.coverheight == 'auto' ? config.height : config.coverheight;
		
		if (coverFlow) coverFlow.destroy();
		coverFlow = new CoverFlow(div, playlist, config);
		div.appendChild(coverFlow.el);

		if (textField) div.removeChild(textField);
		if (config.showtext === true) {
			textField = document.createElement('div');
			_.addClass(textField, 'coverflow-text');
			div.appendChild(textField);
		}

		coverFlow.on('focus', coverFocus);
		coverFlow.on('click', coverClick);
		coverFlow.to(config.item);

		_this.resize(config.width, config.height);

		if (config.rotatedelay > 0) {
			if (rotateInterval) _this.stopRotation();
			rotateInterval = setInterval(rotateHandler, config.rotatedelay);
			div.addEventListener('touchstart', _this.stopRotation, false);
			div.addEventListener('mousedown', _this.stopRotation, false);
		}

		if (config.mousewheel) {
			div.addEventListener('mousewheel', scrollOnMousewheel);
			div.addEventListener('DOMMouseScroll', scrollOnMousewheel);
		}
	}

	function scrollOnMousewheel(e) {
		e.preventDefault();
		
		var delta = e.detail ? e.detail * (-120) : e.wheelDelta;
		var count = Math.ceil(Math.abs(delta) / 120);
		if (count > 0) {
			var sign = Math.abs(delta) / delta;
			var func = null;
			if (sign > 0) func = _this.left;
			else if (sign < 0) func = _this.right;
			if (typeof func === 'function') {
				for (var i = 0; i < count; i++) func();
			}
		}
	}

	function coverFocus(index) {
		if (config.showtext === true) {
			var d = playlist[index];
			if (d) {
				textField.innerHTML = '<h1>' + (d.title === undefined ? '' : d.title) + '</h1><h2>' + (d.description === undefined ? '' : d.description) + '</h2>';
			}
		}

		api.trigger('focus', index, playlist[index] ? playlist[index].link : undefined);
	}

	function coverClick(index) {
		if (config.rotatedelay > 0 && rotateInterval) { _this.stopRotation(); }
		
		api.trigger('click', index, playlist[index] ? playlist[index].link : undefined);
	}

	this.stopRotation = function() {
		div.removeEventListener('touchstart', _this.stopRotation, false);
		div.removeEventListener('mousedown', _this.stopRotation, false);
		clearInterval(rotateInterval);
	};
		
	function rotateHandler() {
		coverFlow.next();
	}

	this.resize = function(wid, hei) {

		if (coverFlow) {
			coverFlow.resize(wid, hei);
		}

		if (textField) {
			textField.style.top = (hei - config.textoffset) + 'px';
		}
	};

	this.left = function() {
		coverFlow.left();
	};
	this.right = function() {
		coverFlow.right();
	};
	this.prev = function() {
		coverFlow.prev();
	};
	this.next = function() {
		coverFlow.next();
	};
	this.to = function(index) {
		coverFlow.to(index);
	};
	this.destroy = function() {
		if (coverFlow) coverFlow.destroy();
	};

	setup();
};
;/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms3d-csstransitions-canvas-canvastext-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},p.canvastext=function(){return!!e.canvas&&!!A(b.createElement("canvas").getContext("2d").fillText,"function")},p.csstransforms3d=function(){var a=!!E("perspective");return a&&"webkitPerspective"in f.style&&v("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},p.csstransitions=function(){return E("transition")};for(var F in p)x(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e.prefixed=function(a,b,c){return b?E(a,b,c):E(a,"pfx")},e}(this,this.document);
;

var PlaylistLoader = function(api) {

	var config = api.config;

	this.load = function(p) {
		if (typeof p === 'string') {
			if (p.indexOf('callback=?') !== -1) {
				_.jsonp(p, jsonpLoaded);
			} else {
				_.ajax(p, ajaxLoaded);
			}
		} else if (typeof p === 'object') {
			api.events.playlist.trigger(p);
			api.events.playlist.off();
		}
	};

	function jsonpLoaded(json) {

		var playlist = [];
		if (config.hasOwnProperty('route')) {
			if (config.route.hasOwnProperty('playlist')) {
				json = json[config.route.playlist];
			}

			for (var i = 0; i < json.length; i++) {
				playlist[i] = {
					image: findJsonValue(json[i], 'image'),
					title: findJsonValue(json[i], 'title'),
					description: findJsonValue(json[i], 'description'),
					link: findJsonValue(json[i], 'link'),
					duration: findJsonValue(json[i], 'duration')
				};
			}
		}

		api.events.playlist.trigger(playlist);
		api.events.playlist.off();
	}

	function findJsonValue(obj, type) {
		if (config.route.hasOwnProperty(type)) {
			var value = obj;
			var keys = config.route[type].split('.');
			for (var i = 0; i < keys.length; i++) {
				value = value[keys[i]];
			}
			return value;
		} else {
			return obj[type];
		}
	}
	
	function ajaxLoaded(xmlhttp) {
		var playlist = JSON.parse(xmlhttp.responseText);
		api.events.playlist.trigger(playlist);
		api.events.playlist.off();
	}
};
;
var Signal = function() {
	var callbacks = [];

	this.on = function(func) {
		callbacks.push(func);
		return this;
	};

	this.trigger = function() {
		var args = Array.prototype.slice.call(arguments);
		for (var i = 0; i < callbacks.length; i++) {
			if (typeof callbacks[i] === 'function') {
				callbacks[i].apply(this, args);
			}
		}
		return this;
	};

	this.off = function(func) {
		if (func) {
			for (var i = 0; i < callbacks.length; i++) {
				if (callbacks[i] === func) {
					callbacks.splice(i, 1);
					i--;
				}
			}
		} else {
			callbacks = [];
		}
		return this;
	};
};
