var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var width = Math.min(320, window.innerWidth);    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

var streaming = false;

video.addEventListener('canplay', function(ev){
	if (!streaming) {
		height = video.videoHeight / (video.videoWidth/width);
	
		video.setAttribute('width', width);
		video.setAttribute('height', height);
		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);
		streaming = true;
	}
}, false);

function snapshot() {
	setTimeout(function() {
		if (localMediaStream) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			// "image/webp" works in Chrome.
			// Other browsers will fall back to image/png.
			socket.emit('image', { data: canvas.toDataURL('image/webp') })
			snapshot();
		}
	}, connected * 2000);
}

var imageData = [];
socket.on('new image', function(msg) {
	imageData.push(msg.data);
});

var connected = 1;
socket.on('people', function(msg) {
	connected = msg.num;
});

function incrementSlideshow() {
	var base64Data = imageData.shift();
	setTimeout(function() {
		if (base64Data) $('#imageHolder').css('background-image', 'url(' + base64Data + ')');
		incrementSlideshow();
	}, 2000);
};
incrementSlideshow();

video.addEventListener('click', snapshot, false);

navigator.mediaDevices.getUserMedia({video: true})
.then(function(mediaStream) {
	video.srcObject = mediaStream;
	localMediaStream = mediaStream;
	snapshot();
	video.onloadedmetadata = function(e) {
		video.play();
	};
})
.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
