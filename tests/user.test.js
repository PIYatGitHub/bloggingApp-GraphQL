import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDB from './utils/seedDB'

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
});

beforeEach(seedDB);

test('Should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name: "Andrew",
                    email: "andrew@example.com",
                    password: "MyPass123"
                }
            ){
                token,
                user {
                    id
                }
            }
        }
    `;

    const response = await client.mutate({
        mutation: createUser
    });

    const exists = await prisma.exists.User({ id: response.data.createUser.user.id });
    expect(exists).toBe(true);
});

test('Should not create a new user with short pword', async () => {
  const createUser = gql`
      mutation {
          createUser(
              data: {
                  name: "Andrew",
                  email: "andrew@example.com",
                  password: "123"
              }
          ){
              token
          }
      }
  `;

  await expect((client.mutate({mutation:createUser}))).rejects.toThrow()

});

test('Should create a public author profiles', async () => {
    const getUsers = gql`
      query {
          users{
              id
              name
              email
          }
      }
    `;
    const response = await client.query({query:getUsers});
    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Jen');
});



test('Should not login with bad credentials', async () => {
  const login = gql`
      mutation {
          login (data:{
              email: "peshe@1.com",
              password: "12ie8yfq8oy8qeyfqfhbsjkgs"
          }){
              token
          }
      }
  `;

  await expect((client.mutate({mutation:login}))).rejects.toThrow()
});