const { ApolloServer, gql } = require('apollo-server');
const dogs = require('dog-names')
  .all.slice(0, 5)
  .map((name, index) => ({ id: index + 1, name, ownerId: 1 }));
let autoIncrement = 5;

console.log(dogs);

const typeDefs = gql`
  type Query {
    hello: String
    dogs: [Dog]
    dog(name: String): Dog
  }

  type Mutation {
    addDog(input: addDogInput!): Dog
  }

  input addDogInput {
    name: String!
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
    dogs: () => dogs,
    dog: (_, args, context) => {
      const { name } = args;
      
      return dogs.find(dog => name === dog.name);
    },
  },
  Mutation: {
    addDog: (_, args, context) => {
      const { name } = args.input;
      const nextDog = {
        id: ++autoIncrement,
        name,
        ownerId: 1,
      };

      dogs.push(nextDog);

      return nextDog;
    },
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
