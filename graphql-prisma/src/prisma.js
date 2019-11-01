import { Prisma } from 'prisma-binding';
import { fragmentReplacement } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: `thisismyfuckensecretforprisma`,
  fragmentReplacement
});

export { prisma as default };

// prisma.query.users(null , "{id name email posts{id title body published}}")
//     .then(data=> console.log(JSON.stringify(data , undefined  ,2)))
//     .catch(err=>{
//         console.log(err)
//     });

// prisma.mutation.createPost({
//     data:{
//         title: "mohammed go ahead :)",
//         body: "allah with you inshalah",
//         published : false,
//         author:{
//             connect:{
//                 id:"ck25znztb01x0075977ipt2cw"
//             }
//         }
//     }
// },"{id title body published author{name}}").then(data=> console.log(JSON.stringify(data,null,2)))
// .catch(err=>console.log(err))

// prisma.mutation.updatePost({
//     data:{
//         published:true,
//         title: "allah with us",
//         body: "Inshallah"
//     },
//     where:{
//         id: "ck26g80jd012808593n6glvzt"
//     }
// },`{id}`).then(data =>{
//     console.log(JSON.stringify(data , null , 2))
//     return prisma.query.posts(null , `{id title body published}`)
// }).then((data)=>{
//     console.log(data)
// })

// prisma.mutation.createUser({
//     data:{
//         name:"mohammed",
//         email: "mohammed@graphql.com",
//     }
// },`{id name}`)

// prisma.exists.Comment({
//     id:"ck26ck0cb00ta0859coyj9ujp",
//     text: "this is greate post :)",
//     author:{
//         id : "ck25znztb01x0075977ipt2cw"
//     }
// }).then(existed=>{
//     console.log(existed);
// });

// const createPostForUser = async (authorId, data) => {
//     try {
//         const userExist = await prisma.exists.User({
//             id: authorId
//         });
//         if (!userExist) {
//             throw new Error("there are no user :)");
//         }
//         await prisma.mutation.createPost({
//             data: {
//                 ...data,
//                 author: {
//                     connect: {
//                         id: authorId
//                     }
//                 }
//             }
//         }, `{id}`);
//         const infoAuthor = await prisma.query.user({
//             where: {
//                 id: authorId
//             }
//         }, `{id name email  posts{id title body}}`)
//         return infoAuthor;
//     } catch (err) {
//         console.log(err.message)
//     }
// }

// createPostForUser("ck260dgur02d40759dkqkninz", {
//         title: "alazher",
//         body: "this is fucker things",
//         published: true
//     })
//     .then(data => console.log(data))
//     .catch(err => console.log(err))

// const updatePostForUser = async (postId, data) => {
//     try {
//         const postExist = await prisma.exists.Post({
//             id: postId
//         })
//         if (!postExist) {
//             throw new Error("there are no post fucken bitch")
//         }
//         const post = await prisma.mutation.updatePost({
//             data: {
//                 ...data
//             },
//             where: {
//                 id: postId
//             }
//         }, `{author{id name email posts{id title published}}}`);
//         return post.author
//     } catch (err) {
//         console.log(err.message)
//     }
// };

// updatePostForUser("power", {
//         published: true,
//         title: "yoooooooooooooooooooooooooooooooooooo"
//     })
//     .then(data => {
//         console.log(data)
//     }).catch(err => console.log(err))
