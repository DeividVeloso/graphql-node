"use strict";
exports.__esModule = true;
var userTypes = "\n    # User definition types\n    type User {\n        id: ID!\n        name: String!\n        email: String!\n        photo: String!\n        createdAt: String!\n        updatedAt: String!\n        posts(first: Int, offset: Int): [Post!]!\n    }\n\n    input UserCreateInput {\n        name: String!\n        email: String!\n        password: String!\n    }\n\n    input UserUpdateInput {\n        name: String!\n        email: String!\n        photo: String!\n    }\n    \n    input UserUpdatePasswordInput {\n        password: String!\n    }\n";
exports.userTypes = userTypes;
var userQueries = "\n    users(first: Int, offset: Int): [User!]!\n    user(id: ID!): User\n    currentUser: User\n";
exports.userQueries = userQueries;
var userMutations = "\n    createUser(input: UserCreateInput!): User\n    updateUser(input: UserUpdateInput!): User\n    updateUserPassword(input: UserUpdatePasswordInput!): Boolean\n    deleteUser: Boolean\n";
exports.userMutations = userMutations;
