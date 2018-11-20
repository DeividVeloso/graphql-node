"use strict";
exports.__esModule = true;
var postTypes = "\n    type Post {\n        id: ID!\n        title: String!\n        content: String!\n        photo: String!\n        createAt: String!\n        updateAt: String!\n        author: User!\n        comments(first: Int, offset: Int): [ Comment! ]!\n    }\n\n    input PostInput {\n        title: String!\n        content: String!\n        photo: String!\n    }\n";
exports.postTypes = postTypes;
var postQueries = "\n    posts(first: Int, offset: Int): [Post!]!\n    post(id: ID!): Post\n";
exports.postQueries = postQueries;
var postMutations = "\n    createPost(input: PostInput!): Post\n    updatePost(id: ID!, input: PostInput!): Post\n    deletePost(id: ID!): Boolean\n";
exports.postMutations = postMutations;
