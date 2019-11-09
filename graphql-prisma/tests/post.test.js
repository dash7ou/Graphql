import 'cross-fetch/polyfill';
import '@babel/polyfill';
import seedDatabase from './utils/seedDatabase';
import {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import getClient from './utils/getClient';
import {userOne} from './utils/seedDatabase';

const client = getClient();

beforeEach(seedDatabase);

test('should return all publish posts', async () => {
  const getPosts = gql`
    query {
      posts {
        title
        body
        published
      }
    }
  `;
  const response = await client.query({query: getPosts});
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
}, 10000);

test('should return all my posts after login', async () => {
  const {jwt} = userOne;
  const client = getClient(jwt);

  const myPost = gql`
    query {
      myPost {
        id
        title
        body
        published
      }
    }
  `;

  const {
    data: {myPost: testPosts}
  } = await client.query({query: myPost});
  expect(testPosts.length).toBe(2);
});
