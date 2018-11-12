"use strict";
exports.__esModule = true;
var user_schema_1 = require("./resources/user/user.schema");
var post_schema_1 = require("./resources/post/post.schema");
var comment_schema_1 = require("./resources/comment/comment.schema");
var Query = "\n    type Query {\n        " + user_schema_1.userQueries + "\n        " + post_schema_1.postQueries + "\n        " + comment_schema_1.commentQueries + "\n    }\n";
exports.Query = Query;
