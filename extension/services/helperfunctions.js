const jwt = require("jsonwebtoken");
const request = require("request");

const bearerPrefix = "Bearer ";

const verify_and_decode = (header, secret) => {
	if(header.startsWith(bearerPrefix)){
		try{
			let token = header.substring(bearerPrefix.length);
			res = jwt.verify(token, secret, {algorithms: ['HS256']});
			return res;
		}
		catch(err){
			console.log("crashing: " + err);
		}
	}
};

const encode_message = (body, channelId, clientId, secret, ownerId) => {
	const payload = {
		exp: Math.floor(Date.now() / 1000) + 30,
		channel_id: channelId,
		user_id: ownerId, // extension owner ID for the call to Twitch PubSub
		role: 'external',
		pubsub_perms: {
			send: ['*'],
		},
	};

	token = jwt.sign(payload, secret, { algorithm: 'HS256' });

	// Set the HTTP headers required by the Twitch API.
	const headers = {
		'Client-ID': clientId,
		'Content-Type': 'application/json',
		'Authorization': bearerPrefix + token,
	};

	// Send the broadcast request to the Twitch API.
	request(
		`https://api.twitch.tv/extensions/message/${channelId}`,
		{
			method: 'POST',
			headers,
			body,
		}
		, (err, res) => {
			if (err) {
				console.log(STRINGS.messageSendError, channelId, err);
			}
		}
	);
};

module.exports = {verify_and_decode, encode_message};