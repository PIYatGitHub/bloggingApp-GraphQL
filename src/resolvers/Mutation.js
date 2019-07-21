import uuidv4 from "uuid/v4";

const Mutation = {
  async createUser(parent, args, {prisma}, info){
    const emailTaken = await prisma.exists.User({email:args.data.email});
    if (emailTaken) throw new Error('Email already taken');
    return prisma.mutation.createUser({ data: args.data }, info);
  },
  async updateUser(parent, args, {prisma}, info){
    const userExists = await prisma.exists.User({id:args.id});
    if (!userExists) throw new Error('No user found');
    return prisma.mutation.updateUser({
      where: {id: args.id}, data: args.data
    }, info);
  },
  async deleteUser(parent, args, {prisma}, info){
    const userExists = await prisma.exists.User({id:args.id});
    if (!userExists) throw new Error('No user found');
    return prisma.mutation.deleteUser({
      where: {id: args.id}
    }, info);
  },
  async createPost(parent, args, {prisma}, info){
    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author:{
          connect: {
            id:args.data.author
          }
        }
      }}, info);
  },
  async updatePost(parent, args, {prisma, pubsub}, info){

  },
  async deletePost(parent, args, {prisma, pubsub}, info){

  },
  async createComment(parent, args, {prisma, pubsub}, info){

  },
  async updateComment(parent, args, {prisma, pubsub}, info){

  },
  async deleteComment(parent, args, {prisma, pubsub}, info){

  }
};
export {Mutation as default}