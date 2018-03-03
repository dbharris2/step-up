const { createApolloFetch } = require('apollo-fetch');

const GraphQL = createApolloFetch({
  // dev: 'http://localhost:8080/graphql'
  uri: 'https://steps4days.herokuapp.com/graphql',
});

module.exports = GraphQL;
