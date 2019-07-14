import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, {db}, info){
    const emailTaken = db.user_seed.some((u)=>u.email === args.data.email);
    if (emailTaken) throw new Error("The email is already taken");
    const user = {
      id: uuidv4(),
      ...args.data
    };
    db.user_seed.push(user);
    return user;
  },
  updateUser(parent, args, {db}, info){
    const user = db.user_seed.find((u)=>u.id === args.id);
    if (!user) throw new Error("User not found");
    if (typeof args.data.email === 'string') {
      const emailTaken = db.user_seed.some((u)=>u.email === args.data.email);
      if (emailTaken) throw new Error("The email is already taken");
      user.email = args.data.email
    }
    if (typeof args.data.name === 'string') user.name = args.data.name;
    if (typeof args.data.age !== 'undefined') user.age = args.data.age;

    return user
  },
  deleteUser(parent, args, {db}, info){
    const userInex = db.user_seed.findIndex((u)=>u.id === args.id);
    if (userInex === -1) throw new Error("User not found");
    db.posts_seed = db.posts_seed.filter((p)=>{
      const match = p.author === args.id;
      if (match) {
        db.comments_seed = db.comments_seed.filter((c)=>c.post !== p.id)
      }
      return !match
    });

    db.comments_seed = db.comments_seed.filter((c)=>c.author !== args.id);

    return db.user_seed.splice(userInex, 1)[0];
  },
  createPost(parent, args, {db, pubsub}, info){
    const userExists = db.user_seed.some((u)=>u.id === args.data.author);
    if (!userExists) throw new Error("The user does not exist");
    const post = {
      id: uuidv4(),
      ...args.data
    };
    db.posts_seed.push(post);
    if (post.published) pubsub.publish('post', {
      post: {
        mutation: 'CREATED',
        data: post
      }
    });
    return post;
  },
  updatePost(parent, args, {db, pubsub}, info){
    const post = db.posts_seed.find((u)=>u.id === args.id),
          original_post = {...post};
    if (!post) throw new Error("Post not found");

    if (typeof args.data.title === 'string') post.title = args.data.title;
    if (typeof args.data.body === 'string') post.body = args.data.body;
    if (typeof args.data.published === 'boolean') {
      post.published = args.data.published;
      if (original_post.published && !post.published) {
        //deleted event
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: original_post
          }
        });
      } else if(!original_post.published && post.published) {
        // created event
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      //updated event
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post
  },
  deletePost(parent, args, {db, pubsub}, info){
    const postInex = db.posts_seed.findIndex((p)=>p.id === args.id);
    let deletedPost = {};
    if (postInex === -1) throw new Error("Post not found");
    db.comments_seed = db.comments_seed.filter((c)=>c.post !== args.id);
    deletedPost = db.posts_seed.splice(postInex, 1)[0];

    if (deletedPost.published) pubsub.publish('post', {
      post: {
        mutation: 'DELETED',
        data: deletedPost
      }
    });

    return deletedPost;
  },
  createComment(parent, args, {db, pubsub}, info){
    const userExists = db.user_seed.some((u)=>u.id === args.data.author),
      postExists = db.posts_seed.some((p)=>p.id === args.data.post && p.published);
    if (!userExists) throw new Error("The user does not exist");
    if (!postExists) throw new Error("The post does not exist");
    const comment = {
      id: uuidv4(),
      ...args.data
    };
    db.comments_seed.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }

    });

    return comment;
  },
  updateComment(parent, args, {db, pubsub}, info){
    const comment = db.comments_seed.find((u)=>u.id === args.id);
    if (!comment) throw new Error("Comment not found");
    if (typeof args.data.text === 'string') comment.text = args.data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });
    return comment
  },
  deleteComment(parent, args, {db, pubsub}, info){
    const cmtInex = db.comments_seed.findIndex((c)=>c.id === args.id);
    let deletedComment = db.comments_seed.splice(cmtInex, 1)[0];

    if (cmtInex === -1) throw new Error("Comment not found");

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    });
    return deletedComment;
  },
};
export {Mutation as default}