const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Movie {
    title: String
    releaseDate: String
    rating: Int
  }
`

const movies = [
  {
    title: "5 Deadly Venoms",
    releaseDate: "10-10-1983",
    rating: 5
  },
  {
    title: "36th Chamber",
    releaseDate: "10-10-1983",
    rating: 5
  }
]
