const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");


const typeDefs = gql`
  scalar Date

  enum Status {
    WATCHED
    INTERESTED
    NOT_INTERESTED
    UNKNOWN
  }

  type Actor {
    id: ID
    name: String
  }

  type Movie {
    id: ID!
    actor: [Actor]
    title: String!
    releaseDate: Date
    rating: Int
    status: Status
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }
`;

const movies = [
  {
    id: "dasadsadsasd",
    title: "5 Deadly Venoms",
    releaseDate: new Date("12-10-1983"),
    rating: 5
  },
  {
    id: "dddd",
    title: "36th Chamber",
    releaseDate: new Date("10-10-1983"),
    rating: 5
  }
];

const resolvers = {
  Query: {
    movies: () => movies,
    movie: (obj, { id }, context, info) => movies.find(movie => movie.id === id)
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "It's a new date",
    parseValue(value) {
      // value from the client
      return new Date(value);
    },
    serialize(value) {
      // value sent to the client
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value)
      }
      return null;
    }
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

server.listen({
  port: process.env.PORT || 4000
}).then(({ url }) => {
  console.log(`Server started at: ${url}`);
})
