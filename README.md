# Fragments
Fragments have to be defined first before the GraphQL Query
Example:

```fragment Meta on Movie {
  releaseDate
  rating
}

{
  movies {
    id
    ...Meta
  }
}```
