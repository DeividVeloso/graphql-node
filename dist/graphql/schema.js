"use strict";
exports.__esModule = true;
var graphql_tools_1 = require("graphql-tools");
var query_1 = require("./query");
var mutation_1 = require("./mutation");
var user_schema_1 = require("./resources/user/user.schema");
var post_schema_1 = require("./resources/post/post.schema");
var comment_schema_1 = require("./resources/comment/comment.schema");
var token_schema_1 = require("./resources/token/token.schema");
var lodash_1 = require("lodash");
var comment_resolver_1 = require("./resources/comment/comment.resolver");
var post_resolver_1 = require("./resources/post/post.resolver");
var user_resolver_1 = require("./resources/user/user.resolver");
var token_resolver_1 = require("./resources/token/token.resolver");
var resolvers = lodash_1.merge(comment_resolver_1.commentResolvers, post_resolver_1.postResolvers, user_resolver_1.userResolver, token_resolver_1.tokenResolvers);
var SchemaDefinition = "\n  type Schema {\n    query: Query,\n    mutation: Mutation\n  }\n";
exports["default"] = graphql_tools_1.makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        query_1.Query,
        mutation_1.Mutation,
        user_schema_1.userTypes,
        post_schema_1.postTypes,
        comment_schema_1.commentTypes,
        token_schema_1.tokenTypes
    ],
    resolvers: resolvers
});
