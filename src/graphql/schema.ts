import { makeExecutableSchema } from "graphql-tools";
import { Query } from "./query";
import { Mutation } from "./mutation";

import { userTypes } from "./resources/user/user.schema";
import { postTypes } from "./resources/post/post.schema";
import { commentTypes } from "./resources/comment/comment.schema";

import { merge } from "lodash";

import { commentResolvers } from "./resources/comment/comment.resolver";
import { postResolvers } from "./resources/post/post.resolver";
import { userResolver } from "./resources/user/user.resolver";

const resolvers = merge(commentResolvers, postResolvers, userResolver);

const SchemaDefinition = `
  type Schema {
    query: Query,
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Query,
    Mutation,
    userTypes,
    postTypes,
    commentTypes
  ],
  resolvers
});
