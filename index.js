import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import { RESTDataSource } from 'apollo-datasource-rest'

class RestApi extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `http://localhost:8000/api`
  }

  async getDogs() {
    return this.get('dogs')
  }
}

const typeDefs = gql`
  type Dog {
    id: ID!
    name: String!
  }

  type Query {
    dogs: [Dog]
  }
`

const resolvers = {
  Query: {
    dogs: (_, args, { dataSources: { restApi } }) => restApi.getDogs()
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    restApi: new RestApi()
  })
})

const app = express()

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () => {
  console.log(`🚀  Server ready at ${4000}`)
})
