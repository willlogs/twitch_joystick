const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const ext = require('commander');

const {verify_and_decode, encode_message} = require("./helperfunctions");

const app = express();
const port = 8081;

let color = "#666666";

ext.
  version(require('../package.json').version).
  option('-s, --secret <secret>', 'Extension secret').
  option('-c, --client-id <client_id>', 'Extension client ID').
  option('-o, --owner-id <owner_id>', 'Extension owner ID').
  parse(process.argv);

function getOption(optionName, environmentName) {
  const option = (() => {
    if (ext[optionName]) {
      return ext[optionName];
    } else if (process.env[environmentName]) {
      console.log(STRINGS[optionName + 'Env']);
      return process.env[environmentName];
    }
    console.log(STRINGS[optionName + 'Missing']);
    process.exit(1);
  })();
  console.log(`Using "${option}" for ${optionName}`);
  return option;
}

const ownerId = "837106469";
const secret = Buffer.from("qO88ZOZ3qq/gU0TeuzAlFDQ/ey7ZNR0Nl3RFLjIx58Q=", 'base64');
const clientId = "d8w15tfoc06xg89atzmb4007o9m9fc";

// set up express app
// setup body-parser
app.use(bodyparser.json());

// setup cors
app.use(cors({
  origin: ['*']
}));

// add get for /color/query
app.get("/color/query", (req, res) => {
  console.log("==============query req===============")
  payload = verify_and_decode(req.headers.authorization, secret);
  console.log("cid: " + payload.channel_id);

	const currentColor = color;
	const body = JSON.stringify({
		content_type: 'application/json',
		message: currentColor,
		targets: ['broadcast'],
	});
  encode_message(body, payload.channel_id, clientId, secret, ownerId);

  res.send();
});

// add post for /color/cycle
app.post("/color/cycle", (req, res) => {
  console.log("==============cycle req===============")
  payload = verify_and_decode(req.headers.authorization, secret);
});

// serve the public folder
app.use(express.static('../public/'));

// start the server
app.listen(port, () => {
  console.log("server started listening");
});