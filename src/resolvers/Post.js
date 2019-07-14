const Post = {
  author(parent, args, {db}, info){
    return db.user_seed.find((u)=>u.id === parent.author)
  },
  comments(parent, args, {db}, info){
    return db.comments_seed.filter((c)=>c.post === parent.id)
  }
};

export {Post as default}