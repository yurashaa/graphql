import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'

import { dataSource } from './db/source'
import { typeDefs, resolvers, context } from './schemas'
dotenv.config()

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })

const server = new ApolloServer({ typeDefs, resolvers, context })

const app = express()

app.use(express.static('public'))

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
