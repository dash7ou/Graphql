const Comment = {
  post(parent, args, { db }, info) {
    const { posts } = db;
    const { post: postComment } = parent;
    return posts.find(post => post.id === postComment);
  },
  author(parent, args, { db }, info) {
    const { users } = db;
    const { author } = parent;
    return users.find(user => user.id === author);
  }
};

export { Comment as default };
