define([
	'/HardWorker/HardWorker.js',
	'mandelbrot'
], function (HardWorker, mandelbrot) {

	var rect,
			hWorker,
			canvas,
			context,
			downloadAnchor,
			now = function () { return window.performance.now(); },
			t = now(),
			config = {
				prev: {},
				x: [-2.5, 1.0],
				y: [-1.25, 1.25],
				width: 800,
				height: 600,
				heightWidthRatio: null,
			};

	if (!document.readyState.match(/interactive|complete|ready/)) {
		document.addEventListener('DOMContentLoaded', main);
	} else {
		main();
	}


	function main () {
		hWorker = new HardWorker({url:'/HardWorker/mainHardWorker.js'});
		hWorker.loadScript('lib/require.js', function() {
			hWorker.loadModule({
				path: '/mandelbrot/js/mandelbrot.js',
				trigger: 'mandelbrot'
			}, buildImage, workerReady);
		});

		function workerReady() {
			window.onerror = function (e) {alert(e);};
			initUI();
			getMandelbrot();
		}
	}

	/**
	 * setup the event handlers for the selection rectangle and buttons
	 */
	function initUI () {
		var fullscreenBtn = document.getElementById('fullscreen'),
			resetFractalBtn = document.getElementById('reset'),
			drawFastBtn = document.getElementById('draw-fast'),
			goBackBtn = document.getElementById('go-back'),
			downloadBtn = document.getElementById('download'),
			showBtn = document.getElementById('show'),
			hideBtn = document.getElementById('hide'),
			buttons = document.querySelector('.buttons'),
			isMoving = false,
			isResizing = false,
			x0, y0,
			clientX0, clientY0, top0, left0;

		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		rect = document.getElementById('rect');
		downloadAnchor = document.getElementById('download-anchor');

		reset();

		// Mouse bindings
		rect.addEventListener('mousedown', function (event) {
			return rectActiveStart(event.pageX, event.pageY);
		});
		canvas.addEventListener('mousedown', function (event) {
			return startResizeDrag(event.clientX, event.clientY);
		});
		canvas.addEventListener('mousemove', mouseChangeRect);
		rect.addEventListener('mousemove', mouseChangeRect);
		document.addEventListener('mouseup' , stopChangeRect);

		// Touch bindings
		rect.addEventListener('touchstart', function (event) {
			var touch = event.touches[0];

			return rectActiveStart(touch.pageX, touch.pageY);
		});
		canvas.addEventListener('touchstart', function (event) {
			if (event.touches.length > 1) {
				isResizing = true;
			}
			else {
				isResizing = false;
			}
		});
		canvas.addEventListener('touchmove', touchChangeRect);
		rect.addEventListener('touchmove', touchChangeRect);
		document.addEventListener('touchend' , stopChangeRect);

		// Buttons
		drawFastBtn.onclick = function() {
			setRectConfig();
			getMandelbrot();
		};
		resetFractalBtn.onclick = function() {
			reset();
			getMandelbrot();
		};
		fullscreenBtn.addEventListener('click', requestFullScreen);
		goBackBtn.onclick = function () { goBack(); };
		downloadBtn.onclick = downloadImage;
		showBtn.onclick = function () {
			buttons.classList.remove('hide');
		};
		hideBtn.onclick = function () {
			buttons.classList.add('hide');
		};
		function rectActiveStart (x, y) {
			var rectClientRect = rect.getBoundingClientRect();

			x0 = x;
			y0 = y;
			top0 = rectClientRect.top + window.scrollY;
			left0 = rectClientRect.left + window.scrollX;
			isMoving = true;
		}

		function startResizeDrag (x, y) {
			var rectClientRect = rect.getBoundingClientRect();

			clientX0 = x;
			clientY0 = y;
			rect.style.left = clientX0 + 'px';
			rect.style.top = clientY0 + 'px';
			rect.style.width = rect.style.height = 1;
			isResizing = true;
		}

		function changeRect (x, y) {
			var width = x - clientX0;

			if (isMoving) {
				rect.style.top = top0 + y - y0 + 'px';
				rect.style.left = left0 + x - x0 + 'px';
			}
			else if (isResizing) {
				rect.style.width = width + 'px';
				rect.style.height = width * config.heightWidthRatio + 'px';
			}
		}

		function touchChangeRect (event) {
			var touch = event.touches[0],
				left, right, width;

			if (isResizing) {
				left = event.touches[0];
				right = event.touches[1];
				if (left.pageX > right.pageX) {
					left = event.touches[1];
					right = event.touches[0];
				}
				rect.style.left = left.pageX + 'px';
				rect.style.top = Math.min(left.pageY, right.pageY) + 'px';
				width = right.pageX - left.pageX;
				rect.style.width = width + 'px'; 
				rect.style.height = width * config.heightWidthRatio + 'px';
				event.stopPropagation();
				event.preventDefault();
				return;
			}
			if (event.touches.length > 1) {
				isResizing = true;
			}
			changeRect(touch.pageX, touch.pageY);
			if (isMoving) {
				event.stopPropagation();
				event.preventDefault();
			}
		}

		function mouseChangeRect (event) {
			changeRect(event.clientX, event.clientY);
		}

		function stopChangeRect () {
			isMoving = false;
			isResizing = false;
		}
	}

	/**
	 * With the button element as a child of the anchor tag,
	 * we capture the event first at the button,
	 * create an array buffer, set the image data, create a blob url,
	 * and lastly, set the href of the anchor tag.
	 * The event bubbles to the anchor tag and causes a download.
	 */
	function downloadImage () {
		var data = canvas.toDataURL('image/png').split(',');
		var bytes = atob( data[1] );
		var buffer = new Uint8Array(bytes.length);
		for ( var i=0; i<bytes.length; ++i ) {
			buffer[i] = bytes.charCodeAt(i);
		}
		var blob = new Blob([buffer], { type : 'image/png' });
		var objUrl = URL.createObjectURL(blob);
		downloadAnchor.href = objUrl;
	}

	function setRectConfig () {
		var rectCoords = getRectCoords();
		config.prev.x = config.x;
		config.prev.y = config.y;
		config.x = rectCoords.x;
		config.y = rectCoords.y;
	}

	function goBack () {
		config.x = config.prev.x;
		config.y = config.prev.y;
		getMandelbrot();
	}

	function reset() {
		config.x = [-3.5, 2.0];
		config.y = [-2.25, 2.25];
		config.width = window.innerWidth;
		config.height = window.innerHeight;
		config.heightWidthRatio = config.height / config.width;
		canvas.width = config.width;
		canvas.height = config.height;
		var width = Math.abs(config.x[0] - config.x[1]),
			height = width * config.heightWidthRatio,
			diff = Math.abs(config.y[0] - config.y[1]) - height;

		config.y[1] -= diff/2;
		config.y[0] += diff/2;
	}

	function getRectCoords() {
		var rectClientRect = rect.getBoundingClientRect();
		var canvasClientRect = canvas.getBoundingClientRect();
		var xOff = rectClientRect.left - canvasClientRect.left;
		var yOff = Math.abs(rectClientRect.bottom - canvasClientRect.bottom);
		var dx = (config.x[1] / config.width)	-	(config.x[0]	/ config.width); 
		var dy = (config.y[1] / config.height)	-	(config.y[0]	/ config.height);
		var x = [null, null];
		var y = [null, null];

		x[0] = config.x[0] + xOff*dx;
		x[1] = x[0] + rectClientRect.width*dx;

		y[0] = config.y[0] + yOff*dy;
		y[1] = y[0] + rectClientRect.height*dx;

		console.debug(config);
		console.debug([x,y].map(function(coords) {
			return coords.map(function(k){return k.toExponential(2);}).join(', ');
		}).join('\t'));

		return {
			x : x,
			y : y,
		}
	}

	function buildImage (data) {
		var bytes = new Uint8Array(data.buffer),
			image = context.createImageData(canvas.width, canvas.height),
			i;

		for (i=0; i<bytes.length; ++i) {
			image.data[i] = bytes[i];
		}
		context.putImageData(image, 0, 0);
		pacman.style.display = 'none';
	}

	function requestFullScreen () {
		var el = document.body;

		if (el.requestFullscreen) {
			el.requestFullscreen();
		} else if (el.msRequestFullscreen) {
			el.msRequestFullscreen();
		} else if (el.mozRequestFullScreen) {
			el.mozRequestFullScreen();
		} else if (el.webkitRequestFullscreen) {
			el.webkitRequestFullscreen();
		}
		setTimeout(function () {
			reset();
			getMandelbrot();
		}, 1000);
	}

	function getMandelbrot () {
		console.log('generating Mandelbrot Set');
		pacman.style.display='block';
		t=now();
		hWorker.trigger('mandelbrot', config);
	}

});
