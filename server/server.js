const { Server } = require("socket.io");
const uniqid = require("uniqid");
const { Channel } = require(__dirname + "/channel");
const httpProxy = require("http-proxy");

const io = new Server(8000, {
	cors: {
		origin: '*',
	}
});

let channels = [];

io.on("connection", (socket) => {
	let id = uniqid();
	console.log("connection detected id:" + id);

	socket.id = id;
	socket.emit("id", { id });

	socket.on("join", (s) => {
		channel_id = s.channel_id;

		let flag = false;
		for (let i = 0; i < channels.length; i++) {
			console.log(channels);
			if (channels[i].id == channel_id) {
				console.log("joining channel: " + channel_id);
				flag = true;
				socket.channel_id = channel_id;
				socket.isReceiver = s.isReceiver;
				channels[i].add_member(socket);
			}
		}

		if (!flag) {
			console.log("creating channel: " + channel_id);
			c = new Channel(channel_id);
			socket.channel_id = channel_id;
			c.add_member(socket);
			channels.push(c);
		}
	});
});

httpProxy.createProxyServer({target: "http:localhost:8000", ws: true}).listen(8000);