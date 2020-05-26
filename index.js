const { ApolloServer, gql } = require('apollo-server');
const dogNames = require('dog-names').all.slice(0, 5);

const typeDefs = gql`
  type Query {
    hello: String
    dogs: [Dog]
  }

  type Dog {
    id: ID
    name: String
    owner: Owner
  }

  type Owner {
    id: ID
    name: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world',
    dogs: () =>
      dogNames.map((name, index) => ({ id: index, name, ownerId: 1 })),
  },
  Dog: {
    owner: (parent, args, context) => {
      console.log(parent);

      const { ownerId } = parent;

      return { id: ownerId, name: 'wl00887404' };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
