const Comment = {
  // post(parent, args, { db }, info) {
  //   const { posts } = db;
  //   const { post: postComment } = parent;
  //   return posts.find(post => post.id === postComment);
  // },
  // author(parent, args, { db }, info) {
  //   const { users } = db;
  //   const { author } = parent;
  //   return users.find(user => user.id === author);
  // }
};

// now we did not have that because we use prisma

export { Comment as default };
