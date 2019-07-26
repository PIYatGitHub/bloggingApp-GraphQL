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

const userTwo = {
  input: {
    name: 'Popi',
    email: 'popi@popi.io',
    password: bcrypt.hashSync('pass4popi')
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

const commentOne = {
  input: {
    text:'Great ballz of fire!'
  },
  comment: undefined
};

const commentTwo = {
  input: {
    text:'Liza Mineli would aproove this!!!'
  },
  comment: undefined
};


const seedDB = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({userID:userOne.user.id}, process.env.JWT_SECRET);

  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  });
  userTwo.jwt = jwt.sign({userID:userTwo.user.id}, process.env.JWT_SECRET);

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

  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author:{
        connect:{
          id:userTwo.user.id
        }
      },
      post: {
        connect:{
          id: postOne.post.id
        }
      }
    }
  });

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author:{
        connect:{
          id:userOne.user.id
        }
      },
      post: {
        connect:{
          id: postOne.post.id
        }
      }
    }
  })
};

export {seedDB as default, userOne, userTwo, postOne, postTwo,  commentOne, commentTwo}
