import Auth from '../utils/Auth';

const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId
              }
            }
          }
        },
        info
      );
    }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post({ where: { node: { published: true } } }, info);
    }
  },
  myPost: {
    subscribe(parent, args, { request }, info) {
      const userId = Auth(request);
      return prisma.subscription.post({ where: { node: { author: { id: userId } } } }, info);
    }
  }
};

export { Subscription as default };
