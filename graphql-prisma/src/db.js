let users = [
  {
    id: "1",
    name: "mohammed",
    email: "mohammed@example.com",
    age: 19,
    posts: ["post_03"],
    comments: ["3"]
  },
  {
    id: "2",
    name: "Hadeel",
    email: "Hadeel@example.com",
    age: 20,
    posts: ["post_01", "post_02"],
    comments: ["2", "4"]
  },
  {
    id: "3",
    name: "shimaa",
    email: "shimaa@example.com",
    age: 21,
    posts: [],
    comments: ["1"]
  }
];
let posts = [
  {
    id: "post_01",
    title: "first post w",
    body: "this is first post graphql :]",
    publish: true,
    author: "1",
    comments: ["1", "4"]
  },
  {
    id: "post_02",
    title: "first post x ",
    body: "this is first post graphql :] x",
    publish: false,
    author: "1",
    comments: ["3"]
  },
  {
    id: "post_03",
    title: "first post",
    body: "this is first post graphql :] z",
    publish: true,
    author: "3",
    comments: ["2"]
  }
];

let comments = [
  {
    id: "1",
    text: "this is nice post bro",
    author: "3",
    post: "post_01"
  },
  { id: "2", text: "i hate that post !", author: "2", post: "post_03" },
  {
    id: "3",
    text: "mohammed you are nice developer",
    author: "1",
    post: "post_02"
  },
  { id: "4", text: "this is nice one bro", author: "2", post: "post_01" }
];

const db = { users, posts, comments };

export { db as default };
