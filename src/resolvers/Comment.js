const Comment = {
  author(parent, args, {db}, info){
    return db.user_seed.find((u)=>u.id === parent.author)
  },
  post(parent, args, {db}, info){
    return db.posts_seed.find((p)=>p.id === parent.post)
  }
};
export {Comment as default}