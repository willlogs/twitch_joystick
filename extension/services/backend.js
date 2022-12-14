const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const ext = require('commander');

const {verify_and_decode, encode_message} = require(__dirname + "/helperfunctions");

const app = express();
const port = 8081;

let color = "#666666";

ext.
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

// serve the public folder
app.use(express.static(__dirname + '/../public/'));

// start the server
app.listen(port, () => {
  console.log("server started listening");
});