import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

// prisma.mutation.createPost({
//   data: {
//     title: "POST I MOLITVI",
//     body: "lets see",
//     published: true,
//     author: {
//       connect: {
//         id: "cjy2wu4e600nc0986pudngywm"
//       }
//     }
//   }
// }, '{id title body published author {id name}}')
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 4));
//     return prisma.query.users(null, '{id name email}')
//   }).then((data) => {
//   console.log(JSON.stringify(data, undefined, 4));
// });


prisma.mutation.updatePost({
  data:{title:"Alternative Realities exist...", published: false},
  where:{
    id:"cjy2wuxr400o2098654aiv6pu"
  }
}, '{id title body published}')
  .then((data) => {
    console.log(JSON.stringify(data, undefined, 4));
    return prisma.query.posts(null, '{id title body published}')
  }).then((data) => {
  console.log(JSON.stringify(data, undefined, 4));
});

