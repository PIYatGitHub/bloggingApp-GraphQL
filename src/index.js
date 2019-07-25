import '@babel/polyfill'
import {GraphQLServer} from 'graphql-yoga'
import prisma from './prisma'
import {resolvers, fragmentReplacements} from './resolvers/index'

const server = new GraphQLServer({
  typeDefs:'./src/schema.graphql',
  resolvers,
  fragmentReplacements,
  context(request){
    return{
      prisma, request
    }
  }
});

server.start({port:process.env.PORT || 4000}, ()=>console.log('the server is up on port 4000'));