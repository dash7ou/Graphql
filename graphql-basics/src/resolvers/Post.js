const Post = {
  author(parent, args, { db }, info) {
    const { users } = db;
    const { author } = parent;
    return users.find(user => user.id === author);
  },
  comments(parent, args, { db }, info) {
    const { comments } = db;
    const { id } = parent;
    return comments.filter(comment => comment.post === id);
  }
};

export { Post as default };
