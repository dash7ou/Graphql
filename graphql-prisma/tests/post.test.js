import 'cross-fetch/polyfill';
import '@babel/polyfill';
import seedDatabase from './utils/seedDatabase';
import {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import getClient from './utils/getClient';
import {userOne, postOne} from './utils/seedDatabase';

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

test('should to be able update own post', async () => {
  const {jwt} = userOne;
  const {
    post: {id: testId}
  } = postOne;
  const client = getClient(jwt);
  const updatePost = gql`
    mutation {
      updatePost(id: "${testId}", data: {published: false}) {
        id
        title
        body
        published
      }
    }
  `;
  const {
    data: {
      updatePost: {published}
    }
  } = await client.mutate({mutation: updatePost});
  expect(published).toBe(false);
});

test('should create new post after login', async () => {
  const {jwt} = userOne;

  const client = getClient(jwt);
  const createPost = gql`
    mutation {
      createPost(data: {title: "test post", body: "this is test post body", published: true}) {
        id
        title
        body
        published
      }
    }
  `;

  const {
    data: {
      createPost: {title, body, published}
    }
  } = await client.mutate({mutation: createPost});

  expect(title).toBe('test post');
  expect(body).toBe('this is test post body');
  expect(published).toBe(true);
});

test('should delete post u are owner after login', async () => {
  const {jwt} = userOne;
  const {
    post: {id}
  } = postOne;
  const client = getClient(jwt);

  const deletePost = gql`
  mutation{
    deletePost(id:"${id}"){
      id
      title
      body
    }
  }

  `;

  await client.mutate({mutation: deletePost});
  const exist = await prisma.exists.Post({id});
  expect(exist).toBe(false);
});
