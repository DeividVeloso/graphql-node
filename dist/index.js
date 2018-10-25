"use strict";
exports.__esModule = true;
var http = require("http");
var app_1 = require("./app");
var server = http.createServer(app_1["default"]);
server.listen(3000);
server.on("listening", function () { return console.log("Listening on port 3000"); });
