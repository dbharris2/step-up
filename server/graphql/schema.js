const GraphQLSchema = require('graphql').GraphQLSchema;
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

import Profile from './profile';
import TimeSeries from './time_series';
import User from './user';
import {profileEdgeResolvers, profileQueryResolvers} from './profile_resolvers';
import {timeSeriesEdgeResolvers, timeSeriesQueryResolvers} from './time_series_resolvers';
import {userQueryResolvers} from './user_resolvers';

const rootQueries = `
  type Query {
    average_steps(user_id: String): TimeSeries
    profile(user_id: String): Profile
    time_series(user_id: String): [TimeSeries]
    total_steps(user_id: String): TimeSeries
    user(user_id: String): User
    users: [User]
    yesterdays_steps(user_id: String): TimeSeries
  }
`;

const schemaDefinition = `
  schema {
    query: Query
  }
`;

const resolvers = {
  Query: {
    ...profileQueryResolvers,
    ...timeSeriesQueryResolvers,
    ...userQueryResolvers,
  },
  User: {
    ...profileEdgeResolvers,
    ...timeSeriesEdgeResolvers,
  },
};

exports.schema = makeExecutableSchema({
  typeDefs: [
    schemaDefinition,
    rootQueries,
    Profile,
    TimeSeries,
    User,
  ],
  resolvers: resolvers,
});
