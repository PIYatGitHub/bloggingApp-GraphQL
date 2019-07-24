import getUserID from '../utils/getUserID'

const Subscription = {
  comment: {
    subscribe(parent, {postID}, {prisma}, info){
      return prisma.subscription.comment({
        where: {node: { post: {id:postID}}}
      }, info);
    }
  },
  post: {
    subscribe(parent, args, {prisma}, info){
      return prisma.subscription.post({
        where: {node: {published:true} }
      }, info);
    }
  },
  myPost: {
    subscribe(parent, args, {prisma, request}, info){
        const userID = getUserID(request);
        return prisma.subscription.post({
        where: {node: {author:{id:userID}}}
      }, info);
    }
  }

};
export {Subscription as default}