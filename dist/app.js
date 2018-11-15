"use strict";
exports.__esModule = true;
var express = require("express");
var graphqlHTTP = require("express-graphql");
var schema_1 = require("./graphql/schema");
var models_1 = require("./models");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.middleware();
    }
    App.prototype.middleware = function () {
        this.express.use("/graphql", function (req, res, next) {
            req["context"] = {};
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
