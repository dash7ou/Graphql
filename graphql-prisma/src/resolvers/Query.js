import Auth from '../utils/Auth';

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      };
    }
    return prisma.query.users(opArgs, info);
  },
  myPost(parent, args, { prisma, request }, info) {
    const userId = Auth(request);
    const opArgs = {};
    opArgs.where = {
      author: {
        id: userId
      }
    };
    if (args.query) {
      opArgs.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    opArgs.where = {
      published: true
    };
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  async me(parent, args, { prisma, request }, info) {
    const userId = Auth(request);
    if (!userId) throw new Error('You are not owner');

    const user = await prisma.query.user({ where: { id: userId } }, info);
    return user;
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = Auth(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true
            },
            {
              author: userId
            }
          ]
        }
      },
      info
    );
    if (posts.length === 0) throw new Error('Post not found');
    return posts[0];
  }
};

export { Query as default };
