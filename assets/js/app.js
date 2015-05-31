
(function(window, document) {
	
	'use strict';
	
	var dirContainer;
	var buttonContainer;
	var fullScreen = false;
	var dirButtonList = {
		left   : {
			key : 'left_arrow',
			condition : 'release',
			active : false,
		},
		top    : {
			key : 'up_arrow',
			condition : 'release',
			active : false
		},
		right  : {
			key : 'right_arrow',
			condition : 'release',
			active : false
		},
		bottom : {
			key : 'down_arrow',
			condition : 'release',
			active : false
		}
	};
	var buttonList = {
		square   : {
			key : 'esc',
			condition : 'release',
			active : false
		},
		triangle : {
			key : 'ctrl',
			condition : 'release',
			active : false
		},
		circle   : {
			key : 'alt',
			condition : 'release',
			active : false
		},
		x        : {
			key : 'enter',
			condition : 'release',
			active : false
		}
	};
	
	function setContainerDimensions() {
		var h = dirContainer.height();
		dirContainer.width(h);
		h = buttonContainer.height();
		buttonContainer.width(h);
	}
	
	function setEventHandlers() {
		for(var key in dirButtonList) {
			var button = key;
			$('.button.' + button).mousedown(onTap);
			$('.button.' + button).mouseup(onTap);
			$('.button.' + button).tapstart(onTap);
			$('.button.' + button).tapend(onTap);
		}
		for(var key in buttonList) {
			var button = key;
			$('.button.' + button).mousedown(onTap);
			$('.button.' + button).mouseup(onTap);
			$('.button.' + button).tapstart(onTap);
			$('.button.' + button).tapend(onTap);
		}
	}
	
	function onTap(e) {
		toggleFullScreen();
		var button = $(this).data('key');
		var success = false;
		for(var key in dirButtonList) {
			if(key === button) {
				success = true;
			}
		}
		var data;
		if(success) {
			data = dirButtonList[button];
		} else {
			data = buttonList[button];
		}
		if(data.condition === 'release') {
			$(this).addClass('active');
			data.condition = 'press';
			if(button === 'x') {
				console.log(buttonList[button].active);
				if(buttonList[button].active) {
					buttonList[button].active = false;
					data.condition = 'release';
				} else {
					console.log(buttonList[button]);
					data.condition = 'press';
					buttonList[button].condition = 'press'
					buttonList[button].active = true;
				}
			}
		} else {
			if(button !== 'x') {
				$(this).removeClass('active');
				data.condition = 'release';
			} else {
				data.condition = 'release';
				$(this).removeClass('active');
					buttonList[button].condition = 'release'
					buttonList[button].active = true;
			}
		}
		var start = window.performance.now();
		sendData(data, function() {
			vibrate(button);
			var end = window.performance.now();
			console.log('---------------------');
			console.log(end - start);
			console.log(data);
			console.log('---------------------');
		});
		
		e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
	}
	
	function vibrate(key) {
		key = key || '';
		var time = 20;
		if(key === 'triangle' || key === 'square') {
			time = 50;
		} else if(key === 'x' || key === 'circle') {
			time = 35;
		}
		navigator.vibrate(time);
	}
	
	function sendData(data, cb) {
		$.ajax({
			method : 'post',
			data : {
				key : data.key,
				condition : data.condition
			},
			url : '/keypress',
			success : function() {
				cb();
			}
		});
	}
	
	window.toggleFullScreen = function() {
		if(!fullScreen) {
			var doc = window.document;
			var docEl = doc.documentElement;

			var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
			var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

			if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
				requestFullScreen.call(docEl);
				fullScreen = true;
			}
			else {
			cancelFullScreen.call(doc);
			}
		}
	}
	
	function init() {
		FastClick.attach(document.body);
		dirContainer = $('.directional-container');
		buttonContainer = $('.button-container');
		$(window).resize(setContainerDimensions);
		setContainerDimensions();
		setEventHandlers();
	}
	
	$(document).ready(init);
	
})(window, document);