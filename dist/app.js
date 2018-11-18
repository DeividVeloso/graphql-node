"use strict";
exports.__esModule = true;
var express = require("express");
var graphqlHTTP = require("express-graphql");
var schema_1 = require("./graphql/schema");
var models_1 = require("./models");
var extract_jwt_middleware_1 = require("./middlewares/extract-jwt.middleware");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.middleware();
    }
    App.prototype.middleware = function () {
        this.express.use("/graphql", extract_jwt_middleware_1.extractJwtMiddleware(), function (req, res, next) {
            req["context"]["db"] = models_1["default"];
            next();
        }, graphqlHTTP(function (req) { return ({
            schema: schema_1["default"],
            graphiql: process.env.NODE_ENV === "development",
            context: req["context"]
        }); }));
    };
    return App;
}());
exports["default"] = new App().express;
