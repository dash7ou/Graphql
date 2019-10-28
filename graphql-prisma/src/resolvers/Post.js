const Post = {
  // author(parent, args, { db }, info) {
  //   const { users } = db;
  //   const { author } = parent;
  //   return users.find(user => user.id === author);
  // },
  // comments(parent, args, { db }, info) {
  //   const { comments } = db;
  //   const { id } = parent;
  //   return comments.filter(comment => comment.post === id);
  // }
};

// now we did not have all that because of prisma.query and include info init

export { Post as default };
