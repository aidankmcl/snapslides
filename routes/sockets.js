
module.exports = function(io) {
	var num = 0;
	var total = 0;
	io.on('connection', function(socket){
		num += 1; total += 1;
		console.log('a user connected, ' + num + ' here! Total: ' + total);
		socket.broadcast.emit('people', {num: num});

		socket.on('image', function(msg) {
			io.emit('new image', msg);
		});

		socket.on('disconnect', function(){
	    num -= 1;
	    console.log('user disconnected, ' + num + ' left');
	    socket.broadcast.emit('people', {num: num});
	  });
	});
};
