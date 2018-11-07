"use strict";
exports.__esModule = true;
var express = require("express");
var graphqlHTTP = require("express-graphql");
var schema_1 = require("./graphql/schema");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.middleware();
    }
    App.prototype.middleware = function () {
        this.express.use("/graphql", graphqlHTTP({ schema: schema_1["default"], graphiql: process.env.NODE_ENV === "development" }));
    };
    return App;
}());
exports["default"] = new App().express;
