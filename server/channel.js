const { Server } = require("socket.io");
const uniqid = require("uniqid");

class Channel{
	connections = [];
	hasReceiver = false;

	constructor(id){
		this.id = id;
	}

	broadcast(msg, id) {
		this.connections.forEach(socket => {
			if(socket.id !== id){
				socket.emit("message", { data: msg });
			}
		});
	}

	on_message(socket, payload){
		if(socket.id != undefined){
			console.log("message received:");
			console.log(payload.data);

			this.broadcast(payload.data, socket.id);
		}
	}

	on_attack(socket, payload){
		console.log("attack " + socket.id);
		if(this.hasReceiver){
			this.receiver.emit("attack", {id: socket.id});
		}
	}

	on_disconnect(socket, payload){
		let id = socket.id;

		let idx = -1;
		for(let i = 0; i < this.connections.length; i++){
			if(this.connections[i].id === id){
				idx = i;
				break;
			}
		}

		if(idx !== -1){
			this.connections = this.connections.splice(idx, 1);
		}
	}
	
	add_member(socket){
		console.log(socket.isReceiver);
		if(socket.isReceiver){
			this.receiver = socket;
			this.hasReceiver = true;
			console.log("receiver added");
		}else{
			socket.on("message", (s) => {this.on_message(socket, s);});
			socket.on("disconnect", (s) => {this.on_disconnect(socket, s);});
			socket.on("attack", (s) => {this.on_attack(socket, s);});
			this.connections.push(socket);
		}
	}
}

module.exports = {Channel};