const User = {
  // posts(parent, args, { prisma }, info) {
  //   const { id } = parent;
  //   const { posts } = db;
  //   return posts.filter(post => post.author === id);
  // },
  // comments(parent, args, { prisma }, info) {
  //   const { id } = parent;
  //   const { comments } = db;
  //   return comments.filter(comment => comment.author === id);
  // }
};

//! now we did not have that because we add info in prisma.query
export { User as default };
