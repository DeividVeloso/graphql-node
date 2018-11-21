import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { Transaction } from "sequelize";
import { handleError, throwError } from "../../../utils/handlersServer";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
import * as graphqlFields from "graphql-fields";

export const postResolvers = {
  Post: {
    author: (
      post,
      args,
      {
        db,
        dataloaders: { userLoader }
      }: { db: DbConnection; dataloaders: DataLoaders },
      info: GraphQLResolveInfo
    ) => {
      return userLoader.load(post.get("author")).catch(handleError);
    },
    comments: (
      post,
      { first = 10, offset = 0 },
      { db }: { db: DbConnection },
      info: GraphQLResolveInfo
    ) => {
      return db.Comment.findAll({
        where: post.get("id"),
        limit: first,
        offset: offset
      }).catch(handleError);
    }
  },
  Query: {
    posts: (
      parent,
      { first = 10, offset = 0 },
      { db }: { db: DbConnection },
      info: GraphQLResolveInfo
    ) => {
      const fields = Object.keys(graphqlFields(info));
      console.log("OPA", fields);

      return db.Post.findAll({
        limit: first,
        offset: offset,
        attributes: fields
      }).catch(handleError);
    },
    post: (
      parent,
      { id, input },
      { db }: { db: DbConnection },
      info: GraphQLResolveInfo
    ) => {
      id = parseInt(id);
      return db.Post.findById(id)
        .then((post: PostInstance) => {
          throwError(!post, `Post id ${id} not found`);
          return post;
        })
        .catch(handleError);
    }
  },
  Mutation: {
    createPost: compose(...authResolvers)(
      (
        parent,
        { input },
        { db, authUser }: { db: DbConnection; authUser: AuthUser },
        info: GraphQLResolveInfo
      ) => {
        input.author = authUser.id;
        return db.sequelize
          .transaction((t: Transaction) => {
            return db.Post.create(input, { transaction: t });
          })
          .catch(handleError);
      }
    ),
    updatePost: compose(...authResolvers)(
      (
        parent,
        { id, input },
        { db, authUser }: { db: DbConnection; authUser: AuthUser },
        info: GraphQLResolveInfo
      ) => {
        id = parseInt(id);
        return db.sequelize
          .transaction((t: Transaction) => {
            return db.Post.findById(id).then((post: PostInstance) => {
              throwError(!post, `Post id ${id} not found`);
              //Só vai deixar atualizar se for o mesmo usuário. Se for diferente lancar o erro
              throwError(
                post.get("author") != authUser.id,
                `Unauthorized! Yoou cant do this`
              );
              input.author = authUser.id;
              return post.update(input, { transaction: t });
            });
          })
          .catch(handleError);
      }
    ),
    deletePost: compose(...authResolvers)(
      (
        parent,
        { id },
        { db, authUser }: { db: DbConnection; authUser: AuthUser },
        info: GraphQLResolveInfo
      ) => {
        id = parseInt(id);
        return db.sequelize
          .transaction((t: Transaction) => {
            return db.Post.findById(id).then((post: PostInstance) => {
              throwError(!post, `Post id ${id} not found`);
              throwError(
                post.get("author") != authUser.id,
                `Unauthorized! Yoou cant do this`
              );

              return post.destroy({ transaction: t }).then(post => !!post);
            });
          })
          .catch(handleError);
      }
    )
  }
};
