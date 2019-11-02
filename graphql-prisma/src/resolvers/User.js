import Auth from '../utils/Auth';
const User = {
  email: {
    fragment: `fragment userId on User { id }`,
    resolve(parent, args, { request }, info) {
      const userId = Auth(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      } else {
        return null;
      }
    }
  },
  posts: {
    fragment: `fragment userId on User { id }`,
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      });
    }
  },
  comments: {
    fragment: `fragment userId on User { id }`,
    resolve(parent, args, { prisma }, info) {
      return prisma.query.comments({
        where: {
          author: {
            id: parent.id
          }
        }
      });
    }
  }
};

export { User as default };
