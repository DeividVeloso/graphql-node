"use strict";
exports.__esModule = true;
var userTypes = "\n    # User definition types\n    type User {\n        id: ID!\n        name: String!\n        email: String!\n        photo: String!\n        createdAt: String!\n        updatedAt: String!\n    }\n\n    input UserCreateInput {\n        name: String!\n        email: String!\n        password: String!\n    }\n\n    input UserUpdateInput {\n        name: String!\n        email: String!\n        photo: String!\n    }\n    \n    input UserUpdatePasswordInput {\n        password: String!\n    }\n";
exports.userTypes = userTypes;
var userQueries = "\n    users(first: Int, offset: Int): [User!]!\n    user(id: ID!): User\n";
exports.userQueries = userQueries;
var userMutations = "\n    createUser(input: UserCreateInput!): User\n    updateUser(id: ID!, input: UserUpdateInput!): User\n    updatePassword(id: ID!, input: UserUpdatePasswordInput!): Boolean\n    deleteUser(id: ID!): Boolean\n";
exports.userMutations = userMutations;
