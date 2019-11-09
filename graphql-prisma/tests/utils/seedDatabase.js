import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';

const seedDatabase = async () => {
  jest.setTimeout(20000);
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
};

export {seedDatabase as default};
