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
				prev : { },
				x: [-2.5, 1.0],
				y: [-1.25, 1.25],
				width: 800,
				height: 600
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
			drawSlowBtn = document.getElementById('draw-slow'),
			goBackBtn = document.getElementById('go-back'),
			downloadBtn = document.getElementById('download'),
			isMoving = false,
			isResizing = false,
			x0, y0,
			clientX0, clientY0, top0, left0;

		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		rect = document.getElementById('rect');
		downloadAnchor = document.getElementById('download-anchor');

		rect.addEventListener('mousedown', function (event) {
			var rectClientRect = rect.getBoundingClientRect();

			x0 = event.pageX;
			y0 = event.pageY;
			top0 = rectClientRect.top;
			left0 = rectClientRect.left;
			isMoving = true;
		});

		canvas.addEventListener('mousedown', function (event) {
			return startResizeDrag(event.clientX, event.clientY);
		});
		canvas.addEventListener('mousemove', mouseChangeRect);
		rect.addEventListener('mousemove', mouseChangeRect);
		document.addEventListener('mouseup' , stopChangeRect);

		drawFastBtn.onclick = function() { 
			setRectConfig();
			getMandelbrot(); 
		};
		drawSlowBtn.onclick = function() { 
			setRectConfig();
			getMandelbrotSlow();
		};
		resetFractalBtn.onclick = function() {
			reset();
			getMandelbrot();
		};
		fullscreenBtn.addEventListener('click', requestFullScreen);
		goBackBtn.onclick = function () { goBack(); };
		downloadBtn.onclick = downloadImage;

		function startResizeDrag (clientX, clientY) {
			var rectClientRect = rect.getBoundingClientRect();

			console.debug('StartResizeDrag');
			clientX0 = clientX;
			clientY0 = clientY;
			rect.style.left = clientX0 + 'px';
			rect.style.top = clientY0 + 'px';
			rect.style.width = rect.style.height = 1;
			config.heightWidthRatio = config.height / config.width; 
			isResizing = true;
		}

		function changeRect (pageX, clientX, clientY) {
			var width = pageX - clientX0;

			if (isMoving) {
				rect.style.top = top0 + clientY - y0 + 'px';
				rect.style.left = left0 + clientX - x0 + 'px';
			}
			else if (isResizing) {
				rect.style.width = width + 'px';
				rect.style.height = width * config.heightWidthRatio + 'px';
			}
		}

		function mouseChangeRect (event) {
			changeRect(event.pageX, event.clientX, event.clientY);
		}

		function stopChangeRect () {
			if (isMoving) {
				isMoving = false;
			}
			if (isResizing) {
				isResizing = false;
			}
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
		config.x = [-2.5, 1.0];
		config.y = [-1.25, 1.25];
		config.width = 800;
		config.height = 600;
	}

	function getRectCoords() {
		var rectClientRect = rect.getBoundingClientRect();
		var canvasClientRect = canvas.getBoundingClientRect();
		var xOff = rectClientRect.left - canvasClientRect.left;
		var yOff = rectClientRect.top - canvasClientRect.top;
		var dx = (config.x[1] / config.width)	-	(config.x[0]	/ config.width) ;
		var dy = (config.y[1] / config.height)	-	(config.y[0]	/ config.height) ;
		var x = [null, null];
		var y = [null, null];

		x[0] = config.x[0] + xOff*dx ;
		x[1] = x[0] + rectClientRect.width*dx ;

		y[0] = config.y[0] + yOff*dy ;
		y[1] = y[0] + rectClientRect.height*dx ;


		console.debug(config);
		console.debug([x,y].map(function(coords) {
			return coords.map(function(k){return k.toExponential(2);}).join(', ');
		}).join('\t'));
		
		return {
			x : x,
			y : y
		}

	}

	function buildImage(data) {
		var bytes = new Uint8Array(data.buffer);
		var image = context.createImageData(canvas.width, canvas.height);
		for ( var i=0; i<bytes.length; ++i ) {
			image.data[i] = bytes[i];
		}
		context.putImageData(image, 0, 0);
		reportStats(data);
		pacman.style.display='none';
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
	}
			 
	function getMandelbrot () {
		console.log('generating Mandelbrot Set');
		pacman.style.display='block';
		t=now();
		hWorker.trigger('mandelbrot', config);
	}


	function getMandelbrotSlow () {
		console.log('generating Mandelbrot set (in ui thread)');
		pacman.style.display='block';
		t=now();
		var data = mandelbrot(config);
		buildImage(data);
	}

	function reportStats (data) {
		var deltaT = (now() - t) / 1000;
		var calculations = 19*data.iterations; // calcs per iteration * iteration counter
		console.log('built bit map in '+deltaT.toFixed(2)+'s');
		console.log('Iteration Count: '+data.iterations.toExponential());
		console.log('Number of calculations estimate: '+calculations.toExponential());
		console.log('calculations/second ratio: '+(calculations/deltaT).toExponential());
		console.log('\n\n');
	}
		
});
