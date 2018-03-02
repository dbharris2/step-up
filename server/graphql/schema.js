const GraphQLSchema = require('graphql').GraphQLSchema;
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

import TimeSeries from './time_series';
import User from './user';
import {timeSeriesEdgeResolvers, timeSeriesQueryResolvers} from './time_series_resolvers';
import {userQueryResolvers} from './user_resolvers';

const rootQueries = `
  type Query {
    time_series(user_id: String): [TimeSeries]
    user(user_id: String): User
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
    ...timeSeriesQueryResolvers,
    ...userQueryResolvers,
  },
  User: {
    ...timeSeriesEdgeResolvers,
  },
};

exports.schema = makeExecutableSchema({
  typeDefs: [
    schemaDefinition,
    rootQueries,
    TimeSeries,
    User,
  ],
  resolvers: resolvers,
});
