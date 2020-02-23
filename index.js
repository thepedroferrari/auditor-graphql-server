const { ApolloServer, gql } = require("apollo-server");
const dotenv = require("dotenv");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const mongoose = require("mongoose");

dotenv.config();
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0-tpkgr.azure.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);
const db = mongoose.connection;

const movieSchema = new mongoose.Schema({
  actorsIds: [String],
  title: String,
  releaseDate: Date,
  rating: Number,
  status: String
});

const Movie = mongoose.model("Movie", movieSchema);

// gql`` parses the string into an Abstract Syntax Tree
const typeDefs = gql`
  fragment Meta on Movie {
    releaseDate
    rating
  }

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
    actors: [Actor]
    title: String!
    releaseDate: Date
    rating: Int
    status: Status
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }

  input ActorInput {
    id: ID
    name: String
  }

  input MovieInput {
    id: ID
    title: String
    releaseDate: Date
    rating: Int
    status: Status
    actors: [ActorInput]
  }

  type Mutation {
    addMovie(movie: MovieInput): [Movie]
  }
`;

const actors = [
  {
    id: "gordon",
    name: "Gordon Liu Kenga"
  },
  {
    id: "jackie",
    name: "Jackie Chan"
  }
];

const movies = [
  {
    id: "dasadsadsasd",
    title: "5 Deadly Venoms",
    releaseDate: new Date("12-10-1983"),
    rating: 5,
    actors: [
      {
        id: "jackie"
      }
    ]
  },
  {
    id: "dddd",
    title: "36th Chamber",
    releaseDate: new Date("10-10-1983"),
    rating: 5,
    actors: [
      {
        id: "gordon"
      }
    ]
  }
];

const resolvers = {
  Query: {
    movies: async () => {
      try {
        const allMovies = await Movie.find();
        return allMovies;
      } catch (error) {
        console.log("Query error:", error);
        return [];
      }
    },
    movie: async (obj, { id }) => {
      try {
        const foundMovie = await Movie.findById(id);
        return foundMovie;
      } catch (error) {
        console.log("error:", error);
        return {};
      }
    }
  },

  Movie: {
    actors: (obj, args, context) => {
      const actorIds = obj.actors.map(actor => actor.id);
      const filteredActors = actors.filter(actor =>
        actorIds.includes(actor.id)
      );
      return filteredActors;
    }
  },

  Mutation: {
    addMovie: async (obj, { movie }, { userId }) => {
      try {
        if (userId === "user IDENTIFICASTIONSNSNAISD") {
          // pull data from database
          await Movie.create({
            ...movie
          });
          // update database
          const allMovies = await Movie.find();
          return allMovies;
        }

        return movies;
      } catch (e) {
        console.log("e:", e);
        return [];
      } finally {
        console.log("End of Mutation");
      }
    }
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
        return new Date(ast.value);
      }
      return null;
    }
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    const fakeUser = {
      userId: "user IDENTIFICASTIONSNSNAISD"
    };
    return {
      ...fakeUser
    };
  }
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB ✅");
  server
    .listen({
      port: process.env.PORT || 4000
    })
    .then(({ url }) => {
      console.log(`Server started at: ${url}`);
    });
});
