import bcrypt from "bcryptjs";
import prisma from "../../src/prisma";
import jwt from 'jsonwebtoken'

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('Red098!@#$')
  },
  user:undefined,
  jwt:undefined
};

const postOne = {
  input:{
    title: 'My published post',
    body: '',
    published: true
  },
  post: undefined
};

const postTwo = {
  input:{
    title: 'My draft post',
    body: '',
    published: false
  },
  post: undefined
};

const seedDB = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({userID:userOne.user.id}, process.env.JWT_SECRET);
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
 postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
};

export {seedDB as default, userOne, postOne, postTwo}
