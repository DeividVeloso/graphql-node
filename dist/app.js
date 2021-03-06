"use strict";
exports.__esModule = true;
var express = require("express");
var graphqlHTTP = require("express-graphql");
var schema_1 = require("./graphql/schema");
var models_1 = require("./models");
var extract_jwt_middleware_1 = require("./middlewares/extract-jwt.middleware");
var DataLoaderFactory_1 = require("./graphql/dataloaders/DataLoaderFactory");
var RequestedFields_1 = require("./graphql/ast/RequestedFields");
var cors = require("cors");
var compression = require("compression");
var helmet = require("helmet");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.init();
    }
    App.prototype.init = function () {
        this.requestedFields = new RequestedFields_1.RequestedFields();
        this.dataLoaderFactory = new DataLoaderFactory_1.DataLoaderFactory(models_1["default"], this.requestedFields);
        this.middleware();
    };
    App.prototype.middleware = function () {
        var _this = this;
        this.express.use(cors({
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
            preflightContinue: false,
            optionsSuccessStatus: 204
        }));
        this.express.use(compression());
        this.express.use(helmet());
        this.express.use("/graphql", extract_jwt_middleware_1.extractJwtMiddleware(), function (req, res, next) {
            req["context"]["db"] = models_1["default"];
            req["context"]["dataloaders"] = _this.dataLoaderFactory.getLoaders();
            req["context"]["requestedFields"] = _this.requestedFields;
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
