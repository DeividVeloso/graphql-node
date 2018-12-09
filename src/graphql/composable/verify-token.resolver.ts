import { GraphQLFieldResolver } from "graphql";
import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/handlersServer";

export const verifyTokenResolver: ComposableResolver<any, ResolverContext> = (
  resolver: GraphQLFieldResolver<any, ResolverContext>
) => {
  return (parent, args, context: ResolverContext, info) => {
    const token: string = context.authorization.split(" ")[1];

    return jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        return resolver(parent, args, context, info);
      }
      throw new Error(`${err.name}: ${err.message}`);
    });
  };
};
