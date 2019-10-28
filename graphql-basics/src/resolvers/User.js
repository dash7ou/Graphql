const User = {
  posts(parent, args, { db }, info) {
    const { id } = parent;
    const { posts } = db;
    return posts.filter(post => post.author === id);
  },
  comments(parent, args, { db }, info) {
    const { id } = parent;
    const { comments } = db;
    return comments.filter(comment => comment.author === id);
  }
};

export { User as default };
