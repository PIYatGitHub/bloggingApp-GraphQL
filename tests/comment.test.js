import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDB, {userOne, userTwo, commentOne, commentTwo} from './utils/seedDB'
import getClient from './utils/getClient'
import {deleteComment} from './utils/operations'
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

