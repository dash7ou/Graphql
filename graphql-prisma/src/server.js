import {GraphQLServer} from 'graphql-yoga';
import db from './db';
import prisma from './prisma';
import {resolvers, fragmentReplacement} from './resolvers/index';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {db, prisma, request};
  },
  fragmentReplacement
});

export {server as default};
