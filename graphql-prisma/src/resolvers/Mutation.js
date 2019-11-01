import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Auth from '../utils/Auth';

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const { email, password } = args.data;
    if (!email || !password) throw new Error('There are required field missing');
    const user = await prisma.query.user({ where: { email } });
    if (!user) throw new Error('there are some error in your email or password');
    const configPassword = await bcrypt.compare(password, user.password);
    if (!configPassword) throw new Error('Make sure from your email and password');
    return { user, token: jwt.sign({ userId: user.id }, 'thisissecretcode') };
  },
  async createUser(parent, args, { prisma }, info) {
    const {
      data: { email, password: beforeHashing }
    } = args;
    const { data: newUserData } = args;

    const emailToken = await prisma.exists.User({ email });
    if (emailToken) {
      throw new Error('Email already taken');
    }

    if (beforeHashing.length < 8) throw new Error('password must be 8 character or more.');

    const password = await bcrypt.hash(beforeHashing, 12);

    const user = await prisma.mutation.createUser({ data: { ...newUserData, password } });
    if (!user) {
      throw new Error('there are some problem in create user');
    }
    return { user, token: jwt.sign({ userId: user.id }, 'thisissecretcode') };
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userIdFromAuth = Auth(request);
    const userExist = await prisma.exists.User({ id: userIdFromAuth });
    if (!userExist) throw new Error('this user not found');

    const user = await prisma.mutation.deleteUser({ where: { id: userIdFromAuth } }, info);
    return user;
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userIdFromAuth = Auth(request);
    const { data } = args;
    const userExist = await prisma.exists.User({ id: userIdFromAuth });
    if (!userExist) throw new Error('User you lookup not found');
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('id')) throw new Error('You cant change that property');
    if (dataKeys.includes('posts' || 'comments'))
      throw new Error('You can not change from that place');
    const updateUser = await prisma.mutation.updateUser(
      { data: data, where: { id: userIdFromAuth } },
      info
    );
    return updateUser;
  },

  async createPost(parent, args, { prisma, request }, info) {
    const userIdFromAuth = Auth(request);
    const { data } = args;
    const { title, body, published } = data;
    if (!title || !body || !published) {
      throw new Error('There are require field missing');
    }
    if (!userIdFromAuth) {
      throw new Error('No user to create post');
    }
    const userExist = await prisma.exists.User({ id: userIdFromAuth });
    if (!userExist) throw new Error('No User with this id');
    const dataCreatePost = {
      ...data,
      author: {
        connect: {
          id: userIdFromAuth
        }
      }
    };
    const post = await prisma.mutation.createPost({ data: dataCreatePost }, info);
    if (!post) throw new Error('there are problem in create post');
    return post;
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const { id } = args;
    const userIdFromAuth = Auth(request);

    const post = await prisma.query.post({ where: { id } }, `{id title author{id}}`);
    if (!post) throw new Error('no post !!');

    if (userIdFromAuth !== post.author.id) throw new Error('You cant delete that error sorry');
    if (!id) throw new Error('there are require field is missing');

    const postDeleted = await prisma.mutation.deletePost({ where: { id } }, info);
    return postDeleted;
  },

  async updatePost(parent, args, { prisma, request }, info) {
    const { id, data } = args;
    const userIdFromAuth = Auth(request);

    const post = await prisma.query.post({ where: { id } }, `{id title author{id}}`);

    if (!post) throw new Error('no user found with this id sorry');
    if (post.author.id !== userIdFromAuth)
      throw new Error('you have not permission to update that');
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('author' || 'id')) throw new Error('You cant change that property');
    if (dataKeys.includes('comments')) throw new Error('You can change from the place ');

    const postUpdated = await prisma.mutation.updatePost({ data: data, where: { id } }, info);
    const isNotPublished = await prisma.exists.post({ id: id, isPublished: false });
    if (isNotPublished) {
      await prisma.mutation.deleteManyComments({ where: { post: { id: id } } });
    }
    return postUpdated;
  },

  async createComment(parent, args, { prisma, request }, info) {
    const { data } = args;
    const { text, post: postId } = data;
    const userIdFromAuth = Auth(request);
    if (!text) {
      throw new Error('there are required field missing');
    }
    if (!postId) {
      throw new Error('no post to add comment');
    }
    const userExist = await prisma.exists.User({ id: userIdFromAuth });
    if (!userExist) throw new Error('This user is not exist');
    const postExist = await prisma.query.Post({ id: postId }, `{published : true}`);
    if (!postExist) throw new Error('this post not valid');
    if (!postExist.published) throw new Error('this post not published');

    const dataCreateComment = {
      ...data,
      author: {
        connect: {
          id: userIdFromAuth
        }
      },
      post: {
        connect: {
          id: postId
        }
      }
    };
    const comment = await prisma.mutation.createComment({ data: dataCreateComment }, info);
    return comment;
  },

  async deleteComment(parent, args, { prisma, request }, info) {
    const { id } = args;
    const userIdFromAuth = Auth(request);

    if (!id) throw new Error('no comment to delete it');

    const comment = await prisma.query.comment({ where: { id } }, `{author{id}}`);
    if (!comment) throw new Error('Sorry no post to delete it');
    if (comment.author.id !== userIdFromAuth)
      throw new Error('you have not permission to deleted that comment');

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },

  async updateComment(parent, args, { prisma, request }, info) {
    const { id, data } = args;
    const userIdFromAuth = Auth(request);

    const comment = await prisma.query.comment({ where: { id } }, `author{id}`);
    if (!comment) throw new Error('no comment found with this id sorry');
    if (comment.author.id !== userIdFromAuth)
      throw new Error('You have not permission to update that comment');
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('author' || 'id' || 'posts'))
      throw new Error('You cant change that property');
    return prisma.mutation.updateComment({ data: data, where: { id } }, info);
  }
};

export { Mutation as default };
