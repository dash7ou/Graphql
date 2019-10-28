const Query = {
  users(parent, args, { db }, info) {
    const { users } = db;
    const { query } = args;
    if (!query) {
      return users;
    }
    return users.filter(user => {
      const { name } = user;
      return name.toLowerCase().includes(query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    const { posts } = db;
    const { query } = args;
    if (!query) {
      return posts;
    }
    return posts.filter(post => {
      return (
        post.body.toLowerCase().includes(query.toLowerCase()) ||
        post.title.toLowerCase().includes(query.toLowerCase())
      );
    });
  },
  comments(parent, args, { db }, info) {
    const { comments } = db;
    const { query } = args;
    if (!query) {
      return comments;
    }
    return comments.filter(comment =>
      comment.text.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export { Query as default };
