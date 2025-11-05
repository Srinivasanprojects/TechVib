export const GRAPHQL_ENDPOINT = "https://graphqlzero.almansi.me/api";

export const GET_POSTS_QUERY = `
  query {
    posts {
      data {
        id
        title
        body
        user {
          id
          name
          username
          email
        }
      }
    }
  }
`;
