import ApolloBoost, {
    gql
} from 'apollo-boost';

const client = new ApolloBoost({
    uri: `http://localhost:4000`
});

//users schema graphql
const getUsers = gql `
  query {
    users {
      id
      name
    }
  }
`;

//posts schema
const getPosts = gql `
    query{
        posts{
            id 
            title
            author{
                name
            }
        }
    }
`

// get user and add to html
client
    .query({
        query: getUsers
    })
    .then(response => {
        const users = response.data.users;
        users.forEach(user => {
            const userDiv = document.createElement("div");
            const userTitle = document.createElement("h3");

            userTitle.textContent = user.name;
            userDiv.appendChild(userTitle);
            document.querySelector(".users").appendChild(userDiv)
        })
    });

//get posts and add to html
client.query({
    query: getPosts
}).then(response => {
    const posts = response.data.posts
    posts.forEach(post => {
        const postDiv = document.createElement("div");
        const postTitle = document.createElement("h3");
        const postAuthor = document.createElement("h4");


        postTitle.textContent = post.title;
        postAuthor.textContent = post.author.name;

        postDiv.appendChild(postAuthor);
        postDiv.appendChild(postTitle);
        document.querySelector(".posts").appendChild(postDiv)
    })
})