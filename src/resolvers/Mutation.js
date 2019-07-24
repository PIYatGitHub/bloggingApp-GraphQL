import bcrypt from 'bcryptjs'
import getUserID from '../utils/getUserID'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async createUser(parent, args, {prisma}, info) {
    const emailTaken = await prisma.exists.User({email: args.data.email});
    if (emailTaken) throw new Error('Email already taken');
    let password = await hashPassword(args.data.password);
    const user = prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });
    return {
      user,
      token: generateToken(user.id, 'ThisIsULTRAsecreT', '8h')
    }
  },
  async login(parent, args, {prisma}, info) {
    const user = await
    prisma.query.user({
      where: {email: args.data.email}
    });
    if (!user) throw new Error('Unable to login');
    const match = await
    bcrypt.compare(args.data.password, user.password);
    if (!match) throw new Error('Unable to login');
    return {
      user,
      token: generateToken(user.id, 'ThisIsULTRAsecreT', '8h')
    }
  },
  async updateUser(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
    if (typeof args.data.password === 'string') args.data.password = await hashPassword(args.data.password)
    return prisma.mutation.updateUser({
      where: {id: userID},
      data: args.data
    }, info);
  },
  async deleteUser(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
    return prisma.mutation.deleteUser({
      where: {id: userID}
    }, info);
  },
  async createPost(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {id: userID}
        }
      }
    }, info);
  },
  async updatePost(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
    
    const postExists = await prisma.exists.Post({
      id: args.id,
      author:{id:userID}
    });
    if (!postExists) throw new Error('Could not update post!');
    
    const postPublished = await prisma.exists.Post({published:true});
    if (postPublished && !args.data.published) {
      await prisma.mutation.deleteManyComments({where:{post:{id:args.id}}});
    }

    return prisma.mutation.updatePost({
      where: {id: args.id},
      data: args.data
    }, info);
  },
  async deletePost(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {id: userID}
    });
    if (!postExists) throw new Error('Unable to find post');
    return prisma.mutation.deletePost({
      where: {id: args.id}
    }, info);
  },
  async createComment(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    });
    if (!postExists) throw new Error('Unable to find post');
    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {id: userID}
        },
        post: {
          connect: {id: args.data.post}
        }
      }
    }, info);
  },
  async updateComment(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {id:userID}
    });
    if (!commentExists) throw new Error('Unable to find the comment');
    return prisma.mutation.updateComment({
      where: {id: args.id},
      data: args.data
    }, info);
  },
  async deleteComment(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {id:userID}
    });
    if (!commentExists) throw new Error('Unable to find the comment');
    return prisma.mutation.deleteComment({
      where: {id: args.id}
    }, info);
  }
};
export {Mutation as default}