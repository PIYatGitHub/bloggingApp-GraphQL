import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDB, {userOne, postOne, postTwo, commentOne} from './utils/seedDB'
import getClient from './utils/getClient'
import {updatePost, createPost, deletePost, getPosts, myPosts, subscribePosts} from './utils/operations'
const client = getClient();
beforeEach(seedDB);

//without auth
test('Should expose the published posts', async () => {
  const response = await client.query({query:getPosts});
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

//with auth
test('Should fetch all posts if authenticated', async ()=> {
  const client = getClient(userOne.jwt);
  const {data} = await client.query({query:myPosts});
  expect(data.myPosts.length).toBe(2);
});

test('Should be able to update own post', async ()=> {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  };

  const {data} = await client.mutate({mutation:updatePost, variables});
  const exists = await prisma.exists.Post({id:postOne.post.id, published:false});
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should be able to create own post', async ()=> {
  const client = getClient(userOne.jwt);
  const variables= {
    data: {
      title: "Bedtime stories",
      body:"blah",
      published: false
    }
  };
  const {data} = await client.mutate({mutation:createPost, variables});
  const exists = await prisma.exists.Post({id:data.createPost.id});
  expect(data.createPost.title).toBe('Bedtime stories');
  expect(data.createPost.body).toBe('blah');
  expect(data.createPost.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should be able to delete own post', async ()=> {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postTwo.post.id
  };
  await client.mutate({mutation:deletePost, variables});
  const exists = await prisma.exists.Post({id:postTwo.post.id});
  expect(exists).toBe(false);
});

test('Should be able to subscribe to a post', async (done)=> {
  client.subscribe({query:subscribePosts}).subscribe({
    next(response){
      expect(response.data.post.mutation).toBe('DELETED');
      done();
    }
  });
  await prisma.mutation.deletePost({where:{id:postOne.post.id}});
});