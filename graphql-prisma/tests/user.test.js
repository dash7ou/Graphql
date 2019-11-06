import 'cross-fetch/polyfill';
import '@babel/polyfill';

import ApolloBoost, {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import bcrypt from 'bcryptjs';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

beforeEach(async () => {
  jest.setTimeout(10000);
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  const userTest = await prisma.mutation.createUser({
    data: {
      name: 'Noor Mharab',
      email: 'noorsex@test.test',
      password: bcrypt.hashSync('noorsex12345')
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: 'noor get fucking',
      body: 'noor slot girls every day many one fuck here and here mother :)',
      published: true,
      author: {connect: {id: userTest.id}}
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: 'noor get fucking',
      body: 'noor slot girl and fucking bitch :)',
      published: false,
      author: {connect: {id: userTest.id}}
    }
  });
});

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {name: "Morad adham", email: "testmorad@test.com", password: "morad12345***"}
      ) {
        token
        user {
          id
        }
      }
    }
  `;
  const response = await client.mutate({
    mutation: createUser
  });

  const userExits = await prisma.exists.User({id: response.data.createUser.user.id});
  if (!userExits) throw new Error('user did nor created');
  expect(userExits).toBe(true);
});
