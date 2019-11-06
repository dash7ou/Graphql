import 'cross-fetch/polyfill';
import '@babel/polyfill';
import ApolloBoost, {gql} from 'apollo-boost';
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {name: "Morad adham", email: "testmorad3@test.com", password: "morad12345***"}
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
