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
	if (localMediaStream) {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		// "image/webp" works in Chrome.
		// Other browsers will fall back to image/png.
		$('#imageHolder').css('background-image', 'url(' + canvas.toDataURL('image/webp') + ')');
	}
}

video.addEventListener('click', snapshot, false);

navigator.mediaDevices.getUserMedia({video: true})
.then(function(mediaStream) {
	video.srcObject = mediaStream;
	localMediaStream = mediaStream;
	setInterval(snapshot, 1000);
	video.onloadedmetadata = function(e) {
		video.play();
	};
})
.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
