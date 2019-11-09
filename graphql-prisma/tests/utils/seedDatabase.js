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

const seedDatabase = async () => {
  jest.setTimeout(20000);
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  userOne.user = await prisma.mutation.createUser({
    data: {...userOne.input}
  });

  userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET);
  await prisma.mutation.createPost({
    data: {
      title: 'noor get fucking',
      body: 'noor slot girls every day many one fuck here and here mother :)',
      published: true,
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
};

export {seedDatabase as default, userOne};
