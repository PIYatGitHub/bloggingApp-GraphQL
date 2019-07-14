const Query = {
  me (parent, args, {db}, info){
  return db.user_seed[0]
},
  post (parent, args, {db}, info){
  return db.posts_seed[0]
},
  users(parent, args, {db}, info){
  if (args.query) return db.user_seed.filter((user)=> user.name.toLowerCase().includes(args.query.toLowerCase()));
  return db.user_seed
},
  posts(parent, args, {db}, info){
  if (args.query) return db.posts_seed.filter((post)=> post.title.toLowerCase().includes(args.query.toLowerCase()) ||
    post.body.toLowerCase().includes(args.query.toLowerCase()));
  return db.posts_seed
},
  comments(parent, args, {db}, info){
  return db.comments_seed
}
};

export {Query as default}

