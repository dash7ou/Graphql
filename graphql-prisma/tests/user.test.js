import 'cross-fetch/polyfill';
import '@babel/polyfill';
import seedDatabase from './utils/seedDatabase';
import ApolloBoost, {gql} from 'apollo-boost';
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

beforeEach(seedDatabase);

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
}, 10000);

test('should return public author profile', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;
  const response = await client.query({query: getUsers});
  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Noor Mharab');
}, 10000);

test('should not login with bad credentials', async () => {
  const login = gql`
    mutation {
      login(data: {email: "moradNo@gmail.com", password: "somethingrandom"}) {
        token
      }
    }
  `;
  await expect(client.mutate({mutation: login})).rejects.toThrow();
}, 10000);

test('should not signup with short password', async () => {
  const createUser = gql`
    mutation {
      createUser(data: {name: "noone", email: "noone@example.com", password: "test"}) {
        token
        user {
          id
        }
      }
    }
  `;
  await expect(client.mutate({mutation: createUser})).rejects.toThrow();
}, 10000);
