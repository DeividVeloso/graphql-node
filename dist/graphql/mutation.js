"use strict";
exports.__esModule = true;
var user_schema_1 = require("./resources/user/user.schema");
var post_schema_1 = require("./resources/post/post.schema");
var comment_schema_1 = require("./resources/comment/comment.schema");
var token_schema_1 = require("./resources/token/token.schema");
var Mutation = "\n    type Mutation {\n        " + user_schema_1.userMutations + "\n        " + post_schema_1.postMutations + "\n        " + comment_schema_1.commentMutations + "\n        " + token_schema_1.tokenMutations + "\n    }\n";
exports.Mutation = Mutation;
