import {Prisma} from 'prisma-binding'
import {fragmentReplacements} from './resolvers/index'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  fragmentReplacements,
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: 'thatisthetopsecrettextyouneeded'
});

export {prisma as default}