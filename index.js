const { ApolloServer, gql } = require('apollo-server');
const names = require('dog-names').all;
const dogs = names
  .slice(0, 5)
  .map((name, index) => ({ id: index + 1, name, ownerId: index % 2 }));
const owners = names
  .slice(5, 7)
  .map((name, index) => ({ id: index + 1, name }));

let autoIncrement = 5;

console.log(dogs);
console.log(owners);

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
    dogs: [Dog]
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

      return owners.find(owner => owner.id == ownerId);
    },
  },
  Owner: {
    dogs: parent => {
      /**
       * {
       *   dog(name: "Max") {
       *     id
       *     name
       *     owner {
       *       dogs {
       *         name
       *       }
       *     }
       * }
       */
      console.log(parent);

      const { id } = parent;

      return dogs.filter(dog => dog.ownerId === id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
