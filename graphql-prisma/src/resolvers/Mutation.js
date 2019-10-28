import uuidv4 from 'uuid/v4';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const {
      data: { email }
    } = args;
    const { data: newUserData } = args;

    const emailToken = await prisma.exists.User({ email });
    if (emailToken) {
      throw new Error('Email already taken');
    }

    const user = await prisma.mutation.createUser({ data: newUserData }, info);
    if (!user) {
      throw new Error('there are some problem in create user');
    }
    return user;
  },
  async deleteUser(parent, args, { prisma }, info) {
    const { id } = args;
    const userExist = await prisma.exists.User({ id });
    if (!userExist) throw new Error('this user not found');

    const user = await prisma.mutation.deleteUser({ where: { id } }, info);
    return user;
  },
  async updateUser(parent, args, { prisma }, info) {
    const { id, data } = args;
    const userExist = await prisma.exists.User({ id });
    if (!userExist) throw new Error('User you lookup not found');
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('id')) throw new Error('You cant change that property');
    if (dataKeys.includes('posts' || 'comments'))
      throw new Error('You can not change from that place');
    const updateUser = await prisma.mutation.updateUser({ data: data, where: { id } }, info);
    return updateUser;
  },
  async createPost(parent, args, { prisma, pubsub }, info) {
    const { data } = args;
    const { title, body, published, author } = data;
    if (!title || !body || !published) {
      throw new Error('There are require field missing');
    }
    if (!author) {
      throw new Error('No user to create post');
    }
    const userExist = await prisma.exists.User({ id: author });
    if (!userExist) throw new Error('No User with this id');
    delete data.author;
    const dataCreatePost = {
      ...data,
      author: {
        connect: {
          id: author
        }
      }
    };
    const post = await prisma.mutation.createPost({ data: dataCreatePost }, info);
    if (!post) throw new Error('there are problem in create post');
    return post;

    // const post = {
    //   id: uuidv4(),
    //   title,
    //   body,
    //   publish,
    //   author
    // };
    // posts.push(post);
    // pubsub.publish(`POST ${author}`, {
    //   post: {
    //     mutation: 'CREATED',
    //     data: post
    //   }
    // });
    // return post;
  },
  async deletePost(parent, args, { prisma, pubsub }, info) {
    const { id } = args;
    if (!id) throw new Error('there are require field is missing');
    const post = await prisma.exists.Post({ id });
    if (!post) throw new Error('no post !!');

    const postDeleted = await prisma.mutation.deletePost({ where: { id } }, info);
    return postDeleted;
    // const index = posts.indexOf(post);
    // posts.splice(index, 1);
    // comments = comments.filter(comment => comment.post !== id);
    // users.forEach(user => {
    //   if (user.posts) {
    //     user.posts.forEach(post => {
    //       if (post === id) {
    //         const index = user.posts.indexOf(post);
    //         user.posts.splice(index, 1);
    //       }
    //     });
    //   }
    // });
    // if (post.publish) {
    //   pubsub.publish(`POST ${post.author}`, {
    //     post: { mutation: 'DELETE', data: post }
    //   });
    // }
    // return post;
  },
  async updatePost(parent, args, { prisma, pubsub }, info) {
    const { id, data } = args;
    const post = await prisma.exists.Post({ id });
    if (!post) throw new Error('no user found with this id sorry');
    // const originalPost = { ...post };
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('author' || 'id')) throw new Error('You cant change that property');
    if (dataKeys.includes('comments')) throw new Error('You can change from the place ');

    const postUpdated = await prisma.mutation.updatePost({ data: data, where: { id } }, info);
    return postUpdated;

    // dataKeys.forEach(key => (post[key] = data[key]));

    // //subscription
    // if (post.publish && !originalPost.publish) {
    //   //created
    //   pubsub.publish(`POST ${originalPost.author}`, {
    //     data: {
    //       mutation: 'CREATED',
    //       data: post
    //     }
    //   });
    // } else if (!post.publish && originalPost.publish) {
    //   //deleted
    //   pubsub.publish(`POST ${originalPost.author}`, {
    //     post: {
    //       mutation: 'DELETED',
    //       data: originalPost
    //     }
    //   });
    // } else if (post.publish === originalPost.publish) {
    //   //updated
    //   pubsub.publish(`POST ${post.author}`, {
    //     post: {
    //       mutation: 'UPDATED',
    //       data: post
    //     }
    //   });
    // }
  },
  createComment(parent, args, { db, pubsub }, info) {
    let { comments, users, posts } = db;
    const { data } = args;
    const { text, author, post: postId } = data;
    if (!text) {
      throw new Error('there are required field missing');
    }
    if (!author) {
      throw new Error('no user to add comment');
    }
    if (!postId) {
      throw new Error('no post to add comment');
    }
    const userExist = users.find(user => user.id === author);
    if (!userExist) throw new Error('This user is not exist');
    const postExist = posts.find(post => post.id === postId);
    if (!postExist) throw new Error('this post not valid');

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
          mutation: 'CREATED',
          data: comment
        }
      });
    }
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    let { users, comments, posts } = db;
    const { id } = args;
    if (!id) throw new Error('no comment to delete it');
    const comment = comments.find(comment => comment.id === id);
    if (!comment) throw new Error('Sorry no post to delete it');
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
      comment: { mutation: 'DELETED', data: comment }
    });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    let { comments } = db;
    const { id, data } = args;
    const comment = comments.find(comment => comment.id === id);
    if (!comment) throw new Error('no user found with this id sorry');
    const dataKeys = Object.keys(data);
    if (dataKeys.includes('author' || 'id' || 'posts'))
      throw new Error('You cant change that property');
    dataKeys.forEach(key => (comment[key] = data[key]));
    pubsub.publish(`COMMENT ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });
    return comment;
  }
};

export { Mutation as default };
