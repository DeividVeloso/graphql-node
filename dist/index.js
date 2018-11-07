"use strict";
exports.__esModule = true;
var http = require("http");
var app_1 = require("./app");
var handlersServer_1 = require("./utils/handlersServer");
var models_1 = require("./models");
var server = http.createServer(app_1["default"]);
var port = handlersServer_1.normalizePort(process.env.PORT || 3000);
models_1["default"].sequelize.sync().then(function () {
    server.listen(port);
    server.on("error", handlersServer_1.onError(server));
    server.on("listening", handlersServer_1.onListening(server));
});
