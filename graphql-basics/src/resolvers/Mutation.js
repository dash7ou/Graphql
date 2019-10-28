import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    let { users } = db;
    const { data } = args;
    const { email, name, age } = data;
    if (!email || !name) {
      throw new Error("There are require felid");
    }
    const emailToken = users.some(user => user.email === email);
    if (emailToken) {
      throw new Error("Email is token");
    }
    const user = {
      id: uuidv4(),
      name,
      email,
      age
    };

    users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args;
    let { users, posts, comments } = db;
    if (!id) throw new Error("there are required field missing");
    const user = users.find(user => user.id === id);
    if (!user) throw new Error("No user to delete it");
    const index = users.indexOf(user);
    users.splice(index, 1);
    posts = posts.filter(post => {
      if (post.author === id) {
        comments = comments.filter(comment => comment.post !== post.id);
      }
      return post.author !== id;
    });
    comments = comments.filter(comment => comment.author !== id);
    return user;
  },
  updateUser(parent, args, ctx, info) {
    const { db } = ctx,
      { id, data } = args;
    let { users } = db;
    const user = users.find(user => user.id === id);
    if (!user) throw new Error("no user found with this id sorry");
    const dataKeys = Object.keys(data);
    if (dataKeys.includes("id"))
      throw new Error("You cant change that property");
    if (dataKeys.includes("posts" || "comments"))
      throw new Error("You can change from the place ");
    dataKeys.forEach(key => (user[key] = data[key]));
    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    let { posts, users } = db;
    const { data } = args;
    const { title, body, publish, author } = data;
    if (!title || !body || !publish) {
      throw new Error("There are require field missing");
    }
    if (!author) {
      throw new Error("No user to create post");
    }
    const userExist = users.find(user => user.id === author);
    if (!userExist) {
      throw new Error("there is not user with this id ;)");
    }

    const post = {
      id: uuidv4(),
      title,
      body,
      publish,
      author
    };
    posts.push(post);
    pubsub.publish(`POST ${author}`, {
      post: {
        mutation: "CREATED",
        data: post
      }
    });
    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    let { posts, users, comments } = db;
    const { id } = args;
    if (!id) throw new Error("there are require field is missing");
    const post = posts.find(post => post.id === id);
    if (!post) throw new Error("no post !!");
    const index = posts.indexOf(post);
    posts.splice(index, 1);
    comments = comments.filter(comment => comment.post !== id);
    users.forEach(user => {
      if (user.posts) {
        user.posts.forEach(post => {
          if (post === id) {
            const index = user.posts.indexOf(post);
            user.posts.splice(index, 1);
          }
        });
      }
    });
    if (post.publish) {
      pubsub.publish(`POST ${post.author}`, {
        post: { mutation: "DELETE", data: post }
      });
    }
    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    let { posts } = db;
    const { id, data } = args;
    const post = posts.find(post => post.id === id);
    const originalPost = { ...post };
    if (!post) throw new Error("no user found with this id sorry");
    const dataKeys = Object.keys(data);
    if (dataKeys.includes("author" || "id"))
      throw new Error("You cant change that property");
    if (dataKeys.includes("comments"))
      throw new Error("You can change from the place ");
    dataKeys.forEach(key => (post[key] = data[key]));

    //subscription
    if (post.publish && !originalPost.publish) {
      //created
      pubsub.publish(`POST ${originalPost.author}`, {
        data: {
          mutation: "CREATED",
          data: post
        }
      });
    } else if (!post.publish && originalPost.publish) {
      //deleted
      pubsub.publish(`POST ${originalPost.author}`, {
        post: {
          mutation: "DELETED",
          data: originalPost
        }
      });
    } else if (post.publish === originalPost.publish) {
      //updated
      pubsub.publish(`POST ${post.author}`, {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }
    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    let { comments, users, posts } = db;
    const { data } = args;
    const { text, author, post: postId } = data;
    if (!text) {
      throw new Error("there are required field missing");
    }
    if (!author) {
      throw new Error("no user to add comment");
    }
    if (!postId) {
      throw new Error("no post to add comment");
    }
    const userExist = users.find(user => user.id === author);
    if (!userExist) throw new Error("This user is not exist");
    const postExist = posts.find(post => post.id === postId);
    if (!postExist) throw new Error("this post not valid");

    const comment = {
      id: uuidv4(),
      text,
      post: postId,
      author
    };
    comments.push(comment);
    if (comment.publish) {
      pubsub.publish(`COMMENT ${postId}`, {
        comment: {
          mutation: "CREATED",
          data: comment
        }
      });
    }
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    let { users, comments, posts } = db;
    const { id } = args;
    if (!id) throw new Error("no comment to delete it");
    const comment = comments.find(comment => comment.id === id);
    if (!comment) throw new Error("Sorry no post to delete it");
    const index = comments.indexOf(comment);
    comments.splice(index, 1);
    posts.forEach(post => {
      if (post.comments) {
        post.comments.forEach(comment => {
          if (comment === id) {
            const index = post.comments.indexOf(id);
            post.comments.splice(index, 1);
          }
        });
      }
    });
    users.forEach(user => {
      if (users.comments) {
        user.comments.forEach(comment => {
          if (comment === id) {
            const index = user.comments.indexOf(comment);
            user.comments.splice(index, 1);
          }
        });
      }
    });
    pubsub.publish(`COMMENT ${comment.post}`, {
      comment: { mutation: "DELETED", data: comment }
    });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    let { comments } = db;
    const { id, data } = args;
    const comment = comments.find(comment => comment.id === id);
    if (!comment) throw new Error("no user found with this id sorry");
    const dataKeys = Object.keys(data);
    if (dataKeys.includes("author" || "id" || "posts"))
      throw new Error("You cant change that property");
    dataKeys.forEach(key => (comment[key] = data[key]));
    pubsub.publish(`COMMENT ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });
    return comment;
  }
};

export { Mutation as default };
