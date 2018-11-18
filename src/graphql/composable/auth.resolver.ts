import { GraphQLFieldResolver } from "graphql";

import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import { verifyTokenResolver } from "./verify-token.resolver";

//é uma funcao do tipo composableResolver que é do tipo qualquer coisa e um contexto
//Que vai receber outra funcao chamada resolver que é do tipo GraphQLFieldResolver
//Que retornar um  GraphQLFieldResolver
//Dentro fazendo a assinatura de um resolver return (parent, args, context, info) => {
export const authResolver: ComposableResolver<any, ResolverContext> = (
  resolver: GraphQLFieldResolver<any, ResolverContext>
): GraphQLFieldResolver<any, ResolverContext> => {
  return (parent, args, context: ResolverContext, info) => {
    //Se tiver User ou Authorization então ele chama o resolver e passa para outra funcao

    if (context.authUser || context.authorization) {
      //Tipo o next() do Express.
      return resolver(parent, args, context, info);
    }

    //Caso não ache user ou autorization para a funcao e não deixa passar para o proximo resolver.
    throw new Error("Unauthorized Token  not provided");
  };
};

export const authResolvers = [authResolver, verifyTokenResolver];
