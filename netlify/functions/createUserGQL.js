const { ApolloServer } = require('@apollo/server');
const { gql } = require('graphql-tag');
const express = require('express');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');

// Определите вашу схему
const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    createUser(name: String!): String
  }
`;

// Определите ваши резолверы
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
  Mutation: {
    createUser: (_, { name }) => {
      return `User ${name} created!`;
    },
  },
};

// Создайте сервер Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();

// Примените middleware Apollo Server
app.use('/graphql', bodyParser.json(), expressMiddleware(server));

// Запустите сервер
app.listen({ port: process.env.PORT || 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
