import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserID from '../utils/getUserID'

const Mutation = {
  async createUser(parent, args, {prisma}, info) {
    const emailTaken = await prisma.exists.User({email: args.data.email});
    if (emailTaken) throw new Error('Email already taken');
    if (args.data.password.length < 8) throw new Error('Password must be at least 8 characters long');
    let password = await bcrypt.hash(args.data.password, 10);
    const user = prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });
    return {
      user,
      token: jwt.sign({userID: user.id}, 'ThisIsULTRAsecreT')
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
      token: jwt.sign({userID: user.id}, 'ThisIsULTRAsecreT')
    }
  },
  async updateUser(parent, args, {prisma, request}, info) {
    const userID = getUserID(request);
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
  async createComment(parent, args, {prisma}, info) {
    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {id: args.data.author}
        },
        post: {
          connect: {id: args.data.post}
        }
      }
    }, info);
  },
  async updateComment(parent, args, {prisma}, info) {
    const commentExists = await prisma.exists.Comment({id: args.id});
    if (!commentExists) throw new Error('No such comment');
    return prisma.mutation.updateComment({
      where: {id: args.id},
      data: args.data
    }, info);
  },
  async deleteComment(parent, args, {prisma}, info) {
    const commentExists = await prisma.exists.Comment({id: args.id});
    if (!commentExists) throw new Error('No such comment');
    return prisma.mutation.deleteComment({
      where: {id: args.id}
    }, info);
  }
};
export {Mutation as default}