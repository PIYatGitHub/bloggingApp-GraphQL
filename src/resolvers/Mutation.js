import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
      token: jwt.sign({userID:user.id}, 'ThisIsULTRAsecreT')
    }
    },
  async login (parent, args, {prisma}, info){
    const user = await prisma.query.user({
      where: {email:args.data.email}
    });
    if (!user) throw new Error('Unable to login');
    const match = await bcrypt.compare(args.data.password, user.password);
    if (!match) throw new Error('Unable to login');

  },
  async updateUser(parent, args, {prisma}, info) {
    const userExists = await
    prisma.exists.User({id: args.id});
    if (!userExists) throw new Error('No user found');
    return prisma.mutation.updateUser({
      where: {id: args.id},
      data: args.data
    }, info);
  },
  async deleteUser(parent, args, {prisma}, info) {
    const userExists = await prisma.exists.User({id: args.id});
    if (!userExists) throw new Error('No user found');
    return prisma.mutation.deleteUser({
      where: {id: args.id}
    }, info);
  },
  async createPost(parent, args, {prisma}, info) {
    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {id: args.data.author}
        }
      }
    }, info);
  },
  async updatePost(parent, args, {prisma}, info) {
    const postExists = await prisma.exists.Post({id: args.id});
    if (!postExists) throw new Error('No such post');
    return prisma.mutation.updatePost({
      where: {id: args.id},
      data: args.data
    }, info);
  },
  async deletePost(parent, args, {prisma}, info) {
    const postExists = await prisma.exists.Post({id: args.id});
    if (!postExists) throw new Error('No such post');
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