var token = "";
var tuid = "";
var ebs = "";

// because who wants to type this every time?
var twitch = window.Twitch.ext;
var io = window.io;
var socket = io.connect('http://216.250.122.82/server');
var id = "";
var token = "";
var userId = "";
var channelId = "";

twitch.onAuthorized((auth) => {
  token = auth.token;
  userId = auth.userId;
  channelId = auth.channelId;
  console.log("auth done");
});

socket.on("message", (socket) => {
    console.log("msg rec: " + socket.data);
});

socket.on("id", (payload) => {
    id = payload.id;
    console.log("received id : " + id);
    socket.emit("join", {channel_id: channelId});
});

$(function() {
    $('#attack_btn').click(function() {
        socket.emit("attack", {id: id});
    });
});
