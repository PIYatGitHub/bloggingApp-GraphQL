import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDB, {postOne, userOne, userTwo, commentOne, commentTwo} from './utils/seedDB'
import getClient from './utils/getClient'
import {deleteComment, subscribeComments} from './utils/operations'
const client = getClient();
beforeEach(seedDB);

test('Should be able to delete own comment', async ()=> {
  const client = getClient(userOne.jwt);
  const variables = {
    id:commentTwo.comment.id
  };
  await client.mutate({mutation:deleteComment, variables});
  const exists = await prisma.exists.Comment({id:commentTwo.comment.id});
  expect(exists).toBe(false);
});

test('Should not be able to delete other peoples comments', async ()=> {
  const client = getClient(userOne.jwt);
  const variables = {
    id:commentOne.comment.id
  };
  await expect(
    client.mutate({mutation:deleteComment, variables})
  ).rejects.toThrow()
});

test('Should be able to subscribe to a posts comments', async (done)=> {
  const variables = {
    postID:postOne.post.id
  };
  client.subscribe({query:subscribeComments, variables}).subscribe({
    next(response){
      expect(response.data.comment.mutation).toBe('DELETED');
      done();
    }
  });
  await prisma.mutation.deleteComment({where: { id:commentOne.comment.id }});
});