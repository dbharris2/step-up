const GraphQLSchema = require('graphql').GraphQLSchema;
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

import User from './user';
import {userQueryResolvers} from './user_resolvers';

const rootQueries = `
  type Query {
    user(_id: String): User
    users: [User]
  }
`;

const schemaDefinition = `
  schema {
    query: Query
  }
`;

const resolvers = {
  Query: {
    ...userQueryResolvers,
  },
};

exports.schema = makeExecutableSchema({
  typeDefs: [
    schemaDefinition,
    rootQueries,
    User,
  ],
  resolvers: resolvers,
});
