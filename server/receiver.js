const iocli = require("socket.io-client");
const uniqid = require("uniqid");
const { Channel } = require("./channel");

let channel_id = 837106469;
let id = 0;

socket = iocli.connect("216.250.122.82:8000");

socket.on("connection", (socket) => {
	console.log("connection");
})

socket.on("attack", (socket) => {
	console.log("received attack signal");
});

socket.on("id", (payload) => {
	id = payload.id;
	console.log("received id : " + id);
	socket.emit("join", { channel_id, isReceiver: true });
});