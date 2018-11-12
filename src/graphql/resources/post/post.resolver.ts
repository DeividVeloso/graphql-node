import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
export const postResolvers = {
  Query: {
    posts: (
      parent,
      { first = 10, offset = 0 },
      { db }: { db: DbConnection },
      info: GraphQLResolveInfo
    ) => {
      return db.Post.findAll({ limit: first, offset: offset });
    },
    post: (
      parent,
      { id, input },
      { db }: { db: DbConnection },
      info: GraphQLResolveInfo
    ) => {
      return db.Post.findById(id).then((post: PostInstance) => {
        if (!post) throw new Error(`Post with id ${id} not found!`);
        return post;
      });
    }
  },
  Mutation: {}
};
