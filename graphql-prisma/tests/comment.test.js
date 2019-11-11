import 'cross-fetch/polyfill';
import '@babel/polyfill';
import {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import getClient from './utils/getClient';
import seedDatabase, {userOne, userTwo, commentOne} from './utils/seedDatabase';

beforeEach(seedDatabase);

test('should  delete own comment', async () => {
  const {jwt} = userTwo;
  const {
    comment: {id}
  } = commentOne;

  const client = getClient(jwt);
  const deleteComment = gql`
    mutation {
      deleteComment(id:"${id}"){
          id
          text
      }
    }
  `;

  await client.mutate({mutation: deleteComment});
  const exist = await prisma.exists.Comment({id});
  console.log(exist);
  expect(exist).toBe(false);
});

test('should   not delete other users comment', async () => {
  const {jwt} = userOne;
  const {
    comment: {id}
  } = commentOne;

  const client = getClient(jwt);

  const deleteComment = gql`
  mutation {
    deleteComment(id:"${id}"){
        id
        text
    }
  }
`;

  await expect(client.mutate({mutation: deleteComment})).rejects.toThrow();
});
