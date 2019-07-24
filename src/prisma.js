import {Prisma} from 'prisma-binding'
import {fragmentReplacements} from './resolvers/index'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  fragmentReplacements,
  endpoint: 'http://localhost:4466',
  secret: 'thatisthetopsecrettextyouneeded'
});

export {prisma as default}