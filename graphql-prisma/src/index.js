import { GraphQLServer } from 'graphql-yoga';
import '@babel/polyfill/noConflict';
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

servers.start({ port: process.env.PORT || 4000 }, () => {
  console.log('the server is up!');
});
