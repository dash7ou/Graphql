const Subscription = {
  comment: {
    subscribe(parent, args, ctx, info) {
      const { postId } = args;
      const { pubsub, db } = ctx;
      let { posts } = db;
      const post = posts.find(post => post.id === postId && post.publish);
      if (!post) {
        throw new Error("post not found");
      }
      return pubsub.asyncIterator(`COMMENT ${postId}`);
    }
  },
  post: {
    subscribe(parent, args, ctx, info) {
      const { userId } = args;
      const { pubsub, db } = ctx;
      let { users } = db;
      const user = users.find(user => user.id === userId);
      if (!user) throw new Error("user not found!");
      return pubsub.asyncIterator(`POST ${userId}`);
    }
  }
};

export { Subscription as default };
