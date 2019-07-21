import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

export {prisma as default}


// const createPostForUser = async (authorID, data)=> {
//   const userExists = await prisma.exists.User({
//    id: authorID
//   });
//
//   if (!userExists) throw new Error('User not found');
//
//   const post = await prisma.mutation.createPost({
//     data:{...data,
//     author:{
//       connect:{
//           id:authorID
//         }
//       }
//     }
//   }, '{ id author { id name email posts { id title published } } }');
//
//   return post.author
// };
//
// createPostForUser('cjy2wu4e600nc0986pudngywm',{
//     title: "Workable",
//     body: "Idiot - Leo Tolstoy",
//     published: false
// }).then((user)=>{
//   console.log(JSON.stringify(user, undefined, 2));
// }).catch((err)=>{
//   console.log(err);
// });

//
// const updatePostForUser = async (postID, data)=> {
//    const postExists = await prisma.exists.Post({
//    id: postID
//   });
//
//   if (!postExists) throw new Error('Post not found');
//
//   const post = await prisma.mutation.updatePost({
//     where:{
//       id:postID
//     }, data
//   }, '{ author {id email posts {id title body published}} }');
//
//   return post.author;
// };
//
// updatePostForUser('cjy2wuxr400o2098654aiv6pu',{
//     body: "THIS IS A FAKE UPDATE...",
//     published: true
// }).then((user)=>{
//   console.log(JSON.stringify(user, undefined, 2));
// }).catch((err)=>{
//   console.log(err);
// });


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

//
// prisma.mutation.updatePost({
//   data:{title:"Alternative Realities exist...", published: false},
//   where:{
//     id:"cjy2wuxr400o2098654aiv6pu"
//   }
// }, '{id title body published}')
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 4));
//     return prisma.query.posts(null, '{id title body published}')
//   }).then((data) => {
//   console.log(JSON.stringify(data, undefined, 4));
// });

//EXISTS METHODS


