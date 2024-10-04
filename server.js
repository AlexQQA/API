const express = require('express');
const { ApolloServer, gql } = require('@apollo/server');


const typeDefs = gql`
  type Query {
    hello: String
  }
`;


const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};


const server = new ApolloServer({ typeDefs, resolvers });


const app = express();


const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000; 
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
