"use strict";
exports.__esModule = true;
var express = require("express");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.middleware();
    }
    App.prototype.middleware = function () {
        this.express.use("/hello", function (req, res, next) {
            res.send({
                hello: "Hello World"
            });
        });
    };
    return App;
}());
exports["default"] = new App().express;
