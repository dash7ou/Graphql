import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import prisma from './prisma';
import { resolvers, fragmentReplacement } from './resolvers/index';

const servers = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return { db, prisma, request };
  },
  fragmentReplacement
});

servers.start(() => {
  console.log('the server is up!');
});
