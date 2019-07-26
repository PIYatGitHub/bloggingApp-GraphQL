import 'cross-fetch/polyfill'
import {gql} from 'apollo-boost'
import prisma from '../src/prisma'
import seedDB, {userOne, postOne, postTwo} from './utils/seedDB'
import getClient from './utils/getClient'

const client = getClient();
beforeEach(seedDB);

//without auth
test('Should expose the published posts', async () => {
  const getPosts = gql`
      query {
          posts{
              id
              title
              body
              published
          }
      }
  `;
  const response = await client.query({query:getPosts});
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

//with auth
test('Should fetch all posts if authenticated', async ()=> {
  const client = getClient(userOne.jwt);
  const myPosts = gql`
    query {
        myPosts{
            id
            title
            body
            published
        }
    }
  `;
  const {data} = await client.query({query:myPosts});
  expect(data.myPosts.length).toBe(2);
});

test('Should be able to update own post', async ()=> {
  const client = getClient(userOne.jwt);
  const updatePost = gql`
    mutation {
        updatePost(
            id:"${postOne.post.id}",
            data: {
                published: false
            }
        ){
            id
            title
            body
            published
        }
    }
  `;
  const {data} = await client.mutate({mutation:updatePost});
  const exists = await prisma.exists.Post({id:postOne.post.id, published:false});
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should be able to create own post', async ()=> {
  const client = getClient(userOne.jwt);
  const createPost = gql`
      mutation {
          createPost(
              data: {
                  title: "Bedtime stories",
                  body:"blah",
                  published: false
              }
          ){
              id
              title
              body
              published
          }
      }
  `;
  const {data} = await client.mutate({mutation:createPost});
  const exists = await prisma.exists.Post({id:data.createPost.id});
  expect(data.createPost.title).toBe('Bedtime stories');
  expect(data.createPost.body).toBe('blah');
  expect(data.createPost.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should be able to delete own post', async ()=> {
  const client = getClient(userOne.jwt);
  const deletePost = gql`
      mutation {
          deletePost(
              id:"${postTwo.post.id}"
          ){
              id
              title
              body
              published
          }
      }
  `;
  await client.mutate({mutation:deletePost});
  const exists = await prisma.exists.Post({id:postTwo.post.id});
  expect(exists).toBe(false);
});

/*
test('Should be able toupdate own post', async ()=> {
  const client = getClient(userOne.jwt);

});
*/