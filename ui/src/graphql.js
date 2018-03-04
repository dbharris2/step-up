const { createApolloFetch } = require('apollo-fetch');

const GraphQL = createApolloFetch({
  uri: '/graphql',
});

module.exports = GraphQL;
