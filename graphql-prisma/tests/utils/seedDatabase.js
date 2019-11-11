import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
  input: {
    name: 'Noor Mharab',
    email: 'noorsex@test.test',
    password: bcrypt.hashSync('noorsex12345')
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: 'baraa neek',
    email: 'baraabitch@test.test',
    password: bcrypt.hashSync('fubaraa')
  },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: 'noor get fucking',
    body: 'noor slot girls every day many one fuck here and here mother :)',
    published: true
  },
  post: undefined
};

const commentOne = {
  input: {
    text: 'i love sex lol'
  },
  comment: undefined
};

const commentTwo = {
  input: {
    text: 'no i love woman'
  },
  comment: undefined
};

const seedDatabase = async () => {
  jest.setTimeout(50000);

  // clear data base
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyComments();

  userOne.user = await prisma.mutation.createUser({
    data: {...userOne.input}
  });

  userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET);
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {connect: {id: userOne.user.id}}
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: 'noor get fucking',
      body: 'noor slot girl and fucking bitch :)',
      published: false,
      author: {connect: {id: userOne.user.id}}
    }
  });

  userTwo.user = await prisma.mutation.createUser({
    data: {...userTwo.input}
  });
  userTwo.jwt = jwt.sign({userId: userTwo.user.id}, process.env.JWT_SECRET);

  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {connect: {id: userTwo.user.id}},
      post: {connect: {id: postOne.post.id}}
    }
  });

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {connect: {id: userOne.user.id}},
      post: {connect: {id: postOne.post.id}}
    }
  });
};

export {seedDatabase as default, userOne, postOne, userTwo, commentOne, commentTwo};
