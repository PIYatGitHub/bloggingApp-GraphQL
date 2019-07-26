import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDB,{userOne} from './utils/seedDB'
import getClient from './utils/getClient'
import {createUser, login, getProfile, getUsers}from'./utils/operations'

const client = getClient();
beforeEach(seedDB);

//without auth
test('Should create a new user', async () => {
    const variables= {
        data: {
          name: "Andrew",
          email: "andrew@example.com",
          password: "MyPass123"
        }
    };

    const response = await client.mutate({
        mutation: createUser,
        variables
    });

    const exists = await prisma.exists.User({ id: response.data.createUser.user.id });
    expect(exists).toBe(true);
});

test('Should not create a new user with short pword', async () => {
    const variables = {
      data: {
        name: 'Andrew',
        email: 'andrew@example.com',
        password: '123'
      }
    };

  await expect((client.mutate({mutation:createUser, variables}))).rejects.toThrow()
});

test('Should get all public author profiles', async () => {
    const response = await client.query({query:getUsers});
    expect(response.data.users.length).toBe(2);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Jen');
});

test('Should not login with bad credentials', async () => {
    const variables = {
        data:{
          email: "peshe@1.com",
          password: "12ie8yfq8oy8qeyfqfhbsjkgs"
        }
    };

  await expect((client.mutate({mutation:login,variables}))).rejects.toThrow()
});

//with auth
test('Should fetch user profile', async ()=> {
   const client = getClient(userOne.jwt);
   const {data} = await client.query({query:getProfile});

   expect(data.me.id).toBe(userOne.user.id);
   expect(data.me.name).toBe(userOne.user.name);
   expect(data.me.email).toBe(userOne.user.email);
});