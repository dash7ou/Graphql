import 'cross-fetch/polyfill';
import '@babel/polyfill';
import seedDatabase from './utils/seedDatabase';
import ApolloBoost, {gql} from 'apollo-boost';
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

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
