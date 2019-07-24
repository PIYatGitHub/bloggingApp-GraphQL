import getUserID from '../utils/getUserID';

const Query = {
  users(parent, args, {prisma}, info) {
    const opArgs={};
    if (args.query) {
      opArgs.where = {
       OR:[{
         name_contains: args.query
       }, {
         email_contains: args.query
       }]
      }
    }
    return prisma.query.users(opArgs, info);
  },

  me(parent, args, {prisma, request}, info){
    const userID = getUserID(request);
    return prisma.query.user({
      where: {id:userID}
    });
  },
  async post(parent, args, {prisma, request}, info){
    const userID = getUserID(request, false);
    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
            published: true
          },{
            author: {id:userID}
          }]
      }
    },info);
    if (!posts.length) throw new Error('Post not found!');
    return posts[0];
  },
  posts(parent, args, {prisma}, info) {
    const opArgs={};
    if (args.query) {
      opArgs.where = {
        OR:[{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
      }
    }
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, {prisma}, info) {
    return prisma.query.comments(null, info);
  }
};

export {Query as default}