const tokenTypes = `
    type Token {
        token: string
    }
`;

const tokenMutations = `
    createToken(email: String!, password: String!): Token
`;

export { tokenTypes, tokenMutations };
