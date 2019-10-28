import uuidv4 from 'uuid/v4';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const {
      data: { email }
    } = args;
    const { data: newUserData } = args;

    const emailToken = await prisma.exists.User({ email });
    if (emailToken) {
      throw new Error('Email already taken');
    }

    const user = await prisma.mutation.createUser({ data: newUserData }, info);
    if (!user) {
      throw new Error('there are some problem in create user');
    }
    return user;
  },
  async deleteUser(parent, args, { prisma }, info) {
    const { id } = args;
    const userExist = await prisma.exists.User({ id });
    if (!userExist) throw new Error('this user not found');

    const user = await prisma.mutation.deleteUser({ where: { id } }, info);
    return user;
  },
  async updateUser(parent, args, { prisma }, info) {
    const { id, data } = args;
    const userExist = await prisma.exists.User({ id });
    if (!userExist) throw new Error('User you lookup not found');
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('id')) throw new Error('You cant change that property');
    if (dataKeys.includes('posts' || 'comments'))
      throw new Error('You can not change from that place');
    const updateUser = await prisma.mutation.updateUser({ data: data, where: { id } }, info);
    return updateUser;
  },
  async createPost(parent, args, { prisma, pubsub }, info) {
    const { data } = args;
    const { title, body, published, author } = data;
    if (!title || !body || !published) {
      throw new Error('There are require field missing');
    }
    if (!author) {
      throw new Error('No user to create post');
    }
    const userExist = await prisma.exists.User({ id: author });
    if (!userExist) throw new Error('No User with this id');
    delete data.author;
    const dataCreatePost = {
      ...data,
      author: {
        connect: {
          id: author
        }
      }
    };
    const post = await prisma.mutation.createPost({ data: dataCreatePost }, info);
    if (!post) throw new Error('there are problem in create post');
    return post;
  },
  async deletePost(parent, args, { prisma, pubsub }, info) {
    const { id } = args;
    if (!id) throw new Error('there are require field is missing');
    const post = await prisma.exists.Post({ id });
    if (!post) throw new Error('no post !!');

    const postDeleted = await prisma.mutation.deletePost({ where: { id } }, info);
    return postDeleted;
  },
  async updatePost(parent, args, { prisma, pubsub }, info) {
    const { id, data } = args;
    const post = await prisma.exists.Post({ id });
    if (!post) throw new Error('no user found with this id sorry');
    // const originalPost = { ...post };
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('author' || 'id')) throw new Error('You cant change that property');
    if (dataKeys.includes('comments')) throw new Error('You can change from the place ');

    const postUpdated = await prisma.mutation.updatePost({ data: data, where: { id } }, info);
    return postUpdated;
  },
  async createComment(parent, args, { prisma, pubsub }, info) {
    const { data } = args;
    const { text, author, post: postId } = data;
    if (!text) {
      throw new Error('there are required field missing');
    }
    if (!author) {
      throw new Error('no user to add comment');
    }
    if (!postId) {
      throw new Error('no post to add comment');
    }
    const userExist = await prisma.exists.User({ id: author });
    if (!userExist) throw new Error('This user is not exist');
    const postExist = await prisma.exists.Post({ id: postId });
    if (!postExist) throw new Error('this post not valid');

    const dataCreateComment = {
      ...data,
      author: {
        connect: {
          id: author
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
  async deleteComment(parent, args, { prisma, pubsub }, info) {
    const { id } = args;
    if (!id) throw new Error('no comment to delete it');
    const comment = await prisma.exists.Comment({ id });
    if (!comment) throw new Error('Sorry no post to delete it');
    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  async updateComment(parent, args, { prisma, pubsub }, info) {
    const { id, data } = args;
    const comment = await prisma.exists.Comment({ id });
    if (!comment) throw new Error('no comment found with this id sorry');
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('author' || 'id' || 'posts'))
      throw new Error('You cant change that property');
    return prisma.mutation.updateComment({ data: data, where: { id } }, info);
  }
};

export { Mutation as default };
