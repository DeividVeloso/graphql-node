"use strict";
exports.__esModule = true;
exports.normalizePort = function (val) {
    var port = typeof val === "string" ? parseInt(val) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
};
exports.onError = function (server) {
    return function (error) {
        var port = server.address().toString();
        if (error.syscall !== "listen")
            throw error;
        var bind = typeof port === "string" ? "pipe " + port : "port " + port;
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
};
exports.onListening = function (server) {
    return function () {
        var addr = server.address();
        var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        console.log("Listening at " + bind + "...");
    };
};
